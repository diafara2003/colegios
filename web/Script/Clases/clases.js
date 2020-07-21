let temporada_activa = {}, datos_clases = [],cursoId=-1;


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
    let grado = $('#ddlGrados').find('option:selected').val();

    //  consultar_materias_grado(grado);
    consultar_cursos_grado(grado);
}
function consultar_cursos_grado(grado) {
    consultarAPI('Curso/grado?grado=' + grado, 'GET', (response) => {
        renderizar_cursos(response, grado);
        if (response.length == 1) {
            $('#Divcursos').find('a').addClass('active');
            $('#Divcursos').find('a').click();
        }
    });
}
function renderizar_cursos(cursos, id_grado) {
    let _html = '<option value="-1">--Seleccione un curso---</option>';
    let _htnl_cursos = '';
    cursos.forEach(grado => {
        _html += '<option value="' + grado.CurId + '" ' + (cursos.length == 1 ? 'selected' : '') + '>' + grado.CurDescripcion + '</option>';
        _htnl_cursos += '<a id="CurId_' + grado.CurId + '" onclick="consultar_materias_curso(this,' + grado.CurId + ')" class="list-group-item list-group-item-action">' + grado.CurDescripcion + '</a><div grado="' + grado.CurId + '" class="mt-2 fade show curso" id-posicion="' + grado.CurId + '" id="Grado_' + grado.CurId + '"></div>';
    });
    //document.getElementById('ddlCursos').innerHTML = _html;
    document.getElementById('Divcursos').innerHTML = _htnl_cursos;
}
function consultar_materias_curso(_this, id_grado) {
    cursoId = id_grado;
    $('#Divcursos').find('.active').removeClass('active');
    $(_this).addClass('active');
    $('.curso').css('display', 'none');
    $('[grado="' + id_grado + '"]').css('display', 'block');

    // let grado = $('#ddlGrados').find('option:selected').val();
    consultarAPI('clase/materias?empresa=1&curso=' + id_grado, 'GET', response => {
        datos_clases = response;
        renderizar_materias_curso(id_grado, response);

    })
}
function renderizar_materias_curso(id_grado, materias) {
    let html = '<table class="table table-sm " id="tblPersonas_' + id_grado + '">';
    let _tbody = '';
    let table_thead = '';
    table_thead += '<thead>';
    table_thead += '<tr>';
    table_thead += '<th scope="col">Materia</th>';
    table_thead += '<th scope="col">Código</th>';
    table_thead += '<th scope="col">Docente</th>';
    table_thead += '<th scope="col">Salón</th>';
    table_thead += '</tr>';
    table_thead += '</thead>';

    _tbody += '<tbody>';
    materias.forEach((materias, index) => {
        var id_profesor = `ClaProfesor_${index}__${materias.Claid}`;
        var id_salon = `ClaSalonId_${index}__${materias.Claid}`;
        _tbody += '<tr posicion="' + materias.Claid + '">';
        _tbody += '<th>' + materias.MatDescripcion + '</th>'
        _tbody += '<td><div class="input-group input-group-sm">';
        _tbody += '<input type="text" maxlength="50" class="form-control" id="ClaCodigo_' + index + '" value="' + materias.ClaCodigo + '" onblur="guardar_info(this,' + index+')" placeholder="Código">';
        _tbody += '</div></td>';
        _tbody += '<td><div class="input-group input-group-sm">';
        _tbody += '<input type="text" maxlength="50" class="form-control ac-personas" onfocusin="setAutocomolete(' + index + ',' + materias.Claid + ')" id="' + id_profesor + '" value="' + materias.NombreProfesor + '" placeholder="Docente" />';
        _tbody += '</div></td>';
        _tbody += '<td><div class="input-group input-group-sm">';
        _tbody += '<input type="text" maxlength="50" class="form-control ac-salones" onfocusin="setAutocomolete_salon(' + index + ',' + materias.Claid + ')" id="' + id_salon + '" value="' + materias.NombreSalon + '" placeholder="Salón" />';
        _tbody += '</div></td>';
        _tbody += '</tr>';
    });
    _tbody += '</tbody>';

    html += table_thead;
    html += _tbody;
    html += '</table>';

    document.getElementById('Grado_' + id_grado).innerHTML = html;
}
function setAutocomolete(index, id_clase) {
    var id_profesor = `ClaProfesor_${index}__${id_clase}`;
    if ($('#' + id_profesor).closest('.easy-autocomplete').length == 0) {
        autocomplete(id_profesor, 'Personas?tipo=1', 'PerNombres', 'PerApellidos', 'Profesor', (selected, input) => {
            let _index = input.split('_')[1];
            let _data = obtener_datos($(input), _index);
            guardar_datos(_index, _data);
        });
    }

    $('#' + id_profesor).focus();
}
function setAutocomolete_salon(index, id_clase) {
    var id_salon = `ClaSalonId_${index}__${id_clase}`;
    if ($(`#${id_salon}`).closest('.easy-autocomplete').length == 0) {
        autocomplete(id_salon, 'salon/filtro?id=0', 'SalDescripcion', 'SalCodigo', 'Salón', (selected, input) => {
            let _index = input.split('_')[1];
            let _data = obtener_datos($(input), _index)
            guardar_datos(_index,_data);
        });
    }

    $(`#${id_salon}`).focus();
}
function guardar_info(_this,_index) {
    let _data = obtener_datos(_this,_index);
    guardar_datos(_index,_data);
}
function guardar_datos(_index, data) {

    consultarAPI('Clases', 'POST', (response) => {
        datos_clases[_index] = response.clases;
    }, data);
}
function obtener_datos(_this, _index) {
    var myobject = {
        Claid: 0, ClaEmpId: 1, ClaTemporada: 0, ClaCodigo: '',
        ClaMateriaId: 0, ClaSalonId: 0, ClaCursoId: 0,
        ClaProfesor: 0, ClaObservacion: ''
    }
    let tr = $(_this).closest('tr');
    myobject.Claid = datos_clases[_index].Claid;
    myobject.ClaTemporada = obtener_session().temporada;
    myobject.ClaCodigo = tr.find('input').eq(0).val();
    myobject.ClaMateriaId = datos_clases[_index].MatID;
    myobject.ClaCursoId = cursoId;

    if (tr.find('input').eq(1).attr('result') != undefined) {
        myobject.ClaProfesor = JSON.parse(tr.find('input').eq(1).attr('result')).PerId;
    } else {
        if (tr.find('input').eq(1).val() != '') {
            myobject.ClaProfesor = datos_clases[_index].ClaProfesor;
        } else {
            myobject.ClaProfesor = null;
        }
    }

    if (tr.find('input').eq(2).attr('result') != undefined) {
        myobject.ClaSalonId = JSON.parse(tr.find('input').eq(2).attr('result')).SalId;
    } else {
        if (tr.find('input').eq(2).val() != '') {
            myobject.ClaSalonId = datos_clases[_index].ClaSalonId;
        } else {
            myobject.ClaSalonId = null;
        }
        
    }

    return myobject;
}

(function () {    
    consultar_grados();
})();