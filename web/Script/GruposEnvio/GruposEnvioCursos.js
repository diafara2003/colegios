let _grupos_envio_cursos = [], _curso_curso_id = -1, usuario_id = -1;



function cargarEnvioCursos() {
    consultarAPI('autorizados/cursos', 'GET', (_response) => {
        _grupos_envio_cursos = _response;
        call_back_consulta_cursos(_response);
    });
}
function call_back_consulta_cursos(_response) {
    let _html = '';
    _response.forEach((c, i) => {
        _html += renderizar_cursos_envio(c, i);
    });
    
    document.getElementById('tbodyCursos').innerHTML = _html;
    
    fixed_cursos();
}
function renderizar_cursos_envio(_curso, _index) {
    let _list = '';
    _list += `<tr id=index_${_index}>`;
    _list += `<td>${_curso.Descripcion}</td>`;
    _list += `<td>${_curso.Nombres} ${_curso.Apellidos}</td>`;
    _list += `<td class="text-center"><button onclick="eliminar_curso(${_index},this)" class="btn-icono" ><i class="fas fa-trash"></i></button></td>`;
    _list += `</tr>`;


    return _list;
}
function fixed_cursos() {
    setTimeout(c => { fixed_table_scroll('tblCursos'); }, 300);
}
function agregar_curso() {
    if (validar_cursos()) {
        consultarAPI('autorizados/cursos', 'POST', _response => {
            _grupos_envio_cursos = _response;
            call_back_consulta_cursos(_response);
            limpiar_registro();
        }, armar_objeto_curso());
    } else {
        window.parent.mostrar_mensajes('', 'Todos los campos son obligatorios', 'error', true, false, false, 'Aceptar');        
    }

}
function validar_cursos() {
    if (_curso_curso_id == -1 || usuario_id == -1)
        return false;

    return true;
}
function armar_objeto_curso() {
    let _my_object = { GrEnAuCurId: 0, GrEnAuCurCursoId: 0, GrEnAuCurPersonaId: 0 }

    _my_object.GrEnAuCurCursoId = _curso_curso_id;
    _my_object.GrEnAuCurPersonaId = usuario_id;

    return _my_object;

}
function limpiar_registro() {
    $('#GrEnAuCurCursoId_-1').val('');
    $('#GrEnAuCurPersonaId_-1').val('');
}
function buscar_cursos(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _grupos_envio_cursos;
    }
    else {
        filtered = _grupos_envio_cursos.filter((item) => {
            return Object.keys(item).some(
                (key) => item[key] != null && item[key].toString().toLocaleLowerCase().includes(_text.toLocaleLowerCase()));
        });
    }
    call_back_consulta_cursos(filtered);
    
}
function eliminar_curso(_index,_this) {
    consultarAPI('autorizados/cursos/eliminar', 'POST', (_response) => {
        _grupos_envio_cursos = _response;
        call_back_consulta_cursos(_response);
    }, _grupos_envio_cursos[_index])
}
(function () {
    cargarEnvioCursos();

    autocomplete('GrEnAuCurCursoId_-1', 'curso/filtro?demo=1', 'CurDescripcion', 'CurCodigo', 'Buscar curso', selected => {
        _curso_curso_id = selected.CurId;

    });
    autocomplete('GrEnAuCurPersonaId_-1', 'Personas?tipo=1', 'PerNombres', 'PerApellidos', 'Buscar docente', selected => {
        usuario_id = selected.PerId;
    });
})();