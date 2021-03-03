let _data_estudiante = [], idEdit = 0, _data_grupos = [];
const _template_grupos = '';


function buscar_estudiantes(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _data_estudiante;
    }
    else {
        filtered = _data_estudiante.filter(
            x => x.nombres.toString().toLowerCase().includes(_text)
                || x.apellidos.toString().toLowerCase().includes(_text)
        );
    }
    renderizar_estudiantes(filtered);
}
function abrir_modal_agregar() {

    window.location.href = window.location.href.split('estudiantes')[0] + 'estudiantes/agregar.html'
}
async function consultar_grupos() {
    const response = await consultarAPI('Grupos', 'GET');

    _data_grupos = response;
}
function _renderizar_estado(activo) {
    return `<select class="form-control input-sm estado" onchange="actualizar(this)">
            <option value="1" ${(activo ? `selected="selected"` : ``)}>Activo</option>            
            <option value="0" ${(!activo ? `selected="selected"` : ``)}>Inactivo</option>            
            </select>`;

}
function renderizar_grupos(_idGrupo) {
    let _html = `<select class="form-control input-sm grupo" onchange="actualizar(this)">`;

    _data_grupos.forEach(c => _html += `<option value="${c.IdGrupo}" ${(_idGrupo == c.IdGrupo ? `selected="selected"` : ``)}>${c.Nombre}</li> `);
    _html += `</option>`;
    return _html;
}
async function actualizar(_this) {
    const _tr = $(_this).closest('tr');


    var _data = { id: 0, idgrupo: 0, estado: true };

    _data.id = _tr.attr('id');
    _data.idgrupo = $(_tr).find('.grupo').find('option:selected').val();
    _data.estado = $(_tr).find('.estado').find('option:selected').val() == 1 ? true : false;


    consultarAPI('Estudiantes', 'PUT', undefined, _data);
}
async function consultar_estudiantes() {

    await consultar_grupos();

    const response = await consultarAPI('Estudiantes', 'GET');

    _data_estudiante = response;


    renderizar_estudiantes(response);


    $('[data-toggle="tooltip"]').tooltip();
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
                <td id="grupos_${_item.id}">${_renderizar_estado(_item.estado)}</td>                
                <td class="text-left">                
                <button title="Editar" data-toggle="tooltip" onclick="editar(${_item.id})" type="button" class="btn btn-default btn-circle"><i class="fas fa-edit"></i></button>
                <button title="Eliminar" data-toggle="tooltip" onclick="eliminar(${_item.id},this)" type="button" class="btn btn-default btn-circle"><i class="fas fa-trash"></i></button>                
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
function editar(_id) {
    window.location.href = window.location.href.split('estudiantes')[0] + 'estudiantes/agregar.html?id=' + _id;
}
let _eliminar = 0, _ctx = undefined;
function eliminar(_id, _this) {

    const _data = _data_estudiante.find(c => c.id == _id);
    _ctx = _this;

    _eliminar = _data.id;
    $('#h6Eliminar').text(`¿Está seguro que desa eliminar el estudiante ${_data.nombres} ${_data.apellidos}?`);
    $('#modalEliminar').modal('show');

}
async function confirmar_eliminar() {
    await consultarAPI('estudiantes/' + _eliminar, 'DELETE');

    $(_ctx).closest('tr').remove();
    _ctx = undefined;
    _eliminar = 0;

    $('#modalEliminar').modal('hide');
}
consultar_estudiantes();