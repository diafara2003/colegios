let _lstempresas = [], _data = {};

function nueva_empresa() {
    limpiar_Registro();
    active_list_empresa();
    $('#divEmpresa').removeClass('d-none');
    $('#btnAgregarEmpresa').removeClass('d-none');
    $('#btnModificarEmpresa').addClass('d-none');

    document.getElementById('PerClave').value = random_data(10);
}
function generar_clave() {
    document.getElementById('PerClave').value = random_data(10);
}
async function consultar_empresas() {
    _lstempresas = await consultarAPI('Empresa', 'GET');

    renderizar_empresas(_lstempresas);
}
function renderizar_empresas(data) {
    let _html = '';
    data.forEach((r, _i) => {
        _html += ` <li onclick="set_empresa(${_i},this)" id="${_i}" class="list-group-item ">${r.empresa.EmpNombre}</li>`;
    });
    document.getElementById('ulempresas').innerHTML = _html;
}
function set_empresa(_id, _this) {
    const _emp = _lstempresas[_id];
    _data = _emp;
    $('#divEmpresa').removeClass('d-none');
    $('#btnAgregarEmpresa').addClass('d-none');
    $('#btnModificarEmpresa').removeClass('d-none');

    document.getElementById('EmpNombre').value = _emp.empresa.EmpNombre;
    document.getElementById('EmpDireccion').value = _emp.empresa.EmpDireccion;
    document.getElementById('EmpNit').value = _emp.empresa.EmpNit;
    document.getElementById('PerClave').value = _emp.persona.PerClave;

    active_list_empresa(_this);
}
function active_list_empresa(_this) {
    $('#ulempresas').find('li').removeClass('active');
    if (_this != undefined)
        $(_this).addClass('active');
}
async function modificar_empresa() {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
    const obtener_datos = obtener_datos_formulario();
    await consultarAPI('Empresa', 'PUT', undefined, obtener_datos);
    window.parent.cerrar_mensaje();
}
function obtener_datos_formulario() {
    _data.empresa.EmpNombre = document.getElementById('EmpNombre').value;
    _data.empresa.EmpDireccion = document.getElementById('EmpDireccion').value;
    _data.empresa.EmpNit = document.getElementById('EmpNit').value;
    _data.persona.PerClave = document.getElementById('PerClave').value;


    _data.persona.PerNombres = _data.empresa.EmpNombre;
    _data.persona.PerDocumento = _data.empresa.EmpNit;
    _data.persona.PerIdEmpresa = _data.empresa.EmpId;

    return _data;
}
async function agregar_datos() {
    _data = {
        empresa: { PerIdEmpresa: -1, PerId:-1},
        persona: { EmpId:-1}
    };
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
    const obtener_datos = obtener_datos_formulario();
    const response = await consultarAPI('Empresa', 'POST', undefined, obtener_datos);

    if (response.codigo < 0)
        window.parent.mostrar_mensajes('', response.respuesta, 'error', true, false, false, 'Aceptar');
    else {
        _data.empresa.EmpId = response.codigo;
        _data.persona.PerId = parseInt(response.respuesta);
        _data.persona.PerIdEmpresa = response.codigo;
        _lstempresas.push(_data);
        limpiar_Registro();
        renderizar_empresas(_lstempresas);
        _data = {};
        window.parent.cerrar_mensaje();
    }
    
}
function limpiar_Registro() {
    document.getElementById('EmpNombre').value = '';
    document.getElementById('EmpDireccion').value = '';
    document.getElementById('EmpNit').value = '';
    document.getElementById('PerClave').value = '';
}
function buscar_empresas(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _lstempresas;
    }
    else {
        filtered = _lstempresas.filter(x =>
            x.empresa.EmpNombre.toString().toLowerCase().includes(_text)
            || x.empresa.EmpNit.toString().toLocaleLowerCase().includes(_text));
    }
    renderizar_empresas(filtered);
}
(function () {
    consultar_empresas();
})();