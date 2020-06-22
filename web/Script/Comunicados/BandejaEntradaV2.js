const _tipo_mensaje = { bandeja: 0, Enviados: 1, NoLeidos: 2 }
let _mensaje_context = {}, data_mensajes = [], id_bandeja = -1, _is_recibido = 0, _sesion = {};//39;

var quill = new Quill('#editor', {
    placeholder: 'Responder mensaje',
    theme: 'snow'
});

function buscar_mensajes(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = data_mensajes;
    }
    else {
        filtered = data_mensajes.filter(x => x.MenAsunto.toString().toLowerCase().indexOf(_text) > -1
            || x.PerApellidos.toString().toLowerCase().indexOf(_text) > -1
            || x.PerNombres.toString().toLowerCase().indexOf(_text) > -1);
    }


    var _html = '';
    if (filtered.length > 0) {
        filtered.forEach(_mensaje => {
            _html += renderizar_bandeja(_mensaje);
        });
    } else {
        _html = no_hay_mensajes();
    }

    document.getElementById('tbodydatos').innerHTML = _html;
}
function mostrar_mensaje() {
    if ($('#DivMensaje').hasClass('d-none')) {
        $('#DivMensaje').fadeIn();
        $('#DivTableMsn').css('display', 'none');
        $('#DivMensaje').addClass('d-flex').removeClass('d-none');

    } else {
        $('#DivMensaje').addClass('d-none').removeClass('d-flex');
        $('#DivTableMsn').css('display', 'block');
        $('#DivMensaje').fadeOut();

    }
    $('#enviarReplicaBtn').addClass('d-none');
}
function cargar_bandeja(tipo, _this) {
    $('#enviarReplicaBtn').addClass('d-none');
    $('#DivRespuesta').addClass('d-none').removeClass('d-block');
    consultarAPI(`BandejaEntrada/mensajes?tipo=${_tipo_mensaje[tipo]}`, 'GET', response => {
        let _html = '';

        if (_this != undefined) {
            $('.actived').removeClass('actived');
            $(_this).addClass('actived');
            $('#DivMensaje').addClass('d-none').removeClass('d-flex');
            $('#DivTableMsn').css('display', 'block');
        }

        data_mensajes = response;
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
    _html += `<tr class="${_mensaje.BanHoraLeido == null ? 'sin-leer' : 'mensaje-leido '}" >`;
    //_html += `<div style="border: 2px solid ${color}"></div>`;
    _html += '<td><div class="custom-control custom-checkbox">';
    _html += `<input type="checkbox" class="custom-control-input" onclick="habiitar_btn_encabezado(this)" id="customCheck${_mensaje.MenId}">`;
    _html += `<label class="custom-control-label" for="customCheck${_mensaje.MenId}"></label>`;
    _html += '</td>';
    _html += `<td onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${_mensaje.PerApellidos} ${_mensaje.PerNombres}</td>`;
    _html += `<td onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${_mensaje.MenAsunto}</td>`;
    _html += `<td onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${_mensaje.MenFecha.split(' ')[0]}</td>`;
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
function consultar_mensaje(_this, _id, _idBandeja, _is_rta_ok) {
    $('#DivRespuesta').css('display', 'none');
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
function nuevo_mensaje() {
    let _url = window.location.href.toLowerCase().split('comunicados')[0];

    window.location.href = _url + 'comunicados/nuevomensaje.html'
}
function recibido_ok() {
    if (_is_recibido == 0) {

        consultarAPI('BandejaEntrada/mensajes/recibido', 'POST', (response) => {
            window.parent.mostrar_mensajes('', 'Mensaje de recibido correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
                mostrar_mensaje();
            });
        }, { id: id_bandeja }, (error) => {
            alert('mal');
        });
    }
}
function check_All(_this) {
    if ($(_this).is(':checked')) {
        $('#tbodydatos').find('input[type="checkbox"]').attr('checked', 'true');
        $('.menu-panel i').css('color', 'black');
    } else {
        $('#tbodydatos').find('input[type="checkbox"]').removeAttr('checked');
        $('.menu-panel i').css('color', '#666');
    }
    habiitar_btn_encabezado(_this);
}
function habiitar_btn_encabezado(_this) {
    if ($(_this).is(':checked')) {
        $('#EncabezadoIconos i').css('color', 'black');
    } else {
        $('#EncabezadoIconos i').css('color', '#666');
    }
}
function ocultar_replica() {
    $('#DivRespuesta').addClass('d-none').removeClass('d-block');
}
function replicar_mensaje() {
    $('#DivMensaje').addClass('d-none').removeClass('d-flex');
    $('#DivRespuesta').addClass('d-block').removeClass('d-none');
    $('#enviarReplicaBtn').removeClass('d-none');
}
function enviar_replica_mensaje() {
    let data = {};
    let mensaje = obtener_datos_replica();
    data.destinatarios = obtener_destinatarios();
    data.mensaje = mensaje;

    consultarAPI('Mensajes', 'POST', (response) => {
        window.parent.mostrar_mensajes('', 'Mensaje enviado correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
            ocultar_replica();
            $('#DivTableMsn').css('display', 'block');
            $('#enviarReplicaBtn').addClass('d-none');
        });
    }, data, (error) => {
        alert('mal');
    });

}
function recibido_ok() {
    if (_is_recibido == 0) {

        consultarAPI('BandejaEntrada/mensajes/recibido', 'POST', (response) => {
            window.parent.mostrar_mensajes('', 'Mensaje de recibido correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
                cargar_bandeja('bandeja');
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
(function () {

    window.parent.cargar_mensajes_no_leidos();
    cargar_bandeja('bandeja');
    _sesion = obtener_session();
    $('[data-toggle="tooltip"]').tooltip()
})();