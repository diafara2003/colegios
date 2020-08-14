let _lstempresas = [], _data = {}, _adjuntos_cargados = 0

function nueva_empresa() {

    _data = {
        empresa: { PerIdEmpresa: -1, PerId: -1 },
        persona: { EmpId: -1 }
    };

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
    let _url = window.location.href.toLowerCase().split('views')[0];
    const url = `${_url}api/Adjuntos${armar_url_adjuntos()}`;
    const _emp = _lstempresas[_id];
    _data = _emp;
    $('#divEmpresa').removeClass('d-none');
    $('#btnAgregarEmpresa').addClass('d-none');
    $('#btnModificarEmpresa').removeClass('d-none');

    document.getElementById('EmpNombre').value = _emp.empresa.EmpNombre;
    document.getElementById('EmpDireccion').value = _emp.empresa.EmpDireccion;
    document.getElementById('EmpNit').value = _emp.empresa.EmpNit;
    document.getElementById('PerClave').value = _emp.persona.PerClave;
    if (_emp.empresa.EmpLogo != null) {

        try {
            document.getElementById('imglogoColegio').src = `${_url}api/adjuntos/${_emp.empresa.EmpLogo}`;
        } catch (e) {

        }

        
    } else {
        document.getElementById('imglogoColegio').src ='';
    }


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
    _data.empresa.EmpLogo = _adjuntos_cargados;

    _data.persona.PerNombres = _data.empresa.EmpNombre;
    _data.persona.PerDocumento = _data.empresa.EmpNit;
    _data.persona.PerIdEmpresa = _data.empresa.EmpId;

    return _data;
}
async function agregar_datos() {
    _data = {
        empresa: { PerIdEmpresa: -1, PerId: -1 },
        persona: { EmpId: -1 }
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
    try {
        document.getElementById('imglogoColegio').src = '';
    } catch (e) {

    }
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
            || x.empresa.EmpNit
                .toString().toLocaleLowerCase().includes(_text));
    }
    renderizar_empresas(filtered);
}
async function subirAdjunto() {

    let _url = window.location.href.toLowerCase().split('views')[0];
    var id = -1;

    if (_data != undefined && _data.EmpId != undefined) {
        id = _data.empresa.EmpId;
    }

    var formData = new FormData();
    var file = $('#myInput')[0];
    formData.append('file', file.files[0]);
    formData.append('nuevaEmpresa', true);
    formData.append('idEmpresa', id);
    formData.append('nombreEmpresa', document.getElementById('EmpNombre').value);



    $.ajax({
        url: `${_url}api/Adjuntos${armar_url_adjuntos()}`,
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('sesion')}`,
            'Accept': 'application/json',
        },
        data: formData,
        contentType: false,
        processData: false,
        success: async function (_response) {
            if (_adjuntos_cargados != 0) {
                await consultarAPI('adjunto/eliminar', 'POST', undefined, {
                    id: _adjuntos_cargados
                });
            }

            _adjuntos_cargados = _response.AjdId;
            try {
                document.getElementById("imglogoColegio").src = `${_url}api/adjuntos/${_response.AjdId}`;
            } catch (e) {

            }
            

            if (_data != undefined && _data.empresa.EmpId > 0) {
                modificar_empresa();
            }

        },
        error: function () {
            alert("Faild please try upload again");
        }
    });
}
function cargar_adjuntos() {

}
function armar_url_adjuntos() {
    let _url = '';
    let _usuario = obtener_session().idusuario, _adjunto = 0;

    _url += '?usuario=' + _usuario;
    _url += '&adjunto=' + _adjunto;

    return _url;
}
function adjuntar() {
    $('#myInput').click();
}
(function () {
    consultar_empresas();
})();