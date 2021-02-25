let _data_profesores = [], idEdit = 0, _data_grupos = [];



function abrir_modal_agregar() {


    $('#exampleModal').find('ul.active').removeClass('active');

    $('#exampleModal').modal('show');
}
async function consultar_grupos() {
    const response = await consultarAPI('Grupos', 'GET');

    _data_grupos = response;
    renderizar_grupos(response);


}
async function consultar_profesores() {
    const response = await consultarAPI('Profesor', 'GET');

    _data_profesores = response;


    renderizar_profesores(response);

    await consultar_grupos();

    eventos_profesores();
}
function eventos_profesores() {

}
function renderizar_profesores(source) {
    let _html = '';

    if (source.length > 0)
        source.forEach(item => _html += renderizar_tr_profesores(item));
    else _html = no_hay_grupos();

    document.getElementById('tbltemporada').innerHTML = _html;
}
function renderizar_tr_profesores(_item) {

    return `<tr>
                <td id="nombre_${_item.id}">${_item.nombre}</td>
                <td id="apellido_${_item.id}">${_item.apellido}</td>
                <td id="email_${_item.id}">${_item.email}</td>
                <td id="celular_${_item.id}">${_item.celular}</td>
                <td id="grupos_${_item.id}">${renderizar_grupos_profesor(_item.grupos)}</td>
                <td class="text-left">
                <button onclick="editar(${_item.id})" type="button" class="btn btn-default btn-circle"><i class="fas fa-edit"></i></button>
                <button onclick="eliminar(${_item.id},this)" type="button" class="btn btn-default btn-circle"><i class="fas fa-trash"></i></button>                
                </td>
            </tr>
        `;
}
function renderizar_grupos_profesor(_grupos) {
    let _html = ''

    if (_grupos != null && _grupos.length > 0)
        _grupos.forEach(c => _html += `<div class="d-block">${c.nombre}</div>`);


    return _html;
}
function no_hay_grupos() {
    return `<tr>
                <td colspan="6" class="text-center"><h6>No hay registros</h6></td>              
            </tr>
        `;
}
function renderizar_grupos(_grupos) {
    let _html = ``;

    _grupos.forEach(c => _html += `<li onclick="Selecionar_Grupo(this,${c.IdGrupo})" id="grupo_${c.IdGrupo}" class="list-group-item">${c.Nombre}</li> `);

    $('.list-group').append(_html);
}
function Selecionar_Grupo(_this) {

    if ($(_this).hasClass('active'))
        $(_this).removeClass('active')

    else $(_this).addClass('active')

}
async function agregar_profesores() {
    const _objeto = armar_objeto(undefined, '-1');

    if (validar(_objeto)) {

        const _result = await consultarAPI('Profesor', 'POST', undefined, _objeto);


        $('#exampleModal').modal('hide');

        _objeto.id = _result.codigo;

        alertify.success('Profesor creado');

        $('#tbltemporada').append(renderizar_tr_profesores(_objeto));


        _data_profesores.push(_objeto);

        set_input('-1', { nombre: '', apellido: '', email: '', celular: '' });

    }

}
function armar_objeto(id, id_text) {
    var myObject = {
        id: -1, nombre: '', apellido: '', email: '', celular: '',
        grupos: []
    };

    if (id != undefined) {
        myObject.id = id;
    }



    myObject.nombre = document.getElementById(`nombre_${id_text}`).value;
    myObject.apellido = document.getElementById(`apellido_${id_text}`).value;
    myObject.email = document.getElementById(`email_${id_text}`).value;
    myObject.celular = document.getElementById(`celular_${id_text}`).value;

    let _expresion = ''

    if (id_text == 'Edit') _expresion = '#modalEditar';
    else _expresion = '#exampleModal';



    $(_expresion).find('.list-group').find('li.active').each(function () {
        myObject.grupos.push({
            id: $(this).attr('id').split('_')[1],
            nombre: $(this).text()
        });
    });




    return myObject;
}
function validar(_object) {
    if (_object.email != '' && !validar_correo(_object.email)) {

        alertify.error('Correo invalido');
        return false;
    }

    if (_object.nombre == '' ) {

        alertify.error('Nombre del profesor obligatorio');
        return false;
    }

    return true;
}
async function eliminar(id, _this) {
    const _response = await consultarAPI(`Profesor/${id}`, 'DELETE');

    $(_this).closest('tr').remove();
}
async function editar(id) {
    idEdit = id;
    const _item = _data_profesores.find(c => c.id == id);

    set_input('Edit', _item);

    $('#modalEditar').find('.active').removeClass('active');


    if (_item.grupos != null && _item.grupos.length > 0) {
        _item.grupos.forEach(c => {

            $('#modalEditar').find(`#grupo_${c.id}`).addClass('active');
        });
    }


    $('#modalEditar').modal('show');
}
function set_input(_id, _item) {
    document.getElementById(`nombre_${_id}`).value = _item.nombre;
    document.getElementById(`apellido_${_id}`).value = _item.apellido;
    document.getElementById(`email_${_id}`).value = _item.email;
    document.getElementById(`celular_${_id}`).value = _item.celular;
}
async function editar_registro() {

    const _objeto = armar_objeto(idEdit, 'Edit');
    if (validar(_objeto)) {
        const _item = _data_profesores.find(c => c.id == idEdit);

        actualizar_objeto(_objeto);

        await consultarAPI(`Profesor/${idEdit}`, 'POST', undefined, _objeto);
        idEdit = 0;
        $('#modalEditar').modal('hide');

    }

}
function actualizar_objeto(_objeto) {
    const _item = _data_profesores.findIndex(c => c.id == idEdit);

    _data_profesores[0] = _objeto;
    

    $(`#nombre_${idEdit}`).text(_objeto.nombre);
    $(`#apellido_${idEdit}`).text(_objeto.apellido);
    $(`#email_${idEdit}`).text(_objeto.email);
    $(`#celular_${idEdit}`).text(_objeto.celular);

    $(`#grupos_${idEdit}`).empty();
    $(`#grupos_${idEdit}`).append(renderizar_grupos_profesor(_objeto.grupos));
}
consultar_profesores();