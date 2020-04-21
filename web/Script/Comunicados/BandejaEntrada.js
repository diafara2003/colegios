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

     window.location.href= _url+'comunicados/nuevomensaje.html'
}

$(window).resize(function () {
    calcular_height_frame()
});

(function () {
    $('[data-toggle="tooltip"]').tooltip()
  //  calcular_height_frame();
})();