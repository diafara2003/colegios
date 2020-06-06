const _tipo_mensaje = { bandeja: 0, Enviados: 1, NoLeidos: 2 }
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
    _html += `<div class="mensaje d-flex p-0 mt-1" onclick="consultar_mensaje(${_mensaje.MenId})">`;
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
function consultar_mensaje(_id) {
    consultarAPI(`Mensajes/${_id}`, 'GET', response => {
        renderizar_mensaje(response);
        document.getElementById('mostrarMensaje').style.display = "block";
        calcular_height();
    });
}
function renderizar_mensaje(_mensaje) {
    document.getElementById('MenAsunto').textContent = _mensaje.MenAsunto;
    document.getElementById('MenUsuario').textContent = _mensaje.usuario.PerApellidos + ' ' + _mensaje.usuario.PerNombres;
    document.getElementById('MenFecha').textContent = moment(_mensaje.MenFecha).format("DD/MM/YYYY HH:mm A");
    document.getElementById('MenMensaje').innerHTML = _mensaje.MenMensaje;
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
function calcular_height() {
    let _window = $(window).height();
    const minus_height = 0;

    if ($(window).outerWidth(true) > 750) {
        let _height_ul_nuevo_msn = $('#DivencabezadoMsn').outerHeight(true);
        $('#MenMensaje').css('height', (_window - (_height_ul_nuevo_msn + 25)) + 'px')
        
        $('#DivMensajes').css('height', (_window - (49)) + 'px')
        $('.panel ').css('height', (_window - (14)) + 'px')
    } else {
        $('#MenMensaje').css('height', 'auto');
    }
}
$(window).resize(function () {
    calcular_height()
});

(function () {
    calcular_height();
    $('[data-toggle="tooltip"]').tooltip()
    //  calcular_height_frame();
    cargar_bandeja('bandeja');
})();