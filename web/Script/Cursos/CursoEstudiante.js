let data_personas = [];

function consultar_curso(id) {
    consultarAPI(`cursos/${id}`, 'GET', (response) => {
        document.getElementById('nombrecurso').textContent = `${response[0].CurDescripcion} (${response[0].CurCodigo})`;
    });
}
function consultar_estudiantes(curso, div_Estudiante) {
    consultarAPI('Persona/estudiantes/sinasignar?curso=' + curso, 'GET', (response) => {
        if (curso == 0) data_personas = response;

        renderizar_estudiantes(response, div_Estudiante, curso);
    });
}
function renderizar_estudiantes(estudiantes, div_estudiantes, curso) {
    let _html = '';
    estudiantes.forEach(persona => {
        _html += renderizar_tr_sin_curso(persona, curso);
    });
    document.getElementById(div_estudiantes).innerHTML = _html;
}
function renderizar_tr_sin_curso(estudiante, curso) {
    let _tr = '';
    _tr += ' <a href="#" class="list-group-item list-group-item-action" >';
    _tr += '<div class="d-flex w-100 justify-content-between" ' + (curso == 0 ? 'onclick="asignar_estudiante(' + estudiante.PerId + ')"' : 'onclick="desasignar_estudiante(' + estudiante.PerId + ')"')+'>';
    _tr += `<div>${estudiante.PerApellidos} ${estudiante.PerNombres}</div>`;
    _tr += `<small>${estudiante.PerTIpoDoc} - ${estudiante.PerDocumento}</small>`;
    _tr += '</div>';
    _tr += '</a>';
    return _tr;
}
function asignar_estudiante(idestudiante) {
    mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
    let curso = Get_query_string('curso');
    let _data = { CurEstId: 0, CurEstCursoId: curso, CurEstEstudianteId: idestudiante };
    consultarAPI('curso/asignar/estudiante', 'POST', response => {
        consultar_estudiantes(0, 'estudiantes_sin_asignar');
        consultar_estudiantes(curso, 'estudiantes_asignados');
        cerrar_mensaje();
    }, _data);
}
function buscar_Estudiante(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _data_cursos;
    }
    else {
        filtered = data_personas.filter(x =>
            x.PerApellidos.toString().toLowerCase().indexOf(_text) > -1
            || x.PerNombres.toString().toLowerCase().indexOf(_text) > -1
            || x.PerDocumento.toString().toLowerCase().indexOf(_text) > -1            
        );
    }
    let curso = Get_query_string('curso');
    renderizar_estudiantes(filtered,'estudiantes_sin_asignar', curso);
    setTimeout(c => { fixed_table_scroll('tblDatosCursos'); }, 300);
}
function desasignar_estudiante(idestudiante) {
    mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
    let curso = Get_query_string('curso');
    let _data = { CurEstId: 0, CurEstCursoId: curso, CurEstEstudianteId: idestudiante };
    consultarAPI('curso/eliminar/estudiante', 'POST', response => {
        consultar_estudiantes(0, 'estudiantes_sin_asignar');
        consultar_estudiantes(curso, 'estudiantes_asignados');
        cerrar_mensaje();
    }, _data);
}
function mostrar_mensajes(titulo, mensaje, icono = '',
    showConfirmButton = false,
    showCloseButton = false,
    showCancelButton = false,
    confirmButtonText = '', confirmButtonAriaLabel = '',
    cancelButtonText = '', cancelButtonAriaLabel = '') {
    Swal.fire({
        title: titulo,
        icon: icono,
        html: mensaje,
        showConfirmButton: showConfirmButton,
        showCloseButton: showCloseButton,
        showCancelButton: showCancelButton,
        focusConfirm: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: confirmButtonText,
        confirmButtonAriaLabel: confirmButtonAriaLabel,
        cancelButtonText: cancelButtonText,
        cancelButtonAriaLabel: cancelButtonAriaLabel
    })
}
function cerrar_mensaje() {
    swal.close()
}
(function () {
    let curso = Get_query_string('curso');
   // consultar_curso(curso);
    consultar_estudiantes(0, 'estudiantes_sin_asignar');
    consultar_estudiantes(curso, 'estudiantes_asignados');
})();