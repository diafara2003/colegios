async function consultar_grupos() {
    const response = await consultarAPI('Grupos', 'GET');

    _data_grupos = response;
    renderizar_grupos(response);


}
function renderizar_grupos(_grupos) {
    let _html = ``;

    _grupos.forEach(c => _html += `<option value="${c.IdGrupo}" >${c.Nombre}</option> `);

    $('#ddlgrupo').append(_html);
}


consultar_grupos();