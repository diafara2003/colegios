const _tipo_mensaje = { borradores: -2, eliminados: -1, bandeja: 0, Enviados: 1, NoLeidos: 2 }
let _mensaje_context = {},
    data_mensajes = [],
    id_bandeja = -1,
    _is_recibido = 0,
    _sesion = {}; //39;
_adjuntos_cargados = [];
let _data_source_ac = [],
    destinatarios = [],
    _sent_to = '',
    _Categorias = [];
let _this_ctx = undefined;
let _times = 0;
let iniciales_usuario = (nombre, apellidos) => {
    //apellidos = apellidos == "" ? nombre.substr(0, 3) : apellidos;
    return `${nombre.substr(0, 1).toUpperCase()}${apellidos.substr(0, 1).toUpperCase()}`;
}




var quill = new Quill('#editor', {
    placeholder: '',
    theme: 'snow'
});
let _times_glasses = 0;

function buscar_personas(_this) {
    setTimeout(c => {
        let _value = _this.textContent;

        if (_value == "") {
            $('#DivResultados').empty();
            $('#DivResultados').css('display', 'none');
            return;
        }

        consultarAPI(`Mensajes/destinatarios?idusuario=${_sesion.idusuario}&filter=${_value}`, 'GET', (response) => {
            $('#DivResultados').css('display', 'block');
            _data_source_ac = response;
            renderizar_resultados_ac(response);
        });

    }, 300);

}

function renderizar_resultados_ac(source) {

    let _html = '';

    source.forEach((item, i) => {

        if (i == 0 || source[i].tipo != source[(i - 1)].tipo) {
            _html += '<ul class="list-group list-group-flush ul-profesores">';
            _html += ` <li class="list-group-item encabezado-opcion-destinatario" style="color:${item.GrEnColorRGB}">${item.GrEnColorObs}</li>`;
        }

        _html += `
        <li class="list-group-item" onclick="renderizar_seleccionado(${i})">
            <div class="destinatario-imagen" style="background:${item.GrEnColorBurbuja}"> 
                <div class="w-100 text-center">${iniciales_usuario(item.PerApellidos, item.PerNombres)}</div>
            </div>
            <div style="display:block">
                <div class="nombre-destinatario">${item.PerApellidos} ${item.PerNombres}</div>
                <div class="text-muted">${item.CurDescripcion}</div>
            </div>
        </li>`;

        if (i == 0 || source[i].tipo != source[(i - 1)].tipo) {
            _html += '</ul>';
        }
    });


    document.getElementById('DivResultados').innerHTML = _html;
}

function renderizar_seleccionado(_i) {
    let persona = _data_source_ac[_i];

    destinatarios.push(persona);
    set_sent_to(persona);


    $('#divDestinatarios').append(renderizar_html_seleccionado(persona, true));
    $('#DivBusqueda').text('');
    $('#DivBusqueda').focus();
    $('#DivResultados').empty();
    $('#DivResultados').css('display', 'none');
}

function set_sent_to() {
    let _data = [];

    destinatarios.forEach(_item => _data.push({ BG: _item.GrEnColorBurbuja, tipo: _item.tipo, id: _item.PerId, ocupacion: _item.CurDescripcion, nombre: _item.PerNombres, apellido: _item.PerApellidos }));

    return JSON.stringify(_data);
}

function renderizar_html_seleccionado(persona, _id_deleted) {
    let _html = ``;
    _html += `<div class="desti-seleccionado">`;
    _html += `<span class="desti-cuerpo">`;
    _html += `<div class="imageArea">`;
    _html += `<div class="desti-nombre" style="background-color:${persona.GrEnColorBurbuja}" aria-hidden="true">`;
    _html += `<span>${iniciales_usuario(persona.PerApellidos, persona.PerNombres)}</span>`;
    _html += `</div ></div >`;
    _html += `<div style="display:block;ine-height: 0px"><span class="wellItemText-212">${persona.PerNombres} ${persona.PerApellidos}</span>`;
    _html += `<small>${persona.CurDescripcion}</small></div>`;
    if (_id_deleted)
        _html += `<button style="margin-top:1px" type="button" onclick="eliminar_persona_selected(this,${persona.PerId})" class="btn-icono"><i class="fas fa-times"></i></button>`;
    _html += `</span>`;
    _html += `</div>`;

    return _html;
}

function eliminar_persona_selected(_this, id) {
    let _index = destinatarios.findIndex(p => p == id);
    destinatarios.splice(_index, 1);
    $(_this).closest('.desti-seleccionado').remove();
}

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

function consultar_mensaje(_this, _id, _idBandeja, _is_rta_ok) {

    document.getElementById('mostrarMensaje').innerHTML = '';
    id_bandeja = _idBandeja;
    _this_ctx = _this;

    consultarAPI(`Mensajes/?id=${_id}&bandeja=${_idBandeja}`, 'GET', response => {
        $(_this).closest('tr').addClass('mensaje-leido').removeClass('sin-leer');

        let _html = '';
        _html += renderizar_mensaje(response._mensaje);

        if (response.replicas != null) _html += renderizar_replicas(response.replicas);

        document.getElementById('mostrarMensaje').innerHTML = _html;

        mostrar_mensaje();
        window.parent.cargar_mensajes_no_leidos();


    });
}

function nuevo_mensaje() {
    $('#Bandejamensajes, #mensaje').addClass('d-none');
    $('#nuevo-mensaje').removeClass('d-none');
}

function mostrar_mensaje() {
    $('#mensaje').removeClass('d-none');
    $('#Bandejamensajes, #nuevo-mensaje').addClass('d-none');
}

function volver() {
    $('#mensaje, #nuevo-mensaje').addClass('d-none');
    $('#Bandejamensajes').removeClass('d-none');
}

function renderizar_replicas(mensaje) {
    let html = '';
    html = renderizar_mensaje(mensaje._mensaje);
    if (mensaje.replicas != null) {
        html += renderizar_replicas(mensaje.replicas);
    }
    return html;
}

function renderizar_mensaje(_mensaje) {

    return `
            <div class="messages-view ${(_mensaje.MenUsuario==_sesion.idusuario?'owner':'')}">
            <div class="messages-header">
                <h2 class="title-vm">${_mensaje.MenAsunto} </h2>
            </div>
            <div class="messages-sent d-flex">
                <div class="d-flex" style="width: 200px;border-right: 1px solid #ebebeb;">
                    <div class="xYc">
                        <div class="photo-user">
                            <div>${iniciales_usuario(_mensaje.usuario.PerNombres, _mensaje.usuario.PerApellidos)}</div>
                        </div>
                    </div>
                    <div class="yXc xYc d-flex align-items-center">
                        <div class="w-100">
                            <div class="name-from">
                                <span class="bA4"><span>${_mensaje.usuario.PerApellidos} ${_mensaje.usuario.PerNombres}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <span class="date-view">${ moment(_mensaje.MenFecha).format("DD/MM/YYYY HH:mm A")}</span>
                </div>
            </div>
            <div class="messages-body">${ _mensaje.MenMensaje}</div>
        </div>`;

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