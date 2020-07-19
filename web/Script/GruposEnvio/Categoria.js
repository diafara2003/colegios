let _lstcategorias = [];


function cargarCategorias() {
    consultarAPI('autorizados/categoria', 'GET', (_response) => {
        _lstcategorias = _response;
        call_back_categorias(_response);
    });
}
function call_back_categorias(_response) {
    let _html = '';
    _response.forEach((c, _i) => {
        _html += renderizar_categorias(c, _i);
    });

    document.getElementById('TbogyCategorias').innerHTML = _html;
    fixed_cursos();
}
function renderizar_categorias(_grupo, index) {
    let _list = '';
    _list += `<tr>`;
    _list += `<td>${_grupo.CatDescripcion}</td>`;
    //_list += `<td class="text-center"><input onblur="actualizar_categoria(${index})" type="text" value="${_grupo.CatDescripcion}" id="CatDescripcion_${index}"/></td>`;
    _list += `<td class="text-center"><input type="color" onblur="actualizar_categoria(${index})" value="${_grupo.CatColor}" id="CatColor_${index}"/></td>`;


    _list += `<td class="text-center">`;
    _list += '<div class="custom-control custom-switch">';
    _list += '<input type="checkbox" class="custom-control-input" onclick="actualizar_categoria(' + index + ')" id="CarHoraPermitida_' + index + '"  ' + (_grupo.CarHoraPermitida ? 'checked' : '') + '>';
    _list += `<label class="custom-control-label" for="CarHoraPermitida_${index}"></label>`;
    _list += '</div>';
    _list += '</td>';

    _list += `<td class="text-center"><button onclick="eliminar_categoria(${index},this)" class="btn-icono" data-toggle="tooltip" data-placement="top" title="" data-original-title="Eliminar"><i class="fas fa-trash"></i></button></td>`;
    _list += `</tr>`;


    return _list;
}
function buscar_categorias(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _lstcategorias;
    }
    else {
        filtered = _lstcategorias.filter((item) => {
            return Object.keys(item).some(
                (key) => item[key] != null && item[key].toString().toLocaleLowerCase().includes(_text.toLocaleLowerCase()));
        });
    }
    call_back_categorias(filtered);
}
function fixed_cursos() {
    setTimeout(c => { fixed_table_scroll('tblCategorias'); }, 300);
}
function actualizar_categoria(_index) {
    consultarAPI('autorizados/categoria', 'POST', () => { }, armar_objeto_categoria(_index));
}
function armar_objeto_categoria(_index) {
    let data_cagetoria = {};
    if (_index != -1)
        data_cagetoria = _lstcategorias[_index];
    else {
        data_cagetoria.CatId = -1;
        data_cagetoria.CatEmpresaId = obtener_session().empresa;
        data_cagetoria.CatDescripcion = $(`#CatDescripcion_${_index}`).val();
    }


    data_cagetoria.CatColor = $(`#CatColor_${_index}`).val();
    data_cagetoria.CarHoraPermitida = $('#CarHoraPermitida_' + _index).is(':checked');

    return data_cagetoria;
}
function agregar_categoria() {
    if (validar_categoria(-1)) {
        consultarAPI('autorizados/categoria', 'POST', _response => {
            _lstcategorias = _response;
            call_back_categorias(_response);
            limpiar_registro_categorias();
        }, armar_objeto_categoria(-1));
    } else {
        window.parent.mostrar_mensajes('', 'Todos los campos son obligatorios', 'error', true, false, false, 'Aceptar');
    }
}
function validar_categoria(_index) {
    if ($(`#CatDescripcion_${_index}`).val() == '' || $(`#CatColor_${_index}`).val() == '')
        return false;

    return true;
}
function limpiar_registro_categorias() {
    $('#CatDescripcion_-1').val('');
    $('#CatColor_-1').val('');
}
function eliminar_categoria(_index, _this) {
    consultarAPI('autorizados/categoria/eliminar', 'POST', (_response) => {
        _lstcategorias = _response;
        call_back_categorias(_response);
    }, _lstcategorias[_index])
}
(function () {
    cargarCategorias();
})();