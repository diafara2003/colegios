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
let _menu_op = [];

function cerrar_mensaje() {
    swal.close()
}

function cargar_opciones() {
    consultarAPI('menu', 'GET', response => renderizar_menu(response));
}

function renderizar_menu(response) {
    _menu_op = response;
    let _html = '',
        _html_movil = '';

    for (var i = 0; i < response.length; i++) {
        const element = response[i];

        _html +=
            `<a href="#" onclick="ver_opcion(this, ${i} )" class="menu__item" data-tooltip="${element.SecDescripcion}">
                    <i class="${element.SecIcono}"></i>
                </a>`;

    }
    _html +=
        `<a href="#" onclick="actualizar_datos()" class="menu__item" data-tooltip="Actualizar datos">
            <i class="fas fa-user-edit"></i>
        </a>`;
    _html +=
        `<a href="#" onclick="cambiar_clave()" class="menu__item" data-tooltip="Cambiar contraseña">
            <i class="fas fa-key"></i>
        </a>`;
    _html +=
        `<a href="#" onclick="cerrar_session()" class="menu__item" data-tooltip="Cerrar Sesión">
            <i class="fas fa-sign-out-alt"></i>
        </a>`;



    $('#opciones_menu').append(_html);

    // cerrar_mensaje();
}


function ver_no_leidos() {
    _this = $('#opciones_menu').find('a').first();
    ver_opcion(_this, '../comunicados/bandejaentradav2.html?noLeidos=true');
}


function uuidv4() {
    return 'xxxxxy'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(5);
    })
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



function ver_opcion(_this, _index) {
    let _w = $(window).width();
    const _ruta = _menu_op[_index].SecRuta;
    if (_w <= 1000 && _ruta.toLowerCase().includes('bandejaentrada')) {

        bandeja_movil();
    } else {
        $('#framrePage').attr('src', _ruta);
    }
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
async function cargar_datos_empresa() {
    let _id_emp = obtener_session().empresa;

    const empresa = await consultarAPI('Empresa/' + _id_emp, 'GET');

    let _url = window.location.href.toLowerCase().split('views')[0];
    const url = `${_url}api/Adjuntos${armar_url_adjuntos()}`;

    if (empresa.EmpLogo != null) {

        try {
            document.getElementById('MenuImgLogoColegio').src = `${_url}api/adjuntos/${empresa.EmpLogo}`;
        } catch (e) {}
    } else {
        document.getElementById('imglogoColegio').src = '';
    }


}

function armar_url_adjuntos() {
    let _url = '';
    let _usuario = obtener_session().idusuario,
        _adjunto = 0;

    _url += '?usuario=' + _usuario;
    _url += '&adjunto=' + _adjunto;

    return _url;
}

function nombres(nombre, apellido) {
    let _result = '';
    let _nombre = nombre.split(' ');
    let _apellido = ' ';

    if (apellido != undefined) apellido.split(' ');


    _result = `${_nombre.length == 1 ? _nombre : _nombre[0]}  ${_apellido.length == 1 ? _apellido : _apellido[0]}`;

    return _result;
}

function cargar_mensajes_no_leidos() {
    localStorage.removeItem('noleidos');
    consultarAPI('BandejaEntrada/mensajes/NoLeidoCount', 'GET', (_count) => {
        localStorage.setItem('noleidos', _count);

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

function cambiar_clave() {
    ver_opcion(undefined, `../areapersonal/CambiarClave.html`);
}

(function() {
    //mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Cargando opciones...</span>');
    cargar_mensajes_no_leidos();
    cargar_opciones();
    cargar_usuario();
    $('[data-toggle="tooltip"]').tooltip();
    cargar_datos_empresa();
})();