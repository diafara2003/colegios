let _data_estudiante = [], idEdit = 0, _data_grupos = [];
const _template_grupos = '';



function abrir_modal_agregar() {

    window.location.href = window.location.href.split('estudiantes')[0] + 'estudiantes/agregar.html'
}
async function consultar_grupos() {
    const response = await consultarAPI('Grupos', 'GET');

    _data_grupos = response;
}
function _renderizar_estado(activo) {
    return `<select onclick="selected_estado(this)">
            <option ${(activo ? `selected="selected"` : ``)}>Activo</option>            
            <option ${(!activo ? `selected="selected"` : ``)}>Activo</option>            
            </select>`;

}
function renderizar_grupos(_idGrupo) {
    let _html = `<select onclick="selected_grupo(this)">`;

    _data_grupos.forEach(c => _html += `<option ${(_idGrupo == c.id ? `selected="selected"` : ``)}>${c.Nombre}</li> `);
    _html += `</option>`;
    return _html;
}
function selected_estado(_this) {

}
function selected_grupo(_this) {

}
async function consultar_estudiantes() {

    await consultar_grupos();

    const response = await consultarAPI('Estudiantes', 'GET');

    _data_estudiante = response;


    renderizar_estudiantes(response);



}
function renderizar_estudiantes(source) {
    let _html = '';

    if (source.length > 0)
        source.forEach(item => _html += renderizar_tr_estudiantes(item));
    else _html = no_hay_estudiantes();

    document.getElementById('tbltemporada').innerHTML = _html;
}
function renderizar_tr_estudiantes(_item) {

    return `<tr id=${_item.id}>
                <td id="nombre_${_item.id}">${_item.nombres}</td>
                <td id="apellido_${_item.id}">${_item.apellidos}</td>
                
                <td id="celular_${_item.id}">${renderizar_grupos(_item.grupo.id)}</td>
                <td id="grupos_${_renderizar_estado(_item.estado)}"></td>                
                <td class="text-left">
                <button onclick="mostrar_estudiante(${_item.id})" type="button" class="btn btn-default btn-circle"><i class="fas fa-eye"></i></button>
                <button onclick="editar(${_item.id})" type="button" class="btn btn-default btn-circle"><i class="fas fa-edit"></i></button>
                <button onclick="eliminar(${_item.id},this)" type="button" class="btn btn-default btn-circle"><i class="fas fa-trash"></i></button>                
                </td>
            </tr>
        `;
}
function no_hay_estudiantes() {
    return `<tr>
                <td colspan="6" class="text-center"><h6>No hay registros</h6></td>              
            </tr>
        `;
}
function mostrar_estudiante(_id) {

}

consultar_estudiantes();