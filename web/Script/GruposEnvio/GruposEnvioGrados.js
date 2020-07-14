let _grupos_envio_grados = [], usuario_grado_id = -1, _grado_id = -1;
function cargarEnvioGrados() {
    consultarAPI('autorizados/grados', 'GET', (_response) => {
        _grupos_envio_grados = _response;
        call_back_consulta_grados(_response);
    });
}
function call_back_consulta_grados(_response) {
    let _html = '';
    _response.forEach((c, i) => {
        _html += renderizar_grados_envio(c, i);
    });   
    document.getElementById('tbodyGrados').innerHTML = _html;
    $('[data-toggle="tooltip"]').tooltip();
}
function renderizar_grados_envio(_curso, _index) {
    let _list = '';
    _list += `<tr id=index_${_index}>`;
    _list += `<td>${_curso.Descripcion}</td>`;
    _list += `<td>${_curso.Nombres} ${_curso.Apellidos}</td>`;
    _list += `<td class="text-center"><button onclick="eliminar_grado(${_index},this)" class="btn-icono" data-toggle="tooltip" data-placement="top" title="" data-original-title="Eliminar"><i class="fas fa-trash"></i></button></td>`;
    _list += `</tr>`;


    return _list;
}
function fixed_grados() {
    setTimeout(c => { fixed_table_scroll('tblGrados'); }, 300);
}
function agregar_grado() {
    if (validar_informacion()) {
        consultarAPI('autorizados/grados', 'POST', _response => {
            _grupos_envio_grados = _response;
            call_back_consulta_grados(_response);
            limpiar_registro();
        }, armar_objeto_grado());
    } else window.parent.mostrar_mensajes('', 'Todos los campos son obligatorios', 'error', true, false, false, 'Aceptar');
}
function armar_objeto_grado() {
    let _my_object = { GrEnAuGraId: 0, GrEnAuGraGradoId: 0, GrEnAuGraPersonaId: 0 }
    _my_object.GrEnAuGraGradoId = _grado_id;
    _my_object.GrEnAuGraPersonaId = usuario_grado_id;

    return _my_object;
}
function validar_informacion() {
    if (usuario_grado_id == -1 || _grado_id == -1) {
        return false;
    }
    return true;
}
function buscar_grados(_this) {
    let _text = _this.value;
    let filtered = [];
    if (_text == '') {
        filtered = _grupos_envio_grados;
    }
    else {
        filtered = _grupos_envio_grados.filter((item) => {
            return Object.keys(item).some(
                (key) => item[key] != null && item[key].toString().toLocaleLowerCase().includes(_text.toLocaleLowerCase()));
        });
    }
    call_back_consulta_grados(filtered);
    setTimeout(c => { fixed_table_scroll('tblDatosCursos'); }, 300);
}
function limpiar_registro() {
    $('#GrEnAuGraGradoId_-1').val('');
    $('#GrEnAuGraPersonaId_-1').val('');
}
function eliminar_grado(_index, _this) {
    consultarAPI('autorizados/grados/eliminar', 'POST', (_response) => {
        _grupos_envio_grados = _response;
        call_back_consulta_grados(_response);
    }, _grupos_envio_grados[_index])
}
(function () {
    cargarEnvioGrados();

    autocomplete('GrEnAuGraGradoId_-1', 'grado/filtro?demo=1', 'GraDescripcion', 'GraCodigo', 'Buscar grado', selected => {
        _grado_id = selected.GraId;

    });
    autocomplete('GrEnAuGraPersonaId_-1', 'Personas?tipo=1', 'PerNombres', 'PerApellidos', 'Buscar docente', selected => {
        usuario_grado_id = selected.PerId;
    });
})();