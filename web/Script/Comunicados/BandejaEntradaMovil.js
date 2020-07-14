const _tipo_mensaje = { bandeja: 0, Enviados: 1, NoLeidos: 2 }
let _mensaje_context = {}, data_mensajes = [], id_bandeja = -1, _is_recibido = 0, _sesion = {};//39;
let _is_rendered = false;
let iniciales_usuario = (nombre, apellidos) => {
    //apellidos = apellidos == "" ? nombre.substr(0, 3) : apellidos;
    return `${nombre.substr(0, 1).toUpperCase()}${apellidos.substr(0, 1).toUpperCase()}`;
}

String.prototype.removeHtml = function () {
    return this.replace(/(<([^>]+)>)/ig, "");
}


function abril_bandeja() {
    if ($('.active-tipo-bandeja').hasClass('d-none')) {
        $('.active-tipo-bandeja').removeClass('d-none');
        $('.opciones-bandeja').removeClass('d-none');
        
    } else {
        $('.active-tipo-bandeja').addClass('d-none');        
        $('.opciones-bandeja').addClass('d-none');
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
function cargar_bandeja(tipo, _this) {

    $('#bandejaDiv, #smallBandeja').fadeIn();
    $('#DivcargarMensaje').addClass('d-none');
    
    
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
        if (_is_rendered)
            abril_bandeja();
        $('[data-toggle="tooltip"]').tooltip();
        _is_rendered = true;
    });

    window.parent.cargar_mensajes_no_leidos();


    //limpiar_mensaje_leido();
}
function renderizar_bandeja(_mensaje) {
    let _html = '';



    const color = _mensaje.MenColor == "" ? "#ebebeb" : _mensaje.MenColor;
    _html += `<div categoria="${_mensaje.MenCategoriaId}" clase="${_mensaje.BanClaseId}" class="mensaje pb-1 d-flex justify-content-between ${_mensaje.BanHoraLeido == null ? 'sin-leer' : 'mensaje-leido '}">`;
    _html += `<div onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})" class="mensaje-burbuja rounded-circle text-white" style="background-color:${color}">${iniciales_usuario(_mensaje.PerNombres, _mensaje.PerApellidos)}</div>`;
    _html += '<div class="cuerpo-mensaje">';
    _html += `<div onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})" class="destinatario font-weight-bold d-flex justify-content-between">`;
    _html += `<span>${_mensaje.PerNombres} ${_mensaje.PerApellidos}</span>`;
    _html += `<span>${_mensaje.MenFecha.split(' ')[0]}</span>`;
    _html += '</div>';
    _html += `<div onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})" class="Asunto font-weight-bold">${_mensaje.MenAsunto}</div>`;
    _html += '<div class="mensaje-corto d-flex justify-content-between">';
    _html += `<span onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${_mensaje.MenMensaje.removeHtml().substr(0, 7)}</span>`;
    _html += `<i class="${(_mensaje.BanDestacado == 0 ? 'far no-favorito' : 'fa favorito')} fa-star" onclick="marcar_destacado(${_mensaje.BanId},this)" data-toggle="tooltip" title="Favorito" style="font-size:16px !important"></i>`;
    _html += '</div>';
    _html += '</div>';
    _html += '</div>';




    /*
    //border: 2px solid #A8518A
    _html += `<tr categoria="${_mensaje.MenCategoriaId}" clase="${_mensaje.BanClaseId}" class="${_mensaje.BanHoraLeido == null ? 'sin-leer' : 'mensaje-leido '}" >`;
    //_html += `<div style="border: 2px solid ${color}"></div>`;
    _html += '<td data-th=""><div class="custom-control custom-checkbox">';
    _html += `<input type="checkbox" class="custom-control-input" onclick="habiitar_btn_encabezado(this)" id="customCheck${_mensaje.MenId}">`;

    _html += `<label class="custom-control-label" for="customCheck${_mensaje.MenId}"></label>`;
    _html += `<i onclick="marcar_destacado(${_mensaje.BanId},this)" data-toggle="tooltip" title="Favorito" class="${(_mensaje.BanDestacado == 0 ? 'far no-favorito' : 'fa favorito')} fa-star"></i>`;
    if (_mensaje.MenColor != '')
        _html += `<i data-toggle="tooltip" title="Categoria" style="color:${_mensaje.MenColor}" class="far fa-flag"></i>`;
    _html += '</td>';
    _html += `<td data-th="De" onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${_mensaje.PerApellidos} ${_mensaje.PerNombres}</td>`;
    _html += `<td data-th="Asunto" onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${_mensaje.MenAsunto}</td>`;
    _html += `<td data-th="Enviado" onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${_mensaje.MenFecha.split(' ')[0]}</td>`;
    _html += '</tr>';
    */
    return _html;
}
function no_hay_mensajes() {
    let _html = '';

    _html += '<div class="no-hay-mensajes d-block text-center pb-2">';
    _html += '<div>';
    _html += '<span style="color:#6c757d">No hay mensajes</span>';
    _html += '</div>';
    _html += '<div>';
    _html += '<i style="font-size:40px;color:#6c757d" class="far fa-envelope-open"></i>';
    _html += '</div>';
    _html += '</div>';

    return _html;
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
    //_html = `<ul class="list-group list-group-flush list-sub-menu ">`
    _response.forEach(c => {

        _html += `<div class="tipo-bandeja d-flex justify-content-between" onclick=ver_mensajes__tipo(this,${c.id},\"${_attr}"\)>`;
        _html += `<div class="w-100">${c.Descripcion}</div>`;
        _html += `<div style="color:#2E8CFF;margin-right:10px" class="">${c.Count}</div>`;
        _html += `</div>`;
    });
    //_html += `</ul>`;


    return _html;

}
function ver_mensajes__tipo(_this, _tipo, _attr) {
    $('.active-tipo-bandeja').removeClass('active-tipo-bandeja');
    $(_this).addClass('active-tipo-bandeja');
    $('#tbodydatos').find('.mensaje').removeClass('d-none').addClass('d-flex');
    $('#tbodydatos').find('.mensaje').not(`[${_attr.trim()}="${_tipo}"]`).addClass('d-none').removeClass('d-flex');
    $('#bodybandeja').removeClass('active-tipo-bandeja');
    $('.opciones-bandeja').addClass('d-none');
}
function consultar_mensaje(_this, _id, _idBandeja, _is_rta_ok) {
    

    $('#DivRespuesta, #smallBandeja').fadeOut();
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
    consultarAPI(`Mensajes/¿?id=${_id}&bandeja=${_idBandeja}`, 'GET', response => {
        $(_this).closest('tr').addClass('mensaje-leido').removeClass('sin-leer');
        $('#DivRespuesta').addClass('d-none');
        
        $('#bandejaDiv').fadeOut();
        
        renderizar_mensaje(response);        
        window.parent.cargar_mensajes_no_leidos();
        renderizar_categorias();
        renderizar_clases_bandeja();
        $('#DivcargarMensaje').removeClass('d-none');
    });
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
function ver_destacados(_this) {
    $('.active-tipo-bandeja').removeClass('active-tipo-bandeja');
    $(_this).addClass('active-tipo-bandeja');
    $('#tbodydatos').find('.no-favorito').closest('div.mensaje').addClass('d-none').removeClass('d-flex');
    $('#bodybandeja').removeClass('active-tipo-bandeja');
    $('.opciones-bandeja').addClass('d-none');
}
function regresar_bandeja() {
    _is_rendered = false;
    cargar_bandeja('bandeja', this);
}
function ocultar_bandeja() {
    $('#exampleModal').modal('show');
    $('.container-fluid').addClass('d-none');
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
function cerrar_modal_nuevo() {
    $('#exampleModal').modal('hide');
    $('.container-fluid').removeClass('d-none');
}



(function () {
    renderizar_categorias();
    renderizar_clases_bandeja();
    cargar_bandeja('bandeja');
    _sesion = obtener_session();
    $('[data-toggle="tooltip"]').tooltip()

})();