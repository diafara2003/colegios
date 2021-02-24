let _data_grupos = [];


function consultar_grupos() {
    consultarAPI('Grupos', 'GET', function (response) {
        _data_grupos = response;
        renderizar_grupos(response);

        eventos_salones();
    });
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
                <td>${_item.Nombre}</td>
                <td class="text-left">${_item.Estudiantes}</td>
                <td>${_item.Profesores}</td>
                <td class="text-left">
                <button type="button" class="btn btn-default btn-circle"><i class="fas fa-trash"></i></button>
                <button type="button" class="btn btn-default btn-circle"><i class="fas fa-edit"></i></button>
                </td>
            </tr>
        `;
}
function no_hay_grupos() {
    return `<tr>
                <td colspan="4" class="text-center"><h6>No hay registros</h6></td>              
            </tr>
        `;
}
async function agregar_grupo() {
    const _result = await consultarAPI('Grupos', 'POST', undefined, armar_objeto());


    $('#exampleModal').modal('hide');

    alertify.success('Grupo creado');

    $('#tbltemporada').append(renderizar_tr_grupos({
        Nombre: document.getElementById('GrNombre').value,
        Estudiantes: 0,
        Profesores: ''
    }));

    document.getElementById('GrNombre').value = '';

}
function armar_objeto() {
    var myObject = {
        GrId: -1, GrEmpresa: 0, GrTemporada: 0, GrNombre: ''
    };


    myObject.GrNombre = document.getElementById('GrNombre').value;

    return myObject;
}

consultar_grupos();

var delay = alertify.get('notifier', 'delay');
alertify.set('notifier', 'delay', 9999);
alertify.set('notifier', 'position', 'top-right');
