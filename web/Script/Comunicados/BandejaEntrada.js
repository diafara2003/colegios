/// <reference path="../Librerias/jquery-3.4.1.slim.min.js" />
/// <reference path="../Librerias/plugin-colegios.js" />

function calcular_height_frame() {
    let _window = $(window).height();
    const minus_height = 0;

    if ($(window).outerWidth(true) > 750) {
        let _height_ul_nuevo_msn = $('#ul_nuevo_msn').outerHeight(true);
        $('#mensajes').css('height', (_window - (minus_height + 36)) + 'px')
        let _height_header_msn = $('#headermsn').outerHeight(true);

        $('#cuerpomsn').css('height', (_window - (_height_header_msn + minus_height)) + 'px')
    } else {
        $('#mensajes').css('height', 'auto');
    }
}
function nuevo_mensaje() {
    let _url = window.location.href.toLowerCase().split('comunicados')[0];

    window.location.href = _url + 'comunicados/nuevomensaje.html'
}
function cargar_bandeja() {
    consultarAPI('BandejaEntrada', 'GET', response => {
        let _html = '';
        response.forEach(_mensaje => {
            _html += renderizar_bandeja(_mensaje);
        });
        document.getElementById('DivMensajes').innerHTML = _html;
    });
}
function renderizar_bandeja(_mensaje) {
    let _html = '';

    _html += `<div class="mensaje d-flex p-0 mt-1" onclick="consultar_mensaje(${_mensaje.MenId})">`;
    _html += '<div class="color-categoria-danger"></div>';
    _html += '<div class="col-12 d-block pl-0">';
    _html += '<div class="d-flex h-50 pl-0">';
    _html += '<div class="col-9 text-truncate">';
    _html += `<strong>${_mensaje.PerApellidos} ${_mensaje.PerNombres}</strong>`;
    _html += '</div>';
    _html += '<div class="col-3 p-0 m-0 text-right">';
    _html += '<i class="fas fa-check mr-1"></i>';
    _html += '<i class="fas fa-reply mr-1"></i>';
    _html += '<i class="fas fa-trash"></i>';
    _html += '</div>';
    _html += '</div>';
    _html += '<div class="d-flex h-50">';
    _html += '<div class="col-9 text-truncate">';
    _html += `<span>${_mensaje.MenAsunto}</span>`;
    _html += '</div>';
    _html += `<div class="col-3 p-0 m-0 text-right"><a class="btn-link text-right">${_mensaje.MenFecha}</a></div>`;
    _html += '</div>';
    _html += '</div>';
    _html += '</div>';

    return _html;
}
function consultar_mensaje(_id) {
    consultarAPI(`Mensajes/${_id}`, 'GET', response => {
        renderizar_mensaje(response);
        document.getElementById('mostrarMensaje').style.display = "block";
    });
}
function renderizar_mensaje(_mensaje) {
    document.getElementById('MenAsunto').textContent = _mensaje.MenAsunto;    
    document.getElementById('MenUsuario').textContent = _mensaje.usuario.PerApellidos + ' ' + _mensaje.usuario.PerNombres;
    document.getElementById('MenFecha').textContent = _mensaje.MenFecha;
    document.getElementById('MenMensaje').innerHTML = _mensaje.MenMensaje;
}
$(window).resize(function () {
    calcular_height_frame()
});

(function () {
    $('[data-toggle="tooltip"]').tooltip()
    //  calcular_height_frame();
    cargar_bandeja();
})();