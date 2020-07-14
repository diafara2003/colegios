function cargarGrupoEnvios() {
    consultarAPI('GrupoEnvio', 'GET', (_response) => {
        let _html = '';
        _response.forEach(c => {
            _html += renderizar_grupos_envio(c);
        });

        document.getElementById('tbodyGrupos').innerHTML = _html;
    });
}

function renderizar_grupos_envio(_grupo) {
    let _list = '';
    _list += `<tr>`;
    _list += `<td>${_grupo.GrEnColorObs}</td>`;
    _list += `<td class="text-center"><input type="color" value="#ffffff" id="head" name="head"/></td>`;
    _list += `<td class="text-center"><input type="color" value="#ffffff" id="head" name="head"/></td>`;    
    _list += `</tr>`;


    return _list;
}

(function () {
    cargarGrupoEnvios();
})();