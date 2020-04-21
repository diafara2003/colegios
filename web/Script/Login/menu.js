﻿/// <reference path="../Librerias/plugin-colegios.js" />
/// <reference path="../Librerias/jquery-3.4.1.slim.min.js" />


function cargar_opciones() {
    consultarAPI('menu', 'GET', response => {
        renderizar_menu(response)
    });
}
function renderizar_menu(response) {

    let _html = '',_html_movil='';

    for (var i = 0; i < response.length; i++) {
        const element = response[i];
       
        if (element.opcion.length) {
            _html += '<li class="nav-item dropdown">';
            let id = "navbarDropdownMenu_" + element.SeccionId;
            _html += '<a class="nav-link  dropdown-toggle" href="#" id="' + id + '" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"">' + element.SecDescripcion + '<span class="badge badge-primary ml-1">3</span></a>';
            _html += '<div class="dropdown-menu bg-dark" aria-labelledby="' + id + '">';
            _html += renderizar_opcion(element.opcion, id);
            _html += '</div>';
        } else {
            _html += '<li class="nav-item">';
            _html += '<a class="nav-link" href="#">' + element.SecDescripcion + ' <span class="badge badge-primary">3</span></a>';
        }


        _html_movil += renderizar_opcion_movil(element);
        _html += '</li>';
    }

    document.getElementById('menu_movil').innerHTML = _html_movil;
    document.getElementById('opciones_menu').innerHTML = _html;
}
function renderizar_opcion(_source, id) {
    let _opcion = '';
    for (var i = 0; i < _source.length; i++) {
        const _element = _source[i];
      
        _opcion += ' <a class="dropdown-item bg-dark text-white" href="#">' + _element.OpDescripcion + '</a>';
      
    }

    return _opcion;
}
function calcular_height_frame() {
    let _window = $(this).outerHeight(true);
    let _nav = $('header').outerHeight(true);

    $('#framrePage').css('min-height', (_window - (_nav + 100)) + 'px')

}
function renderizar_opcion_movil(opcion) {
    let _html = '';
    _html = '<div class="opcion p-2">' + opcion.SecDescripcion + '</div>';

    return _html;
}
function menu() {
    if ($('.opcion-frame').hasClass('menu-opcion-active')) {
        $('.menu').removeClass('element-animation-show')
        $('.menu').addClass('element-animation-hide')
        setTimeout(function () {
            $('.opcion-frame').removeClass('menu-opcion-active');
            $('.menu').css('display', 'none');
        },800)
    } else {
        $('.opcion-frame').addClass('menu-opcion-active');
        $('.menu').css('display', 'block');
        $('.menu').removeClass('element-animation-hide')
        $('.menu').addClass('element-animation-show')
    }
}
$(window).resize(function () {
    calcular_height_frame()
});
(function () {
    calcular_height_frame();
    cargar_opciones();
})();