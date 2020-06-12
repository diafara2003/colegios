const _tipo_mensaje = { bandeja: 0, Enviados: 1, NoLeidos: 2 }
let _mensaje_context = {};
let id_bandeja = -1;
let _is_recibido = 0;
let _sesion = {};//39;
function calcular_height_frame() {

}
function nuevo_mensaje() {
    let _url = window.location.href.toLowerCase().split('comunicados')[0];

    window.location.href = _url + 'comunicados/nuevomensaje.html'
}
function cargar_bandeja(tipo) {
    document.getElementById('mostrarMensaje').style.display = "none";
    consultarAPI(`BandejaEntrada/mensajes?tipo=${_tipo_mensaje[tipo]}`, 'GET', response => {
        let _html = '';
        if (response.length > 0) {
            response.forEach(_mensaje => {
                _html += renderizar_bandeja(_mensaje);
            });
        } else {
            _html = no_hay_mensajes();
        }
        document.getElementById('DivMensajes').innerHTML = _html;
    });

    window.parent.cargar_mensajes_no_leidos();

    $('#UlTipoMensajes').find('li').removeClass('tipo-mensaje-activo');
    $('#UlTipoMensajes').find(`li[tipo="${tipo}"]`).addClass('tipo-mensaje-activo');

    limpiar_mensaje_leido();
}
function no_hay_mensajes() {
    let _html = '';

    _html += '<div class="text-center pt-5" id="cargando_mensajes">';
    _html += '<span style="color:#6c757d" >No hay mensajes</span>';
    _html += '<br/><i style="font-size:62px;color:#6c757d" class="far fa-envelope-open"></i>';
    _html += '</div>';

    return _html;
}
function renderizar_bandeja(_mensaje) {
    let _html = '';
    const color = _mensaje.MenColor == "" ? "#ebebeb" : _mensaje.MenColor;
    //border: 2px solid #A8518A
    _html += `<div class="mensaje d-flex p-0 mt-1 ${_mensaje.BanHoraLeido == null ? '' : 'mensaje-leido '}" onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">`;
    _html += `<div style="border: 2px solid ${color}"></div>`;
    _html += '<div class="col-12 d-block pl-0">';
    _html += '<div class="d-flex h-50 pl-0">';
    _html += '<div class="col-9 text-truncate">';
    _html += `<span>${_mensaje.PerApellidos} ${_mensaje.PerNombres}</span>`;
    _html += '</div>';
    _html += '<div class="col-3 p-0 m-0 text-right d-none mensaje-iconos">';
    _html += '<i class="fas fa-check mr-1"></i>';
    _html += '<i class="fas fa-reply mr-1"></i>';
    _html += '<i class="fas fa-trash"></i>';
    _html += '</div>';
    _html += '</div>';
    _html += '<div class="d-flex h-50">';
    _html += '<div class="col-9 text-truncate desc-menasje">';
    _html += `<span>${_mensaje.MenAsunto}</span>`;
    _html += '</div>';
    _html += `<div class="col-3 p-0 m-0 text-right"><a class="btn-link text-right">${_mensaje.MenFecha.split(' ')[0]}</a></div>`;
    _html += '</div>';
    _html += '</div>';
    _html += '</div>';

    return _html;
}
function consultar_mensaje(_this, _id, _idBandeja, _is_rta_ok) {
    id_bandeja = _idBandeja;
    $('#DivRespuesta').css('display', 'none');
    calcular_height();
    _is_recibido = _is_rta_ok;
    if (_is_rta_ok == 1) {
        $('.recividook').addClass('bg-success text-white');
    } else {
        $('.recividook').removeClass('bg-success text-white');
    }

    consultarAPI(`Mensajes/${_id}`, 'GET', response => {
        if (!$(_this).hasClass('mensaje-leido')) $(_this).addClass('mensaje-leido');
        renderizar_mensaje(response);
        document.getElementById('mostrarMensaje').style.display = "block";
        calcular_height();
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
function limpiar_mensaje_leido() {
    document.getElementById('MenAsunto').textContent = "";
    document.getElementById('MenUsuario').textContent = "";
    document.getElementById('MenFecha').textContent = "";
    document.getElementById('MenMensaje').innerHTML = "";
}
function marcar_como_leido(id) {
    consultarAPI('BandejaEntrada/mensajes', 'POST', () => {

    }, { IdMensaje: id, OkRecibido: 0 });
}
function calcular_height(_is_replicar) {
    let _window = $(window).height();
    const minus_height = 0;

    if ($(window).outerWidth(true) > 750) {
        let _height_ul_nuevo_msn = $('#DivencabezadoMsn').outerHeight(true);
        let _replicar = 0;
        if (_is_replicar == true)
            _replicar = $('#DivRespuesta').outerHeight(true);
        $('#MenMensaje').css('height', (_window - (_height_ul_nuevo_msn + 25 + _replicar)) + 'px')

        $('#DivMensajes').css('height', (_window - (49)) + 'px')
        $('.panel ').css('height', (_window - (14)) + 'px')
    } else {
        $('#MenMensaje').css('height', 'auto');
    }
}
function ocultar_replica() {
    $('#DivRespuesta').css('display', 'none');
    calcular_height();
}
function replicar_mensaje() {
    calcular_height(true);
    $('#DivRespuesta').css('display', 'block');
}
function enviar_replica_mensaje() {
    let data = {};
    let mensaje = obtener_datos_replica();
    data.destinatarios = obtener_destinatarios();
    data.mensaje = mensaje;

    consultarAPI('Mensajes', 'POST', (response) => {
        window.parent.mostrar_mensajes('', 'Mensaje enviado correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
            ocultar_replica();
        });
    }, data, (error) => {
        alert('mal');
    });

}
function recibido_ok() {
    if (_is_recibido == 0) {

        consultarAPI('BandejaEntrada/mensajes/recibido', 'POST', (response) => {
            window.parent.mostrar_mensajes('', 'Mensaje de recibido correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
            });
        }, { id: id_bandeja }, (error) => {
            alert('mal');
        });
    }
}
function obtener_destinatarios() {
    return [{ id: _mensaje_context.MenUsuario, tipo: _mensaje_context.MenTipoMsn }];
}
function obtener_datos_replica() {
    var myobject = {
        MenId: 0, MenEmpId: _sesion.empresa, MenUsuario: _sesion.idusuario, MenClase: 1, MenTipoMsn: 'E', MenAsunto: '',
        MenMensaje: '', MenReplicaIdMsn: 0, MenOkRecibido: 0, MenSendTo: '', MenBloquearRespuesta: 0, MenCategoriaId: 0
    };

    myobject.MenReplicaIdMsn = _mensaje_context.MenId;

    myobject.MenMensaje = quill.root.innerHTML;
    myobject.MenAsunto = _mensaje_context.MenAsunto;
    myobject.MenOkRecibido = 1;
    myobject.MenBloquearRespuesta = 1;
    myobject.MenSendTo = _mensaje_context.MenSendTo;
    myobject.MenCategoriaId = _mensaje_context.MenCategoriaId;

    return myobject;
}
$(window).resize(function () {
    calcular_height()
});
var quill = new Quill('#editor', {
    placeholder: 'Mensaje a respuesta',
    theme: 'snow'
});
(function () {
    calcular_height();
    $('[data-toggle="tooltip"]').tooltip()
    window.parent.cargar_mensajes_no_leidos();
    cargar_bandeja('bandeja');
    $('.ql-container').addClass('editor-height');
    _sesion = obtener_session();
})();