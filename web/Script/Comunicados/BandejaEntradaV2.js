const _tipo_mensaje = { bandeja: 0, Enviados: 1, NoLeidos: 2 }
let _mensaje_context = {};
let id_bandeja = -1;
let _is_recibido = 0;
let _sesion = {};//39;

function mostrar_mensaje() {
    if ($('#DivMensaje').hasClass('d-none')) {
        $('#DivMensaje').addClass('animate__animated animate__fadeInLeft');
        $('#DivMensaje').addClass('d-flex').removeClass('d-none');
        $('#DivPrincipal').addClass('d-none').removeClass('d-flex');
        $('#tblMensajes').addClass('d-none');

    } else {
        $('#DivMensaje').addClass('d-none').removeClass('d-flex');
        $('#DivPrincipal').addClass('d-flex').removeClass('d-none');
        $('#tblMensajes').removeClass('d-none');
    }

}
function cargar_bandeja(tipo) {
    
    consultarAPI(`BandejaEntrada/mensajes?tipo=${_tipo_mensaje[tipo]}`, 'GET', response => {
        let _html = '';
        _html = no_hay_mensajes();
        if (response.length > 0) {
            response.forEach(_mensaje => {
                _html += renderizar_bandeja(_mensaje);
            });
        } else {
            _html = no_hay_mensajes();
        }
        document.getElementById('tbodydatos').innerHTML = _html;
    });

    window.parent.cargar_mensajes_no_leidos();

    
    limpiar_mensaje_leido();
}
function renderizar_bandeja(_mensaje) {
    let _html = '';
    const color = _mensaje.MenColor == "" ? "#ebebeb" : _mensaje.MenColor;
    //border: 2px solid #A8518A
    _html += `<tr class="${_mensaje.BanHoraLeido == null ? '' : 'mensaje-leido '}" onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">`;
    //_html += `<div style="border: 2px solid ${color}"></div>`;
    _html += '<td><div class="custom-control custom-checkbox">';
    _html += `<input type="checkbox" class="custom-control-input" id="customCheck${_mensaje.MenId}">`;
    _html += `<label class="custom-control-label" for="customCheck${_mensaje.MenId}"></label>`;
    _html += '</td>';
    _html += `<td>${_mensaje.PerApellidos} ${_mensaje.PerNombres}</td>`;
    _html += `<td>${_mensaje.MenAsunto}</td>`;
    _html += `<td>${_mensaje.MenFecha.split(' ')[0]}</td>`;
    _html += '</tr>';

    return _html;
}
function no_hay_mensajes() {
    let _html = '';

    _html += '<tr><td colspan="4"><div class="text-center pt-5" id="cargando_mensajes">';
    _html += '<span style="color:#6c757d" >No hay mensajes</span>';
    _html += '<br/><i style="font-size:62px;color:#6c757d" class="far fa-envelope-open"></i>';
    _html += '</div></td></tr>';

    return _html;
}
function limpiar_mensaje_leido() {
    document.getElementById('MenAsunto').textContent = "";
    document.getElementById('MenUsuario').textContent = "";
    document.getElementById('MenFecha').textContent = "";
    document.getElementById('MenMensaje').innerHTML = "";
}
function consultar_mensaje(_this,_id, _idBandeja, _is_rta_ok) {
    id_bandeja = _idBandeja;    
    _is_recibido = _is_rta_ok;
    if (_is_rta_ok == 1) {
        $('.recividook').addClass('bg-success text-white');
    } else {
        $('.recividook').removeClass('bg-success text-white');
    }

    consultarAPI(`Mensajes/${_id}`, 'GET', response => {
        if (!$(_this).hasClass('mensaje-leido')) $(_this).addClass('mensaje-leido');
        renderizar_mensaje(response);
        mostrar_mensaje();
        window.parent.cargar_mensajes_no_leidos();
    });
}
function renderizar_mensaje(_mensaje) {
    document.getElementById('MenAsunto').textContent = _mensaje.MenAsunto;
    document.getElementById('MenUsuario').textContent = _mensaje.usuario.PerApellidos + ' ' + _mensaje.usuario.PerNombres;
    document.getElementById('MenFecha').textContent = moment(_mensaje.MenFecha).format("DD/MM/YYYY HH:mm A");
    document.getElementById('MenMensaje').innerHTML = _mensaje.MenMensaje;

    if (_mensaje.MenBloquearRespuesta == 1) $('.responder').css('display', 'none');
    else $('.responder').css('display', '');

    if (_mensaje.MenOkRecibido == 1) $('.recividook').css('display', 'none');
    else $('.recividook').css('display', '');
    _mensaje_context = _mensaje;
}
(function () {
    
    window.parent.cargar_mensajes_no_leidos();
    cargar_bandeja('bandeja');    
    _sesion = obtener_session();
})();