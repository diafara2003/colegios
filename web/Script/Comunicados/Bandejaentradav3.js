const _tipo_mensaje = { borradores: -2, eliminados: -1, bandeja: 0, Enviados: 1, NoLeidos: 2 }
let _mensaje_context = {},
    data_mensajes = [],
    id_bandeja = -1,
    _is_recibido = 0,
    _sesion = {}; //39;
_adjuntos_cargados = [];
let _this_ctx = undefined;
let _times = 0;
let iniciales_usuario = (nombre, apellidos) => {
    //apellidos = apellidos == "" ? nombre.substr(0, 3) : apellidos;
    return `${nombre.substr(0, 1).toUpperCase()}${apellidos.substr(0, 1).toUpperCase()}`;
}




var quill = new Quill('#editor', {
    placeholder: 'Responder mensaje',
    theme: 'snow'
});
let _times_glasses = 0;


function ver_otras_bandejas() {
    if ($('#ddlmsnBandeja').hasClass('body-selected')) $('#ddlmsnBandeja').addClass('hidden-select').removeClass('body-selected');
    else $('#ddlmsnBandeja').addClass('body-selected').removeClass('hidden-select');
}

function focus_input_busqueda(_this) {
    $('#search-general').addClass('focus-search');
}

function blur_input_busqueda(_this) {
    $('#search-general').removeClass('focus-search');
}

async function cargar_bandeja(tipo, _element) {
    $('.active').removeClass('active');
    $(_element).closest('.menu-op').addClass('active');
    $('#buscargrado').val('');

    if (_tipo_mensaje[tipo] == _tipo_mensaje.eliminados) {
        $('#btnMensajesOpciones').addClass('d-none').removeClass('d-flex');
        $('#BtnModalMensaje').addClass('w-100 justify-content-end');
    } else {
        $('#btnMensajesOpciones').removeClass('d-none').addClass('d-flex');
        $('#BtnModalMensaje').removeClass('w-100 justify-content-end');
    }


    const response = await consultarAPI(`BandejaEntrada/mensajes?tipo=${_tipo_mensaje[tipo]}`, 'GET', undefined);


    renderizar_mensajes_bandeja(response);
}

function renderizar_mensajes_bandeja(_data) {
    let html = '';
    for (const key in _data) {
        if (Object.hasOwnProperty.call(_data, key)) {
            const _mensaje = _data[key];


            html += `
        <tr categoria="${_mensaje.MenCategoriaId}" clase="${_mensaje.BanClaseId}" class="${_mensaje.BanHoraLeido == null ? 'sin-leer' : 'mensaje-leido '}">
            <td class="tr-tab-panel" onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">

                <div class="xY-aux">
                    <div class="xYc">
                        <div class="photo-user" >
                            <div>JU</div>
                        </div>
                    </div>
                    <div class="yXc xYc">
                        <div class="w-100">
                            <div class="name-from">
                                <span class="bA4"><span>${_mensaje.PerApellidos} ${_mensaje.PerNombres}</span></span>
                            </div>

                        </div>
                    </div>
                    <div class="xY affair">
                        <div class="xS">
                            <div class="xT">
                                <div class="y6">
                                    <div class="bog">${_mensaje.MenAsunto}</div>
                                </div>
                                <div class="y2 gray-dark">
                                    <div class="Zt">- ${$($.parseHTML( _mensaje.MenMensaje )).text() }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="fecha">
                    <div>${(_mensaje.MenFecha.split(' ')[0])}</div>
                    </div>
                </div>

            </td>
        </tr>`;

        }
    }
    document.getElementById('tbodyDatos').innerHTML = html;


    document.getElementsByClassName("xY-aux")[0].style.borderTop = "1px solid #ebebeb";

}

function actualizar_bandeja_count() {
    let _inter = setInterval(C => {
        if (localStorage.getItem('noleidos') != undefined) {
            clearInterval(_inter);
            document.getElementById('countNoLeidos').textContent = localStorage.getItem('noleidos');
            //  document.getElementById('numeroMsn').textContent = localStorage.getItem('noleidos');
        }
    }, 500)
}



(async function() {

    window.parent.cargar_mensajes_no_leidos();

    cargar_bandeja('bandeja', $('.active')[0]);

    if (Get_query_string('noLeidos') == 'true') {
        Ver_no_leidos($('#icono_notificacion_mensajes').find('i')[0]);
    }
    _sesion = obtener_session();
    $('[data-toggle="tooltip"]').tooltip()
    actualizar_bandeja_count();

})();

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
});