let datos_materias = [], temporada_activa = {};

function consultar_grados() {
    consultarAPI('Grados', 'GET', renderizar_grados);
}
function renderizar_grados(response) {

    let _html = '<option value="-1">--Seleccione un grado---</option>';
    response.forEach(grado => {
        _html += '<option value="' + grado.GraId + '">' + grado.GraDescripcion + '</option>';
    });
    document.getElementById('ddlGrados').innerHTML = _html;
}
function selected_grado() {
    $('#tbodymaterias').empty();
    let grado = $('#ddlGrados').find('option:selected').val();
    consultar_materias_curso();
}
function consultar_materias_curso() {
    
    let grado = $('#ddlGrados').find('option:selected').val();
    consultarAPI('Materias?empresa=1&grado=' + grado, 'GET', response => {
        datos_materias = response;
        renderizar_materias_curso( response);
        eventos_materias();
    })
}
function renderizar_materias_curso( materias) {
    var _tbody = '';
    materias.forEach((materias) => _tbody += renderizar_tr_materias(materias));

    document.getElementById('tbodymaterias').innerHTML = _tbody;
}
function renderizar_tr_materias(materias) {
    let _tbody = '';

    _tbody += '<tr posicion="' + materias.MatID + '">';

    _tbody += '<td value-initial="' + materias.MatAreaId + '" id="MatAreaId_' + materias.MatID + '">' + materias.nombreArea + '</td>'

    _tbody += '<td><div class="input-group input-group-sm">';
    _tbody += '<input type="text" maxlength="50" class="form-control form-control-sm" onblur="modificar_materias(' + materias.MatID  + ')" id="MatCodigo_' + materias.MatID + '" value="' + materias.MatCodigo + '" placeholder="Código" />';
    _tbody += '</div></td>';

    _tbody += '<td><div class="input-group input-group-sm">';
    _tbody += '<input type="text" maxlength="50" class="form-control form-control-sm" onblur="modificar_materias(' + materias.MatID  + ')" id="MatDescripcion_' + materias.MatID + '" value="' + materias.MatDescripcion + '" placeholder="Código" />';
    _tbody += '</div></td>';


    _tbody += '<td id="TempEstado_' + materias.MatID + '"  class="text-center">';
    _tbody += '<div class="custom-control custom-switch">';
    _tbody += '<input type="checkbox" onclick="modificar_materias(' + materias.MatID + ')" class="custom-control-input" onclick="modificar_temporada(' + materias.MatID + ')" id="customSwitch_' + materias.MatID + '"  ' + (materias.MatElectiva ? 'checked' : '') + '>';
    _tbody += '<label class="custom-control-label" for="customSwitch_' + materias.MatID + '"></label>';
    _tbody += '</div>';
    _tbody += '</td>';


    _tbody += '<td class="text-center"><button onclick="eliminar_materia(this,' + materias.MatID + ')" class="btn-icono"><i class="fas fa-trash"></i></button></td>';
    _tbody += '</tr>';

    return _tbody;
}
function eventos_materias() {
    setTimeout(c => { fixed_table_scroll('tblPersonas'); }, 300);
}
function agregar_materia() {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
    let nueva_data = obtener_datos_materias(-1);

    consultarAPI('materias', 'POST', function (response) {
        datos_materias.push(response.materia);
        let nuevo_tr = renderizar_tr_materias(response.materia);

        $('#tbodymaterias').append(nuevo_tr);
        limpiar_registro_materias(-1);
        $('#MatCodigo_-1').focus();
        eventos_materias();
        window.parent.cerrar_mensaje();
    }, nueva_data);
}
function modificar_materias(id) {
    let data_changed = obtener_datos_materias(id);
    consultarAPI('materias', 'PUT', function (response) {
        let _index = datos_materias.findIndex(c => c.MatID == data_changed.MatID);
        datos_materias[_index] = response.materia;
        
    }, data_changed);
}
function eliminar_materia(_this, _posicion) {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');

    let data_changed = { MatID: _posicion };
    consultarAPI('materias/' + _posicion, 'DELETE', function (response) {
        let _index = datos_materias.findIndex(c => c.MatID == data_changed.MatID);
        datos_materias.splice(_index, 1);
        $(_this).closest('tr').remove();
        window.parent.cerrar_mensaje();
    }, data_changed);
}
function obtener_datos_materias(posicion) {

    var _data = { MatID: 0, MatEmpId: 1, MatTemporadaId: 0, MatAreaId: 0, MatGradoId: 0, MatCodigo: '', MatDescripcion: '', MatEstado: 1, MatElectiva: false };

    _data.MatEmpId = obtener_session().empresa;
    _data.MatTemporadaId = obtener_session().temporada;

    if (posicion == -1) {
        _data.MatAreaId = $('#MatAreaId_' + posicion).find('option:selected').val()
    } else {

        _data.MatAreaId = $('#MatAreaId_' + posicion).attr('value-initial');
    }


    if (document.getElementById('MatCodigo_' + posicion).tagName.toLowerCase() == 'div') {
        _data.MatCodigo = document.getElementById('MatCodigo_' + posicion).textContent;
    } else {
        _data.MatCodigo = document.getElementById('MatCodigo_' + posicion).value;
    }

    if (document.getElementById('MatDescripcion_' + posicion).tagName.toLowerCase() == 'div') {
        _data.MatDescripcion = document.getElementById('MatDescripcion_' + posicion).textContent;
    } else {
        _data.MatDescripcion = document.getElementById('MatDescripcion_' + posicion).value;
    }

    if (posicion != -1) {
        _data.MatID = posicion;
    }
    _data.MatGradoId = $('#ddlGrados').find('option:selected').val();    
    _data.MatElectiva = $('#customSwitch_' + posicion).is(':checked') ? 1 : 0;


    return _data;
}
function limpiar_registro_materias(posicion) {
    document.getElementById('MatCodigo_' + posicion).value = "";
    document.getElementById('MatDescripcion_' + posicion).value = "";

}
function renderizar_ddl_areas_materias() {
    $('#MatAreaId_-1').empty();
    
    _data_area_materia.forEach(t => {
        $('#MatAreaId_-1').append('<option value="' + t.ArMaId + '">' + t.ArMaDescripcion + '</option>');
    })
}
function ver_materias() {
    renderizar_ddl_areas_materias();
    setTimeout(c => { fixed_table_scroll('tblDatosGrados'); }, 300);
}
(function () {
    
    consultar_grados();
})();

