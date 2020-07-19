const _tipo_mensaje = { bandeja: 0, Enviados: 1, NoLeidos: 2 }
let _mensaje_context = {}, data_mensajes = [], id_bandeja = -1, _is_recibido = 0, _sesion = {};//39;

let iniciales_usuario = (nombre, apellidos) => {
    //apellidos = apellidos == "" ? nombre.substr(0, 3) : apellidos;
    return `${nombre.substr(0, 1).toUpperCase()}${apellidos.substr(0, 1).toUpperCase()}`;
}




var quill = new Quill('#editor', {
    placeholder: 'Responder mensaje',
    theme: 'snow'
});
let _times_glasses = 0;

function mostrar_no_leidos(_ocultar_leidos) {
    if (_ocultar_leidos) {
        $('.mensaje-leido').addClass('d-none');
    } else {
        $('.mensaje-leido').removeClass('d-none');
    }
}
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
    $('.fa-glasses').css('color', '#999');
    $('#DivRespuesta').addClass('d-none').removeClass('d-block');
    $('#DivAcBuscarMensajes, #BtnNoLeidos').removeClass('d-none');
    $('#buscargrado').val('');
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
        $('[data-toggle="tooltip"]').tooltip();
    });

    window.parent.cargar_mensajes_no_leidos();


    limpiar_mensaje_leido();
}
function renderizar_bandeja(_mensaje) {
    let _html = '';
    const color = _mensaje.MenColor == "" ? "#ebebeb" : _mensaje.MenColor;
    //border: 2px solid #A8518A
    _html += `<tr categoria="${_mensaje.MenCategoriaId}" clase="${_mensaje.BanClaseId}" class="${_mensaje.BanHoraLeido == null ? 'sin-leer' : 'mensaje-leido '}" >`;
    //_html += `<div style="border: 2px solid ${color}"></div>`;
    _html += '<td><div class="custom-control custom-checkbox">';
    _html += `<input type="checkbox" class="custom-control-input" onclick="habiitar_btn_encabezado(this)" id="customCheck${_mensaje.MenId}">`;

    _html += `<label class="custom-control-label" for="customCheck${_mensaje.MenId}"></label>`;
    _html += `<i onclick="marcar_destacado(${_mensaje.BanId},this)" data-toggle="tooltip" title="Favorito" class="${(_mensaje.BanDestacado == 0 ? 'far no-favorito' : 'fa favorito')} fa-star"></i>`;
    if (_mensaje.MenColor != '')
        _html += `<i data-toggle="tooltip" title="Categoria" style="color:${_mensaje.MenColor}" class="far fa-flag"></i>`;

    if (_mensaje.TieneAdjuntos > 0)
        _html += `<i data-toggle="tooltip" title="Adjuntos"  class="fas fa-paperclip"></i>`;

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
    document.getElementById('DivIniciales').textContent = "";
}
function consultar_mensaje(_this, _id, _idBandeja, _is_rta_ok) {
    $('#DivRespuesta').css('display', 'none');
    id_bandeja = _idBandeja;

    if (_idBandeja == 0) {
        _is_rta_ok = 0;
        $('.responder').addClass('d-none');
    } else {
        $('.responder').removeClass('d-none');
    }

    _is_recibido = _is_rta_ok;
    if (_is_rta_ok == 0) {
        $('.recividook').addClass('d-none');
    } else {
        $('.recividook').removeClass('d-none');
    }
    $('#DivAcBuscarMensajes, #BtnNoLeidos').addClass('d-none');
    consultarAPI(`Mensajes/¿?id=${_id}&bandeja=${_idBandeja}`, 'GET', response => {
        $(_this).closest('tr').addClass('mensaje-leido').removeClass('sin-leer');
        $('#DivRespuesta').addClass('d-none');
        $('#modalverMensaje').modal('show');
        $('.container-kids__content').addClass('d-none');
        renderizar_mensaje(response);

        if (response.adjuntos != null && response.adjuntos.length > 0)
            renderizar_adjuntos(response.adjuntos);

        mostrar_mensaje();
        window.parent.cargar_mensajes_no_leidos();
        renderizar_categorias();
        renderizar_clases_bandeja();
        actualizar_bandeja_count();
    });
}
function renderizar_adjuntos(_adjuntos) {
    let _html = "";

    _adjuntos.forEach(a => {      
        _html += `<div class="adjunto-mensaje rounded border p-2 m-1">`;
        _html += `<a href="${window.location.href.toLowerCase().split('views')[0]}api/adjunto/descargar?id=${a.AjdId}">`;
        _html += `<img style="width:30px" src="${_get_icono(a.AjdExtension)}" />`;;
        _html += `${a.AdjNombre}${a.AjdExtension}</a></div>`
    });
    document.getElementById('DivAdjuntos').innerHTML = _html;
    $('#spnAdjuntos').removeClass('d-none');
}

function renderizar_mensaje(_mensaje) {
    document.getElementById('DivIniciales').textContent = iniciales_usuario(_mensaje.usuario.PerNombres, _mensaje.usuario.PerApellidos);
    document.getElementById('MenAsunto').textContent = _mensaje.MenAsunto;
    document.getElementById('MenUsuario').textContent = _mensaje.usuario.PerApellidos + ' ' + _mensaje.usuario.PerNombres;
    document.getElementById('MenFecha').textContent = "Fecha de envio: " + moment(_mensaje.MenFecha).format("DD/MM/YYYY HH:mm A");
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
        $('#EncabezadoIconos').removeClass('d-none');
    } else {
        $('#EncabezadoIconos').addClass('d-none');
    }
}
function ocultar_replica() {
    $('#DivRespuesta').addClass('d-none').removeClass('d-block');
}
function replicar_mensaje() {

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
let _times = 0;
function mostrar_panel_mensajes() {
    if (_times == 0) {
        _times = 1;
        $('.panel').find('span').fadeOut();
        $('.panel').find('.no-btn').fadeOut();
        setTimeout(() => {
            $('.panel').css('width', '60px');

            calcular_width_tabla();
        }, 400);
        //

    } else {
        _times = 0;
        $('.panel').find('span').fadeIn();
        $('.panel').find('.no-btn').fadeIn();
        $('.panel').css('width', '180px');
        calcular_width_tabla();
    }

}
function mostrar_ul(_this) {
    let _attr = $(_this).attr('open');
    if (_attr == undefined) {
        $(_this).attr('open', 'open');
        $(_this).closest('li').find('ul').fadeIn();
        $(_this).closest('li').find('ul').removeClass('d-none');
    } else {
        $(_this).removeAttr('open');
        $(_this).closest('li').find('ul').fadeOut();
    }
}
function calcular_width_tabla() {
    let _container = $('.container-kids__content').width();
    let _panel = $('.panel').width();
    $('#DivTableMsn').css('width', (_container - (_panel + 30)) + 'px');
}
function renderizar_categorias() {
    consultarAPI('BandejaEntrada/mensajes/NoLeido/categorias', 'GET', (_response) => {
        document.getElementById('LiOocionesCategorias').innerHTML = renderizar_tipo_bandeja(_response, 'categoria');
    });
}
function renderizar_clases_bandeja() {
    consultarAPI('BandejaEntrada/mensajes/NoLeido/tipo', 'GET', (_response) => {
        document.getElementById('LiOocionesClases').innerHTML = renderizar_tipo_bandeja(_response, 'clase');
    });
}
function renderizar_tipo_bandeja(_response, _attr) {
    let _html = '';
    _html = `<ul class="list-group list-group-flush list-sub-menu d-none">`
    _response.forEach(c => {

        _html += `<li class="list-group-item" onclick=ver_mensajes__tipo(this,${c.id},\"${_attr}"\)>`;
        _html += `<div class="d-flex justify-content-between">`;
        _html += `<div class="w-100">${c.Descripcion}</div>`;
        _html += `<div style="color:#2E8CFF" class="">${c.Count}</div>`;
        _html += `<div>`;
        _html += `</li>`;
    });
    _html += `</ul>`;


    return _html;

}
function Ver_mensaje_x_tipo() {

}
function marcar_destacado(id, _this) {
    let _estado = 1;
    if ($(_this).hasClass('favorito')) {
        _estado = 0;
        $(_this).removeClass('fa').addClass('far').removeClass('favorito');
    } else {
        $(_this).removeClass('far').addClass('fa').addClass('favorito');
    }

    consultarAPI(`BandejaEntrada/mensajes/favorito?id=${id}&estado=${_estado}`, 'GET', (_r => {

    }));
}
function cargar_mensajes() {
    window.location.reload();
}
function actualizar_bandeja_count() {
    let _inter = setInterval(C => {
        if (localStorage.getItem('noleidos') != undefined) {
            clearInterval(_inter);
            document.getElementById('countNoLeidos').textContent = localStorage.getItem('noleidos');
            document.getElementById('numeroMsn').textContent = localStorage.getItem('noleidos');
        }
    }, 500)
}
function cerrar_modal() {
    cerrar_modal_nuevo();
    $('.panel').find('.actived').click();
    renderizar_categorias();
    renderizar_clases_bandeja();
    window.parent.cargar_mensajes_no_leidos();
    actualizar_bandeja_count();
}
function cerrar_modal_mensaje() {
    $('.container-kids__content, #DivAcBuscarMensajes').removeClass('d-none');
    $('#icono_notificacion_mensajes').find('button').removeClass('d-none');
}
function cerrar_modal_nuevo() {
    $('#exampleModal').modal('hide');
    $('.container-kids__content, #DivAcBuscarMensajes').removeClass('d-none');
    $('#icono_notificacion_mensajes').find('button').removeClass('d-none');
}

function ocultar_bandeja() {
    colapsar_modal();
    $('#exampleModal').modal('show');
    $('.container-kids__content').addClass('d-none');
}
function Ver_no_leidos(_this) {
    if (_times_glasses == 0) {
        _times_glasses = 1;
        $(_this).css('color', '#369');
        $(_this).closest('button').addClass('btn-active-gmail');
    } else {
        _times_glasses = 0;
        $(_this).css('color', 'black');
        $(_this).closest('button').removeClass('btn-active-gmail')

    }
    mostrar_no_leidos(_times_glasses == 0 ? false : true);
}
function ver_destacados(_this) {
    $('.actived').removeClass('actived');
    $(_this).addClass('actived');
    $('#tbodydatos').find('.no-favorito').closest('tr').addClass('d-none');
}
function ver_mensajes__tipo(_this, _tipo, _attr) {
    $('.actived').removeClass('actived');
    $(_this).addClass('actived');
    $('#tbodydatos').find('tr').removeClass('d-none');
    $('#tbodydatos').find('tr').not(`tr[${_attr.trim()}="${_tipo}"]`).addClass('d-none');
}
function expandar_modal() {
    $('#modalsize, #modalsize2').addClass('modal-full-view');
    $('.fa-expand-alt').closest('button').addClass('d-none');
    $('.fa-compress-alt').closest('button').removeClass('d-none');
}
function colapsar_modal() {
    $('#modalsize, #modalsize2').removeClass('modal-full-view');
    $('.fa-compress-alt').closest('button').addClass('d-none');
    $('.fa-expand-alt').closest('button').removeClass('d-none');
}
function tamano_frame() {
    let _w = $(window).width();

}
(function () {
    calcular_width_tabla();
    window.parent.cargar_mensajes_no_leidos();
    renderizar_categorias();
    renderizar_clases_bandeja();
    cargar_bandeja('bandeja');
    _sesion = obtener_session();
    $('[data-toggle="tooltip"]').tooltip()
    actualizar_bandeja_count();
    tamano_frame();
})();
$(window).resize(tamano_frame);