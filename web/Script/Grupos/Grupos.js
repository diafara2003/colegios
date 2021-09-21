let _data_grupos = [], idEdit = 0;


async function consultar_grupos() {
    const response = await consultarAPI('Grupos', 'GET');

    _data_grupos = response;
    renderizar_grupos(response);

    eventos_grupos();
}
function eventos_grupos() {

}
function renderizar_grupos(source) {
    let _html = '';

    if (source.length > 0)
        source.forEach(item => _html += renderizar_tr_grupos(item));
    else _html = no_hay_grupos();

    document.getElementById('tbltemporada').innerHTML = _html;
}
function renderizar_tr_grupos(_item) {

    return `<tr>
                <td id="Nombre_${_item.IdGrupo}">${_item.Nombre}</td>
                <td class="text-center">${_item.Estudiantes}</td>
                <td>${renderizar__profesor(_item.profesores)}</td>
                <td class="text-left">
                <button onclick="editar(${_item.IdGrupo})" type="button" class="btn btn-default btn-circle"><i class="fas fa-edit"></i></button>
                <button onclick="eliminar(${_item.IdGrupo},this)" type="button" class="btn btn-default btn-circle"><i class="fas fa-trash"></i></button>                
                </td>
            </tr>
        `;
}
function renderizar__profesor(_profesor) {
    let _html = ''

    if (_profesor != null && _profesor.length > 0)
        _profesor.forEach(c => _html += `<div class="d-block">${c.nombre} ${c.apellido}</div>`);


    return _html;
}
function no_hay_grupos() {
    return `<tr>
                <td colspan="4" class="text-center"><h6>No hay registros</h6></td>              
            </tr>
        `;
}
function modelIsValid(_value) {
    
    if (_data_grupos.find(c => c.Nombre.toLowerCase() == _value.toLowerCase()) == null) return true;
    else return false;
}
async function agregar_grupo() {

    if (modelIsValid(document.getElementById('GrNombre').value)) {

        const _result = await consultarAPI('Grupos', 'POST', undefined, armar_objeto(undefined, 'GrNombre'));


        $('#exampleModal').modal('hide');

        alertify.success('Grupo creado');

        const _nuevo_registro = {
            Nombre: document.getElementById('GrNombre').value,
            Estudiantes: 0,
            Profesores: '',
            IdGrupo: _result.codigo
        };

        $('#tbltemporada').append(renderizar_tr_grupos(_nuevo_registro));


        _data_grupos.push(_nuevo_registro);

        document.getElementById('GrNombre').value = '';
    } else 
        alertify.error('El grupo ya existe');
    
}
function armar_objeto(id, id_text) {
    var myObject = {
        GrId: -1, GrEmpresa: 0, GrTemporada: 0, GrNombre: ''
    };

    if (id != undefined) {
        myObject.GrId = id;
    }
    myObject.GrNombre = document.getElementById(id_text).value;

    return myObject;
}
async function eliminar(id, _this) {
    const _response = await consultarAPI(`grupos/${id}`, 'DELETE');

    $(_this).closest('tr').remove();
}
async function editar(id) {
    idEdit = id;
    const _item = _data_grupos.find(c => c.IdGrupo == id);

    document.getElementById('GrNombreEdit').value = _item.Nombre;
    $('#modalEditar').modal('show');
}
async function editar_registro() {

    const _item = _data_grupos.find(c => c.IdGrupo == idEdit);

    _item.Nombre = document.getElementById('GrNombreEdit').value;

    $(`#Nombre_${idEdit}`).text(_item.Nombre);

    await consultarAPI(`grupos/${idEdit}`, 'POST', undefined, armar_objeto(_item.IdGrupo, 'GrNombreEdit'));
    idEdit = 0;
    $('#modalEditar').modal('hide');
}
consultar_grupos();

