

let _data_cursos = [], temporada_activa = {}, grados = [], tutor_id = -1, auxiliar_id = -1;

function eventos_cursos() {
    $('[contenteditable="true"]').off('click');
    $('[contenteditable="true"]').focusin(function () {
        selectText(this);
    });
}
function consultar_cursos() {
    consultarAPI('cursos', 'GET', function (response) {
        _data_cursos = response;
        renderizar_cursos(response);

        eventos_cursos();
    });
}
function renderizar_cursos(source) {
    let _html = '';

    source.forEach((item, _index) => _html += renderizar_tr_cursos(item, _index));

    document.getElementById('tblcursos').innerHTML = _html;
}
function renderizar_tr_cursos(_item, _index) {
    let _tr = '';
    _tr += '<tr posicion=' + _index + '>';
    _tr += '<th scope="row"><div contenteditable="true" value-initial="' + _item.CurGrado + '" id="div_CurGrado_' + _item.CurId + '" onfocusin="crear_elemento(this,' + _item.CurId + ',' + _item.CurGrado + ')">' + _item.NombreGrado + '</th>';
    _tr += '<td scope="row"><div id="CurCodigo_' + _item.CurId + '" contenteditable="true" onblur="modificar_cursos(' + _item.CurId + ')">' + _item.CurCodigo + '</td>';
    _tr += '<td scope="row"><div id="CurDescripcion_' + _item.CurId + '" contenteditable="true" onblur="modificar_cursos(' + _item.CurId + ')">' + _item.CurDescripcion + '</td>';
    _tr += '<td scope="row"><input type="text" class="input-autocomplete"  onblur="modificar_cursos_ac(this,' + _item.CurId + ',0)"  onclick="iniciar_ac(\'CurTutor_' + _item.CurId + '\')" maxlength="20" id= "CurTutor_' + _item.CurId + '" value="' + _item.Nombretutor + '"/></td>';
    _tr += '<td scope="row"><input type="text" class="input-autocomplete"  onblur="modificar_cursos_ac(this,' + _item.CurId + ',1)"  onclick="iniciar_ac(\'CurAuxiliar_' + _item.CurId + '\')" maxlength="20" id= "CurAuxiliar_' + _item.CurId + '"  value="' + _item.NombreAuxiliar + '"/></td>';
    _tr += '<td class="text-center"><button onclick="asignar_estudiantes(' + _item.CurId + ',' + _index+')" class="btn-icono" data-toggle="tooltip" data-placement="top" title="" data-original-title="Eliminar"><i class="fas fa-user-graduate"></i></button></td>';
    _tr += '<td class="text-center"><button onclick="eliminar_cursos(this,' + _item.CurId + ')" class="btn-icono" data-toggle="tooltip" data-placement="top" title="" data-original-title="Eliminar"><i class="fas fa-trash"></i></button></td>';
    _tr += '</tr>';

    return _tr;
}
function crear_elemento(_this, id, _value) {
    let _html = '<div style="height:19px">' + renderizar_ddl_grados(true, id, _value) + '</div>';
    let _th = $(_this).closest('th');
    _th.empty();

    _th.append(_html);
    $('#CurGrado_' + id).focus();
}
function quitar_elemento(_this) {
    let _html = '';
    let posicion = $(_this).closest('tr').attr('posicion');
    let _th = $(_this).closest('th');
    _item = _data_cursos[posicion];
    _th.empty();
    if (_item != undefined && _item.CurId != undefined) {
        _html = '<div id="div_CurGrado_' + _item.CurId + '" value-initial="' + _item.CurGrado + '"  contenteditable="true" onfocusin="crear_elemento(this,' + _item.CurId + ',' + _item.CurGrado + ')">' + _item.NombreGrado + '';
        _th.append(_html);

        _th.next().find('div').focus();
    }

}
function modificar_cursos(id, _this) {
    let data_changed = obtener_datos_curso(id);
    consultarAPI('cursos', 'PUT', function (response) {
        let _index = _data_cursos.findIndex(c => c.CurId == data_changed.CurId);
        _data_cursos[_index] = response.curso;

        if (_this != undefined)
            quitar_elemento(_this);
    }, data_changed);
}
function modificar_cursos_ac(_this, id, property) {
    if (_this.value == '') {
        let posicion = $(_this).closest('tr').attr('posicion');
        if (property == 0) {
            tutor_id = _data_cursos[posicion].CurAuxiliar;
        } else {
            auxiliar_id = _data_cursos[posicion].CurTutor;
        }

        modificar_cursos(id);
    }
}
function agregar_curso() {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
    let nueva_data = obtener_datos_curso(-1);

    if (nueva_data.TempAno != '') {
        consultarAPI('cursos', 'POST', function (response) {
            _data_cursos.push(response);
            let nuevo_tr = renderizar_tr_cursos(response);

            $('#tblcursos').append(nuevo_tr);
            limpiar_registro_cursos(-1);
            $('#CurCodigo_-1').focus();
            eventos_cursos();
            window.parent.cerrar_mensaje();
        }, nueva_data);
    }

}
function eliminar_cursos(_this, _posicion) {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');

    let data_changed = obtener_datos_curso(-1)
    consultarAPI('cursos/' + _posicion, 'DELETE', function (response) {
        let _index = _data_cursos.findIndex(c => c.CurId == data_changed.CurId);
        _data_cursos.splice(_index, 1);
        $(_this).closest('tr').remove();
        window.parent.cerrar_mensaje();
    }, data_changed);
}
function obtener_datos_curso(posicion) {

    var _data = { CurId: 0, CurCodigo: '', CurDescripcion: 1, CurEmpId: 1, CurTutor: 1, CurAuxiliar: 1, CurTemporada: -1, CurGrado: -1 };

    if (posicion == -1) {
        _data.CurGrado = $('#CurGrado_' + posicion).find('option:selected').val()
    } else if ($('#CurGrado_' + posicion).length == 0) {
        //value-initial div_CurGrado_
        _data.CurGrado = $('#div_CurGrado_' + posicion).attr('value-initial');
    } else {
        _data.CurGrado = $('#CurGrado_' + posicion).find('option:selected').val()
    }


    if (document.getElementById('CurCodigo_' + posicion).tagName.toLowerCase() == 'div') {
        _data.CurCodigo = document.getElementById('CurCodigo_' + posicion).textContent;
    } else {
        _data.CurCodigo = document.getElementById('CurCodigo_' + posicion).value;
    }

    if (document.getElementById('CurDescripcion_' + posicion).tagName.toLowerCase() == 'div') {
        _data.CurDescripcion = document.getElementById('CurDescripcion_' + posicion).textContent;
    } else {
        _data.CurDescripcion = document.getElementById('CurDescripcion_' + posicion).value;
    }

    if (posicion != -1) {
        _data.CurId = posicion;
    }
    _data.CurTemporada = temporada_activa.TempId;
    _data.CurAuxiliar = auxiliar_id;
    _data.CurTutor = tutor_id;
    _data.CurEmpId = obtener_session().empresa;

    return _data;
}
function limpiar_registro_cursos(posicion) {
    document.getElementById('CurCodigo_' + posicion).value = "";
    document.getElementById('CurDescripcion_' + posicion).value = "";
    document.getElementById('CurTutor_' + posicion).value = "";
    document.getElementById('CurDescripcion_' + posicion).value = "";

}
function renderizar_ddl_temporada() {
    $('#CurTemporada_-1').empty();

    $('#CurTemporada_-1').append('<option selected>Seleccione...</option>');
    temporada_activa = _data_termporada.find(f => f.TempEstado == 1)
    //.forEach(t => {
    //    $('#CurTemporada_-1').append('<option value="' + t.TempId + '">' + t.TempAno + '</option>');
    //})
}
function renderizar_ddl_grados(retornar_html, posicion, _value) {
    //


    if (retornar_html == undefined) {
        $('#CurGrado_-1').empty();
        _data_grados.forEach(t => {
            $('#CurGrado_-1').append('<option value="' + t.GraId + '">' + t.GraDescripcion + '</option>');
        })
    }
    else {
        let _html = '<select onblur="quitar_elemento(this,' + posicion + ')" onchange="modificar_cursos(' + posicion + ',this)" style="margin:0;padding:0;height:19px;font-size:13.5px" class="form-control" id="CurGrado_' + posicion + '">';
        _data_grados.forEach(t => {
            _html += '<option value="' + t.GraId + '"  ' + (_value == t.GraId ? 'selected' : '') + '>' + t.GraDescripcion + '</option>';
        });
        _html += '</select>';

        return _html;
    }

}
function buscar_cursos(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _data_cursos;
    }
    else {
         filtered = data_personas.filter((item) => {
            return Object.keys(item).some(
                (key) => item[key] != null && item[key].toString().toLocaleLowerCase().includes(_text));
        });
    }
    
    renderizar_cursos(filtered);
    setTimeout(c => { fixed_table_scroll('tblDatosCursos'); }, 300);
}
function ver_cursos() {
    renderizar_ddl_temporada();
    renderizar_ddl_grados();
    setTimeout(c => { fixed_table_scroll('tblDatosCursos'); }, 300);
}
function iniciar_ac(id, placeholder, property, tipo) {
    autocomplete(id, 'Personas?tipo=1', 'PerNombres', 'PerApellidos', placeholder, (selected, id_ac) => {
        tutor_id = -1;
        auxiliar_id = -1;
        let posicion = $(id_ac).closest('tr').attr('posicion');
        let _curso = _data_cursos[posicion];

        if (id_ac.indexOf("CurTutor_") != -1) tutor_id = selected.PerId;
        else auxiliar_id = selected.PerId;

        modificar_cursos(_curso.CurId);

    });
    $('#' + id).focus();
    selectText($('#' + id));

}
function asignar_estudiantes(id_curso, index) {
    let _curso = _data_cursos[index];
    $('#frameasignacion').attr('src', `../Cursos/CursoEstudiante.html?T=C&curso=${id_curso}`);
    $('#exampleModal').modal('show');
    $('#nombrecurso').text(`   ${_curso.CurDescripcion} (${_curso.CurCodigo})`);
    //  let url = `../Cursos/CursoEstudiante.html?T=C&curso=${id_curso}`;
    // window.open(url);
}
function calcular_height_frame() {
    let _window = $(this).outerHeight(true);
  
    $('#frameasignacion').css('height', (_window - (160)) + 'px');

}
(function () {
    calcular_height_frame();
    consultar_cursos();

    autocomplete('CurTutor_-1', 'Personas?tipo=1', 'PerNombres', 'PerApellidos', 'Buscar tutor', selected => {
        tutor_id = selected.PerId;

    });
    autocomplete('CurAuxiliar_-1', 'Personas?tipo=1', 'PerNombres', 'PerApellidos', 'Buscar tutor', selected => {
        auxiliar_id = selected.PerId;
    });

})();