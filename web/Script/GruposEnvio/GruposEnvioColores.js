let _lstcategoriasColores = [];


function cargarGrupoEnvios() {
    consultarAPI('GrupoEnvio', 'GET', (_response) => {
        _lstcategoriasColores = _response;
        let _html = '';
        _response.forEach((c, _i) => {
            _html += renderizar_grupos_envio(c, _i);
        });

        document.getElementById('tbodyGrupos').innerHTML = _html;
    });
}
function renderizar_grupos_envio(_grupo, index) {
    let _list = '';
    _list += `<tr>`;
    _list += `<td>${_grupo.GrEnColorObs}</td>`;
    _list += `<td class="text-center"><input onblur="actualizar_color(${index})" type="color" value="${_grupo.GrEnColorBurbuja}" id="GrEnColorBurbuja_${index}"/></td>`;
    _list += `<td class="text-center"><input type="color" onblur="actualizar_color(${index})" value="${_grupo.GrEnColorRGB}" id="GrEnColorRGB_${index}"/></td>`;
    _list += `</tr>`;


    return _list;
}

function actualizar_color(_index) {
    consultarAPI('GrupoEnvio', 'POST', () => { }, armar_objeto(_index));
}
function armar_objeto(_index) {
    let data_cagetoria = _lstcategoriasColores[_index];

    data_cagetoria.GrEnColorBurbuja = $(`#GrEnColorBurbuja_${_index}`).val();
    data_cagetoria.GrEnColorRGB = $(`#GrEnColorRGB_${_index}`).val();

    return data_cagetoria;
}


(function () {
    cargarGrupoEnvios();
})();