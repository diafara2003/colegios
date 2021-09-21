let _menu_op = [];
let _times_movil = 0


function mostrar_mensajes(titulo, mensaje, icono = '',
    showConfirmButton = false,
    showCloseButton = false,
    showCancelButton = false,
    confirmButtonText = '', confirmButtonAriaLabel = '',
    cancelButtonText = '', cancelButtonAriaLabel = '',
    callBackAceptar = undefined,) {
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
    _menu_op = response;
    let _html = '<h3 class="nav__subtitle">Opciones</h3>',
        _opciones_estandar = '';

    for (let i = 0; i < response.length; i++) {
        const element = response[i];

        if (element == null) continue;


        if (element.opcion.length > 0) {
            _html += `
                    <div class="nav__dropdown">
                      <a href="#" class="nav__link">
                          <i class='${element.SecIcono} nav__icon'></i>
                          <span class="nav__name">${element.SecDescripcion}</span>
                          <i class='bx bx-chevron-down nav__icon nav__dropdown-icon'></i>
                      </a>

                      <div class="nav__dropdown-collapse">
                          <div class="nav__dropdown-content">
                              ${subMenu(element.opcion)}
                          </div>
                      </div>
                    </div>`;

        } else
            _html += `<a href="#" class="nav__link" onclick=ver_opcion(this,\'${element.SecRuta}\')>
                        <i class='${element.SecIcono} nav__icon'></i>
                        <span class="nav__name">${element.SecDescripcion}</span>
                      </a> `;


    }

    $('#opciones_menu').append(_html);

}
function subMenu(info) {
    let _html = '';
    info.forEach(c => _html += `<a href="#" onclick=ver_opcion(this,\'${c.OpRuta}\') class="nav__dropdown-item">${c.OpDescripcion}</a>`)
    return _html;
}
function ver_no_leidos() {

    ver_opcion_ruta($('.fa-envelope').closest('a'), '../comunicados/bandejaentradav2.html?noLeidos=true');
}
function uuidv4() {
    return 'xxxxxy'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(5);
    })
}
function menu() {
    if (_times_movil == 0) {
        _times_movil = 1;
        $('#menu_movil').fadeIn();
    } else {
        $('#menu_movil').fadeOut();
        _times_movil = 0;
    }
}
function ver_opcion(_this, ruta) {
    let _w = $(window).width();
    const _ruta = ruta;

    $('#framrePage').attr('src', _ruta);

    $('.menu__item--active').removeClass('menu__item--active');
    if (_this != undefined)
        $(_this).addClass('menu__item--active');

    if ($('.navbar-toggler').css('display') != 'none')
        menu();

}
function ver_opcion_ruta(_this, _index) {
    let _w = $(window).width();
    const _ruta = _index;

    $('#framrePage').attr('src', _ruta);

    $('.menu__item--active').removeClass('menu__item--active');
    if (_this != undefined)
        $(_this).addClass('menu__item--active');

    if ($('.navbar-toggler').css('display') != 'none')
        menu();
}
function cerrar_sesion_marco() {
    $('#framrePage').attr('src', '');



    mostrar_mensajes('', 'Ha ocurrido un error en el sistema, y se debe cerrar la sesión', 'error', true, false, false, 'Aceptar', '', '', '', () => {

        let _inital = document.location.hostname;

        if (_inital.includes('localhost'))
            window.location.href = window.location.href.toLowerCase().split(_inital)[0] + 'localhost/colegios';
        else
            window.location.href = window.location.href.toLowerCase().split(_inital)[0] + _inital;

    });

}
function cerrar_session_sin_error() {
    $('#framrePage').attr('src', '');

    let _inital = document.location.hostname;

    if (_inital.includes('localhost'))
        window.location.href = window.location.href.toLowerCase().split(_inital)[0] + 'localhost/colegios';
    else
        window.location.href = window.location.href.toLowerCase().split(_inital)[0] + _inital;
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
    $('#userInfo').text(`${nombres(_usuario.PerNombres, _usuario.PerApellidos)}`);
}
async function cargar_datos_empresa() {
    let _id_emp = obtener_session().empresa;

    const empresa = await consultarAPI('Empresa/' + _id_emp, 'GET');

    $('.name-empresa').text(empresa.EmpNombre);


    let _url = window.location.href.toLowerCase().split('views')[0];
    const url = `${_url}api/Adjuntos${armar_url_adjuntos()}`;
    empresa.EmpLogo = "https://dreamskindergarten.com/wp-content/uploads/2017/09/logo-dreams-kindergarten.png";
    if (empresa.EmpLogo != null) {

        try {
            document.getElementById('MenuImgLogoColegio').src = empresa.EmpLogo;//`${_url}api/adjuntos/${empresa.EmpLogo}`;
        } catch (e) { }
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

    if (apellido == undefined) apellido = "";


    _result = `${_nombre.length == 1 ? _nombre : _nombre[0]}  ${apellido == '' ? '' : apellido}`;

    return _result;
}
function cargar_mensajes_no_leidos(fn) {
    localStorage.removeItem('noleidos');
    consultarAPI('BandejaEntrada/mensajes/NoLeidoCount', 'GET', (_count) => {
        localStorage.setItem('noleidos', _count);

        $('.badgeNoLeidos').text(_count);
        if (fn != undefined) fn(_count);
    });
}
function actualizar_datos(_this) {
    let _user = obtener_session().idusuario;
    if (obtener_session().tipo == 1)
        ver_opcion_ruta($('.fa-user-edit').closest('a'), `../areapersonal/Personas.html?T=P&user=${_user}`);
    else
        ver_opcion_ruta($('.fa-user-edit').closest('a'), `../areapersonal/Personas.html?T=E&user=${_user}`);

    $('.menu__item--active').removeClass('menu__item--active');
    $(_this).addClass('menu__item--active');
}
function cambiar_clave(_this) {
    ver_opcion_ruta($('.fa-key').closest('a'), `../areapersonal/CambiarClave.html`);

    $('.menu__item--active').removeClass('menu__item--active');
    $(_this).addClass('menu__item--active');
}
(function () {

    //mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Cargando opciones...</span>');
    cargar_mensajes_no_leidos();
    cargar_opciones();
    cargar_usuario();
    $('[data-toggle="tooltip"]').tooltip();
    cargar_datos_empresa();
})();

/*==================== SHOW NAVBAR ====================*/
const showMenu = (headerToggle, navbarId) => {
    const toggleBtn = document.getElementById(headerToggle),
        nav = document.getElementById(navbarId)

    // Validate that variables exist
    if (headerToggle && navbarId) {
        toggleBtn.addEventListener('click', () => {
            // We add the show-menu class to the div tag with the nav__menu class
            nav.classList.toggle('show-menu')
            // change icon
            toggleBtn.classList.toggle('bx-x')
        })
    }
}
showMenu('header-toggle', 'navbar')

/*==================== LINK ACTIVE ====================*/
const linkColor = document.querySelectorAll('.nav__link')

function colorLink() {
    linkColor.forEach(l => l.classList.remove('active'))
    this.classList.add('active')
}

linkColor.forEach(l => l.addEventListener('click', colorLink))