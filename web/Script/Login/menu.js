
function mostrar_mensajes(titulo, mensaje, icono = '',
    showConfirmButton = false,
    showCloseButton = false,
    showCancelButton = false,
    confirmButtonText = '', confirmButtonAriaLabel = '',
    cancelButtonText = '', cancelButtonAriaLabel = '',
    callBackAceptar = undefined, ) {
    Swal.fire({
        title: titulo,
        icon: icono,
        html: mensaje,
        showConfirmButton: showConfirmButton,
        showCloseButton: showCloseButton,
        showCancelButton: showCancelButton,
        focusConfirm: false,
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: confirmButtonText,
        confirmButtonAriaLabel: confirmButtonAriaLabel,
        cancelButtonText: cancelButtonText,
        cancelButtonAriaLabel: cancelButtonAriaLabel
    }).then((result) => {
        if (result.value && callBackAceptar != undefined) {
            callBackAceptar();
        }
    })
}
function cerrar_mensaje() {
    swal.close()
}
function cargar_opciones() {
    consultarAPI('menu', 'GET', response => renderizar_menu(response));
}
function renderizar_menu(response) {

    let _html = '', _html_movil = '';

    for (var i = 0; i < response.length; i++) {
        const element = response[i];

        if (element.opcion.length) {
            _html += '<li class="nav-item dropdown">';
            let id = "navbarDropdownMenu_" + element.SeccionId;
            _html += '<a class="nav-link  dropdown-toggle" href="#" id="' + id + '" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"">' + element.SecDescripcion + '</a>';
            _html += '<div class="dropdown-menu bg-dark" aria-labelledby="' + id + '">';
            _html += renderizar_opcion(element.opcion, id);
            _html += '</div>';
        } else {
            _html += '<li class="nav-item" >';
            _html += '<a class="nav-link" onclick="ver_opcion(this,\'' + element.SecRuta + '\')">' + element.SecDescripcion + '</a>';
        }


        _html_movil += renderizar_opcion_movil(element, i);
        _html += '</li>';
    }
    _html_movil += '<div class="opcion p-2 text-info" onclick="actualizar_datos()"><i class="fas fa-user-edit" style="margin-right:3px"></i> Actualizar datos</div>';
    _html_movil += '<div class="opcion p-2 text-info" onclick="cerrar_session()"><i class="fas fa-sign-out-alt" style="margin-right:3px"></i> Cerrar Sesión</div>';
    document.getElementById('menu_movil').innerHTML = _html_movil;
    document.getElementById('opciones_menu').innerHTML = _html;
    // cerrar_mensaje();
}
function renderizar_opcion(_source, id) {
    let _opcion = '';
    for (var i = 0; i < _source.length; i++) {
        const _element = _source[i];

        _opcion += ' <a class="dropdown-item bg-dark text-white"  onclick="ver_opcion(this,\'' + _element.OpRuta + '\')">' + _element.OpDescripcion + '</a>';

    }

    return _opcion;
}

function renderizar_sub_menu_movil(_source, _name) {

    let _opcion = '';
    for (var i = 0; i < _source.length; i++) {
        const _element = _source[i];
        _opcion += '<div class="collapse ' + _name + ' " style="border-bottom:1px solid #ebebeb">';
        _opcion += ' <a class="dropdown-item "  onclick="ver_opcion(this,\'' + _element.OpRuta + '\')">' + _element.OpDescripcion + '</a>';
        _opcion += '</div>';
    }
    return _opcion;
}
function uuidv4() {
    return 'xxxxxy'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(5);
    })
}
function calcular_height_frame() {
    let _window = $(this).outerHeight(true);
    let _nav = $('header').outerHeight(true);

    $('#framrePage').css('min-height', (_window - (_nav + 75)) + 'px')

}
function renderizar_opcion_movil(opcion, _i) {
    let _html = '';
    if (opcion.opcion.length > 0) {
        const _uuidv4 = uuidv4();
        _html += '<div id="opcion_' + _uuidv4 + '" onclick="ver_sub_menu_movil(' + _uuidv4 + ')" class="opcion p-2">' + opcion.SecDescripcion + '</div>';
        _html += renderizar_sub_menu_movil(opcion.opcion, _uuidv4);

    } else {
        _html = '<div onclick="ver_opcion(this,\'' + opcion.SecRuta + '\')" class="opcion p-2">' + opcion.SecDescripcion + '</div>';
    }
    return _html;
}

let _times_movil = 0
function menu() {
    if (_times_movil == 0) {
        _times_movil = 1;
        $('#menu_movil').fadeIn();
    } else {
        $('#menu_movil').fadeOut();
        _times_movil = 0;
    }
}
function ver_sub_menu_movil(_name) {
    if (!$('.' + _name).hasClass('show'))
        $('.' + _name).addClass('show');
    else
        $('.' + _name).removeClass('show');
}
function ver_opcion(_this, _ruta) {
    let _w = $(window).width();
    if (_w <= 990 && _ruta.toLowerCase().includes('bandejaentrada')) {

        bandeja_movil();
    }

    $('#framrePage').attr('src', _ruta);
    $('.active').removeClass('active');
    if (_this != undefined)
        $(_this).closest('li').addClass('active');

    if ($('.navbar-toggler').css('display') != 'none')
        menu();
}
function bandeja_movil() {
    _ruta = "../comunicados/BandejaEntradaMovil.html";
    $('#framrePage').attr('src', _ruta);
}
function bandeja_desktop() {
    _ruta = "../comunicados/BandejaEntradaV2.html";
    $('#framrePage').attr('src', _ruta);
}
function cargar_usuario() {
    let _usuario = obtener_usuario_sesion();
    $('.spnnombreUsuario').text(`${nombres(_usuario.PerNombres, _usuario.PerApellidos)}`);
}
function nombres(nombre, apellido) {
    let _result = '';
    let _nombre = nombre.split(' ');
    let _apellido = apellido.split(' ');

    
    _result = `${_nombre.length == 1 ? _nombre : _nombre[0]}  ${_apellido.length == 1 ? _apellido : _apellido[0]}`  ;

    return _result;
}
function cargar_mensajes_no_leidos() {
    localStorage.removeItem('noleidos');
    consultarAPI('BandejaEntrada/mensajes/NoLeidoCount', 'GET', (_count) => {
        localStorage.setItem('noleidos', _count);
        if (_count == 1) $('.badgeNoLeidos').css('left', '7px');
        else $('.badgeNoLeidos').css('left', '5px');
        $('.badgeNoLeidos').text(_count);
    });
}
function actualizar_datos() {
    let _user = obtener_session().idusuario;
    if (obtener_session().tipo == 1)
        ver_opcion(undefined, `../areapersonal/Personas.html?T=P&user=${_user}`);
    else
        ver_opcion(undefined, `../areapersonal/Personas.html?T=E&user=${_user}`);
}
$(window).resize(function () {
    calcular_height_frame()
});
(function () {
    //mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Cargando opciones...</span>');
    cargar_mensajes_no_leidos();
    calcular_height_frame();
    cargar_opciones();
    cargar_usuario();
    $('[data-toggle="tooltip"]').tooltip();
})();
