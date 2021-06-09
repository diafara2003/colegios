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
let _user_id = 0;




var quill = new Quill('#editor', {
    placeholder: '',
    theme: 'snow'
});
var responderMsn = new Quill('#responderMsnEditor', {
    placeholder: '',
    theme: 'snow'
});
let _times_glasses = 0;


function buscar_mensajes(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = data_mensajes;
    } else {
        filtered = data_mensajes.filter(x => x.MenAsunto.toString().toLowerCase().indexOf(_text) > -1 ||
            x.PerApellidos.toString().toLowerCase().indexOf(_text) > -1 ||
            x.PerNombres.toString().toLowerCase().indexOf(_text) > -1 ||
            x.MenMensaje.toString().toLowerCase().indexOf(_text) > -1);
    }

    $('#tbodyDatos').find('tr').addClass('d-none');

    if (filtered.length > 0) filtered.forEach(c => $('#tbodyDatos').find(`tr[mensaje-id="${c.MenId}"]`).removeClass('d-none'))


}

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

function set_sent_to(replica) {
    let _data = [];
    if (replica)
        _data.push({
            BG: '#68606c',
            tipo: 2,
            id: _mensaje_context.usuario.PerId,
            ocupacion: 'respuesta',
            nombre: _mensaje_context.usuario.PerNombres,
            apellido: _mensaje_context.usuario.PerApellidos
        });
    else
        destinatarios.forEach(_item => _data.push({
            BG: _item.GrEnColorBurbuja,
            tipo: _item.tipo,
            id: _item.PerId,
            ocupacion: _item.CurDescripcion,
            nombre: _item.PerNombres,
            apellido: _item.PerApellidos
        }));

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
    document.getElementById('tbodyDatos').innerHTML = '';
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


    const response = await consultarAPI(`BandejaEntrada/mensajes/usuario?usuario=${_user_id}&tipo=${_tipo_mensaje[tipo]}`, 'GET', undefined);

    data_mensajes = response;

    if (response.length > 0) {
        $('.folder-empty').addClass('d-none');
        $('.messages-tm').removeClass('d-none');
        renderizar_mensajes_bandeja(response);
    } else {
        $('.folder-empty').removeClass('d-none');
        $('.messages-tm').addClass('d-none');
    }


    //if (tipo == 'Enviados')
    $('#mostrarMensaje').css('max-height', 'calc(100vh - 145px)');
    //else $('#mostrarMensaje').css('max-height', 'calc(100vh - 343px)');

}

function renderizar_mensajes_bandeja(_data) {
    let html = '';
    for (const key in _data) {
        if (Object.hasOwnProperty.call(_data, key)) {
            const _mensaje = _data[key];


            html += `
        <tr mensaje-id="${_mensaje.MenId}" categoria="${_mensaje.MenCategoriaId}" clase="${_mensaje.BanClaseId}" class="${_mensaje.BanHoraLeido == null ? 'sin-leer' : 'mensaje-leido '}">
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
                                    <div class="Zt">- ${$($.parseHTML(_mensaje.MenMensaje)).text()}
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
    $('#responderMensaje').addClass('d-none');
    $('.btn-enviar').addClass('d-none');
    $('.btn-responder').removeClass('d-none');
    $('#mostrarMensaje').css('max-height', 'calc(100vh - 145px)');

    consultarAPI(`Mensajes/?id=${_id}&bandeja=${_idBandeja}`, 'GET', response => {
        $(_this).closest('tr').addClass('mensaje-leido').removeClass('sin-leer');

        _mensaje_context = response._mensaje;

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
            <div class="messages-view ${(_mensaje.MenUsuario == _sesion.idusuario ? 'owner' : '')}">
            <div class="messages-header">
                <h2 class="title-vm">${_mensaje.MenAsunto} </h2>
            </div>
            <div class="messages-sent d-flex">
                <div class="d-flex" style="width: 200px;">
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
                    <span class="date-view">${moment(_mensaje.MenFecha).format("DD/MM/YYYY HH:mm A")}</span>
                </div>
            </div>
            <div class="messages-body">${_mensaje.MenMensaje}</div>
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

function armar_objeto_mensaje(isReplica) {
    let data = {};
    let mensaje = obtener_datos(isReplica);
    data.destinatarios = obtener_destinatarios(isReplica);
    data.mensaje = mensaje;
    data.adjuntos = obtener_adjuntos_al_mensaje();
    return data;
}


function enviar_mensaje(isReplica) {

    let data = armar_objeto_mensaje(isReplica);
    if (validar_datos(data)) {
        consultarAPI('Mensajes', 'POST', (response) => {

        }, data, (error) => {
            alert('mal');
        });

        window.parent.parent.mostrar_mensajes('', 'Mensaje enviado correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
            localStorage.removeItem("adjuntos-mensajes");
            limpiar_mensaje_leido();
            volver();
        });

    }
}

function limpiar_mensaje_leido() {
    document.getElementById('MenAsunto').textContent = "";
    document.getElementById('divDestinatarios').innerHTML = "";

    quill.root.innerHTML = '';
    responderMsn.root.innerHTML = '';
}

function obtener_adjuntos_al_mensaje() {
    return _adjuntos_cargados.map(c => c.AjdId);
}

function obtener_destinatarios(isReplica) {
    if (isReplica)
        return [{ id: _mensaje_context.MenUsuario, tipo: _mensaje_context.MenTipoMsn }];
    else
        return destinatarios.map(_item => { return { id: _item.PerId, tipo: _item.tipo } });
}

function obtener_datos(replica) {
    var myobject = {
        MenId: 0,
        MenEmpId: _sesion.empresa,
        MenUsuario: _sesion.idusuario,
        MenClase: 1,
        MenTipoMsn: 'E',
        MenAsunto: '',
        MenMensaje: '',
        MenReplicaIdMsn: 0,
        MenOkRecibido: 0,
        MenSendTo: '',
        MenBloquearRespuesta: 0,
        MenCategoriaId: 0,
        MenEstado: 0,
        MenFechaMaxima: null
    };

    let id = Get_query_string('id');

    if (id != null && id != undefined) {
        myobject.MenId = id;
    }

    if (replica) {
        myobject.MenAsunto = _mensaje_context.MenAsunto;
        myobject.MenReplicaIdMsn = _mensaje_context.MenId;
        myobject.MenSendTo = _mensaje_context.MenSendTo;
        myobject.MenCategoriaId = _mensaje_context.MenCategoriaId;
    } else {
        myobject.MenAsunto = document.getElementById('MenAsunto').textContent;
    }


    myobject.MenMensaje = replica ? responderMsn.root.innerHTML : quill.root.innerHTML;

    // myobject.MenOkRecibido = $('#MenOkRecibido').is(':checked') ? 1 : 0;
    // myobject.MenBloquearRespuesta = $('#MenBloquearRespuesta').is(':checked') ? 1 : 0;

    myobject.MenSendTo = set_sent_to(replica);

    // myobject.MenCategoriaId = $('#ddlCategoria').find('option:selected').val();
    // if (document.getElementById('datetimepicker4').value != '')
    //     myobject.MenFechaMaxima = convertir_fecha(document.getElementById('datetimepicker4').value).format('YYYY-MM-DD HH:mm');

    return myobject;
}

function habilitar_responder() {
    $('#responderMensaje').removeClass('d-none');
    $('.btn-enviar').removeClass('d-none');
    $('.btn-responder').addClass('d-none');

    $('#mostrarMensaje').css('max-height', 'calc(100vh - 345px)');

}

async function consultar_propfesores() {
    const response = await consultarAPI('Profesor', 'GET');

    _data_profesores = response;


    renderizar_profesores(response);
}

function renderizar_profesores(source) {
    let _html = '';
    const _user_default = source.find(c => c.id == _user_id);

    source.forEach(item => {
        /*if (item.id != _user_default.id)*/
        _html += ` 
        <div class="row-select" onclick="selected_profesor(${item.id})"> <span id="profesor_${item.id}" class="">${item.nombre} ${item.apellido}</span>
            <div></div>
        </div>`;

    });

    if (_user_default == undefined) {
        const _user_sesion = JSON.parse(localStorage.getItem("colegio"))
        _user_default = {
            id: _user_id.PerId,
            apellido: _user_sesion.PerApellidos,
            nombre: _user_sesion.PerNombres
        };
    };

    document.getElementById('spnNombreBandeja').textContent = `${_user_default.nombre} ${_user_default.apellido}`;

    document.getElementById('ddlmsnBandeja').innerHTML = _html;
}

function selected_profesor(id) {
    const _profesor = _data_profesores.find(c => c.id == id);

    document.getElementById('spnNombreBandeja').textContent = `${_profesor.nombre} ${_profesor.apellido}`;

    _user_id = _profesor.id;
    $('.content-menu').find('.menu-op').eq(0).find('.item-menu').click();
    ver_otras_bandejas();
}

function convertir_fecha(fecha) {
    const date = fecha.split('/');

    const _date_format = `${date[0]}/${date[1]}/${date[2]}`;

    let _m_date = moment();


    _m_date.set("year", fecha.split('/')[2].split(' ')[0]);
    _m_date.set("month", parseInt(date[1]) - 1);
    _m_date.set("date", date[0]);

    if (fecha.split(' ')[1].split(':').length > 0) {

        _m_date.set("hour", fecha.split(' ')[1].split(':')[0]);
        _m_date.set("minute", fecha.split(' ')[1].split(':')[1]);
    }

    return _m_date;
}

function validar_datos(_data) {
    let _result = true;

    if (_data.mensaje.MenAsunto == '') {
        mostrar_mensaje_validacion_error('Asunto obligatorio.');
        result = false;
        return;
    }
    if (_data.mensaje.MenMensaje == '') {
        mostrar_mensaje_validacion_error('No hay mensaje.');
        result = false;
        return;
    }

    return _result;
}

function mostrar_mensaje_validacion_error(mensaje) {

    window.parent.parent.mostrar_mensajes('', mensaje, 'error', true, false, false, 'Aceptar', '', '', '', () => {

    });
}

(async function() {
    _user_id = JSON.parse(localStorage.getItem("colegio")).PerId;
    window.parent.cargar_mensajes_no_leidos();
    consultar_propfesores();
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