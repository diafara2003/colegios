const _tipo_mensaje = { borradores: -2, eliminados: -1, bandeja: 0, Enviados: 1, NoLeidos: 2 }
let _tipoSelected = "Enviados";
let readonly = false;
let _mensaje_context = {},
    acudiente = [],
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
    if (apellidos == null) apellidos = "";
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
    debugger;
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
async function buscar_personas() {
    $('#cargando').css('display', 'block');
    $('#RegistroPrincipal, #EnvioGrupos').empty();

    const data = await consultarAPI(`Mensajes/destinatarios?idusuario=${_sesion.idusuario}&filter= `, 'GET');
    _data_source_ac = data;


    if (_sesion.tipo == 0 || _sesion.tipo == 1) {
        $('#RegistroPrincipal').append(renderizar_modal_destinatarios(data.find(c => c.tipo == -40), false, 'colegio'));


        $('#RegistroPrincipal').append(renderizar_modal_destinatarios({
            PerId: 0,
            tipo: -30,
            GrEnColorRGB: '#43AC34',
            GrEnColorObs: 'Planta educativa',
            PerNombres: 'Planta educativa',
            PerApellidos: ''
        }, true, 'planta'));
    }
    if (_sesion.tipo == 3)
        data.forEach((c, index) => $('#EnvioGrupos').append(renderizar_modal_destinatarios(c, false, 'grupo', index)));
    else
        data.filter(c => c.tipo == -20).forEach(x => $('#EnvioGrupos').append(renderizar_modal_destinatarios(x, true, 'grupo_detalle')));


    $('#cargando').css('display', 'none');

}

function renderizar_modal_destinatarios(item, showIcon, tipo, index) {
    if (item == undefined) return '';
    if (item.PerApellidos == null) item.PerApellidos = "";

    return `
            <div class="mt-1 grupo-class" id_destinatario="${item.PerId}">
               <div class="d-flex align-items-center hover-item p-1" >
                     <div><input tipo="${tipo}" ${tipo}="${(_sesion.tipo == 3 ? index : item.PerId)}"  type="checkbox" value="" onclick="checked_destinatarios(this,${item.tipo},${item.PerId})" id="check_${item.tipo}"></div>
                     <div class="photo-user" style="color:white;border:1px solid ${item.GrEnColorRGB};background:${item.GrEnColorRGB}">${iniciales_usuario(item.PerApellidos, item.PerNombres)}</div>
                    ${(_sesion.tipo != 3 ? `<div class="pl-2" style="color:${item.GrEnColorRGB}">${item.PerNombres} ${item.PerApellidos}</div>` :
            `<div>
                        <div class="pl-2" style="color:${item.GrEnColorRGB}">${item.PerNombres} ${item.PerApellidos}</div>
                        <div class="pl-2 text-muted" style="overflow: auto;white-space: pre-wrap;word-break: break-word;color:${item.GrEnColorRGB}">${item.CurDescripcion}</div>
                    <div>`)}
                    ${(showIcon ? `
                        <div class="pl-2" onclick="ver_detalles(this,${item.PerId},${item.tipo})">
                            <i class='bx bx-down-arrow-alt'></i>
                        </div>
                    ` : ``)}
                </div>
            <div style="display:none" id="destinatario_detalle_${item.PerId}" class="detalle-grupos pl-4"></div>
             </div>`;
}
async function ver_detalles(_this, id, tipo) {
    $(`#destinatario_detalle_${id}`).empty();

    $(`#destinatario_detalle_${id}`).toggle();


    if ($(_this).find('i.bx-down-arrow-alt').length > 0) $(_this).find('i.bx-down-arrow-alt').addClass('bx-up-arrow-alt').removeClass('bx-down-arrow-alt');
    else $(_this).find('i.bx-up-arrow-alt').addClass('bx-down-arrow-alt').removeClass('bx-up-arrow-alt')

    if ($(`#destinatario_detalle_${id}`).css('display') == 'block') {

        $(`#destinatario_detalle_${id}`).append(`<i class='bx bx-loader bx-spin  bx-md'></i>`);

        if (tipo == -30)
            _data_source_ac.filter(c => c.tipo == tipo).forEach(x => {
                $(`#destinatario_detalle_${id}`).find('.bx-loader').remove();

                let _parend_checked = false;

                if ($('#check_-30').is(':checked') || $('#check_-40').is(':checked'))
                    _parend_checked = true;

                $(`#destinatario_detalle_${id}`).append(renderizar_detalle(x, _parend_checked));
            });
        if (tipo == -20) {
            const _info_grupos = await consultarAPI(`Mensajes/info/grupo?idgrupo=${id}`, 'GET');

            if (_info_grupos.length == 0) $(`#destinatario_detalle_${id}`).find(`.bx-loader`).remove();

            let _parend_checked = false;

            if ($(_this).closest('.align-items-center').find('input[type="checkbox"]').first().is(':checked') || $('#check_-40').is(':checked'))
                _parend_checked = true;

            _info_grupos.forEach(c => {
                $(`#destinatario_detalle_${id}`).find('.bx-loader').remove();
                $(`#destinatario_detalle_${id}`).append(renderizar_info_grupo(c, _parend_checked));
            });
        }
    }




}
function renderizar_detalle(item, _readonly_grupos) {

    if (acudiente.find(c => c.PerId == item.PerIdA1) == null) acudiente.push();


    return `
            <div class="d-flex align-items-center mt-1 hover-item p-1 ml-3">
                <div><input onclick="status_check_planta(this)" tipo="profesores" profesores="${item.PerId}" type="checkbox" ${(_readonly_grupos ? ' checked="checked" ' : '')} id="checkDetail_${item.PerId}" /></div>
                <div class="photo-user" style="color:white;border:1px solid ${item.GrEnColorRGB};background:${item.GrEnColorRGB}">${iniciales_usuario(item.PerApellidos, item.PerNombres)}</div>
                <div class="d-block pl-2" style="width:100%">
                    <div class="">${item.PerNombres} ${item.PerApellidos}</div>
                    <div class="text-muted">${item.CurDescripcion}</div>
                </div>
            </div>`;
}
function status_check_planta(_this) {

    let all_checked = true;


    $(_this).closest('.detalle-grupos').find('input[type="checkbox"]').each(function () {
        if (!$(this).is(':checked')) all_checked = false;
    });

    if (all_checked) $('[id_destinatario="0"]').find('.align-items-center').find('input[type="checkbox"]').first().prop('checked', true);
    else $('[id_destinatario="0"]').find('.align-items-center').find('input[type="checkbox"]').first().prop('checked', false);

}
function status_check(_this) {

    //se verifica que todo este checkeado
    let all_checked = true;


    $(_this).closest('.detalle-grupos').find('input[type="checkbox"]').each(function () {
        if (!$(this).is(':checked')) all_checked = false;
    });

    if (all_checked) $(_this).closest('.grupo-class').find('.align-items-center').find('input[type="checkbox"]').first().prop('checked', true);
    else $(_this).closest('.grupo-class').find('.align-items-center').find('input[type="checkbox"]').first().prop('checked', false);

}
function renderizar_info_grupo(item, _readonly_grupos) {
    let _html = '';

    const acudiiente1 = {
        GrEnColorBurbuja: item.color,
        PerNombres: item.PerNombresA1,
        PerApellidos: item.PerApellidosA1,
        CurDescripcion: `${item.EstNombres} ${item.EstApellidos}`,
        PerId: item.PerIdA1,
        idEst: item.EstId
    };
    if (acudiente.find(c => c.PerId == item.PerIdA1) == null) acudiente.push(acudiiente1);

    _html = `
            <div class="d-flex align-items-center mt-1 hover-item p-1 ml-3">
                <div><input onclick="status_check(this)"  tipo="acudiente" acudiente="${item.PerIdA1}" type="checkbox" value="" ${(_readonly_grupos ? ' checked="checked" ' : '')} id="checkDetail_${item.PerIdA1}" /></div>
                <div class="photo-user" style="color:white;border:1px solid ${item.color};background:${item.color}">${iniciales_usuario(item.PerNombresA1, item.PerApellidosA1)}</div>
                <div class="d-block pl-2">
                    <div class="">
                        ${item.PerNombresA1} ${item.PerApellidosA1}
                        <span class="text-muted">(${item.TipoA1})</span>
                    </div>
                     <div class="text-muted">${item.EstNombres} ${item.EstApellidos}</div>
                </div>
            </div>`;

    if (item.PerIdA2 > 0) {

        const acudiiente2 = {
            GrEnColorBurbuja: item.color,
            PerNombres: item.PerNombresA2,
            PerApellidos: item.PerApellidosA2,
            CurDescripcion: `${item.EstNombres} ${item.EstApellidos}`,
            PerId: item.PerIdA2,
            idEst: item.EstId
        };

        if (acudiente.find(c => c.PerId == item.PerIdA2) == null) acudiente.push(acudiiente2);

        _html += `
          <div class="d-flex align-items-center mt-1 hover-item p-1 ml-3">
                <div><input onclick="status_check(this)" tipo="acudiente" acudiente="${item.PerIdA2}" type="checkbox" value="" ${(_readonly_grupos ? ' checked="checked"  ' : '')} id="checkDetail_${item.PerIdA1}" id="checkDetail_${item.PerIdA1}" /></div>
                <div class="photo-user" style="color:white;border:1px solid ${item.color};background:${item.color}">${iniciales_usuario(item.PerNombresA2, item.PerApellidosA2)}</div>
                <div class="d-block pl-2">
                    <div class="">
                        ${item.PerNombresA2} ${item.PerApellidosA2}
                        <span class="text-muted">(${item.TipoA2})</span>
                    </div>
                    <div class="text-muted">${item.EstNombres} ${item.EstApellidos}</div>
                </div>
            </div>`;
    }
    return _html;
}

function checked_destinatarios(_this, _type, id) {
    if (_type == -40) {
        if ($(_this).is(':checked')) $('#EnvioGrupos, [id_destinatario="0"]').addClass('d-none');
        else $('#EnvioGrupos, [id_destinatario="0"]').removeClass('d-none');

        $('#EnvioGrupos, [id_destinatario="0"]').find('input[type="checkbox"]').prop('checked', false);

    } else if (_type == -30) {

        if ($(_this).is(':checked')) {
            $('#destinatario_detalle_0').find('input[type="checkbox"]').not(_this).prop('checked', true);

            $(_this).attr('checked', 'checked');

        } else
            $('#destinatario_detalle_0').find('input[type="checkbox"]').prop('checked', false);
    }
    else if (_type == -20) {

        if ($(_this).is(':checked')) {
            $(_this).closest('div.mt-1').find('.detalle-grupos').find('input[type="checkbox"]').not(_this).prop('checked', true);

            $(_this).attr('checked', 'checked');

        } else
            $(_this).closest('div.mt-1').find('.detalle-grupos').find('input[type="checkbox"]').prop('checked', false);
    }
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
    let replica = _mensaje_context.usuario == undefined ? false : true;
    destinatarios.push(persona);
    set_sent_to(replica, persona);


    $('#divDestinatarios').append(renderizar_html_seleccionado(persona, true));
    $('#DivBusqueda').text('');
    $('#DivBusqueda').focus();
    $('#DivResultados').empty();
    $('#DivResultados').css('display', 'none');
}
function set_sent_to(replica) {
    let _data = [];
    if (replica) {
        _data.push({
            BG: _mensaje_context.usuario.PerTipoPerfil == 1 ? '#43AC34' : _mensaje_context.usuario.PerTipoPerfil == 0 ? 'red' : '#09BBF9',
            tipo: -35,
            id: _mensaje_context.MenUsuario,
            ocupacion: '',
            nombre: _mensaje_context.usuario.PerNombres,
            apellido: _mensaje_context.usuario.PerApellidos
        });
        //  else JSON.parse(_mensaje_context.MenSendTo).filter(c => c.id != _sesion.idusuario).forEach(c => _data.push(c));
    }

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
function renderizar_html_seleccionado(persona, _id_deleted, color, _plus) {
    if (_plus == undefined) _plus = false;

    if (color == undefined || color == null) color = "";

    _id_deleted = false;
    let _html = ``;
    _html += `<div class="desti-seleccionado" ${color == "" ? "" : `style ="background-color:rgb(186 231 187) !important"`}>
                <span class="desti-cuerpo">
                    <div class="imageArea">
                        <div class="desti-nombre" style="background-color:${persona.GrEnColorBurbuja}">
                            <span>${iniciales_usuario(persona.PerApellidos, persona.PerNombres)}</span>
                        </div>
                    </div>
                  ${(_plus ? '' : `
                    <div style="display:block;max-width:227px">
                        <span class="wellItemText-212">${persona.PerNombres} ${persona.PerApellidos}</span>
                        ${persona.CurDescripcion == undefined || persona.CurDescripcion == '' ? '' : `<small style="overflow:hidden;text-overflow:ellipsis;width:213px">${persona.CurDescripcion}</small>`}
                    </div>`)}
                    
                </span>
            </div>`;


    return _html;
}
function eliminar_persona_selected(_this, id) {
    let _index = destinatarios.findIndex(p => p == id);
    destinatarios.splice(_index, 1);
    $(_this).closest('.desti-seleccionado').remove();
}
function ver_otras_bandejas() {

    if (_sesion.tipo != 0) return;

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
    volver();
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
    _tipoSelected = _tipo_mensaje[tipo]

    window.parent.cargar_mensajes_no_leidos(function (params) {
        document.getElementById('countNoLeidos').textContent = params;
    });
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
function renderizar_sent_to(_data) {
    const _sent_to = JSON.parse(_data);
    let _result = `<div class="sent_to_mensaje">`;

    if (_sent_to.length > 2) {
        for (var i = 0; i < 2; i++) {
            const _item = _sent_to[i];


            _result += renderizar_html_seleccionado({
                GrEnColorBurbuja: _item.BG,
                PerApellidos: _item.apellido,
                PerNombres: _item.nombre,
                CurDescripcion: _item.ocupacion
            }, false);
        }
        _result += renderizar_html_seleccionado({
            GrEnColorBurbuja: '#43AC34',
            PerNombres: (_sent_to.length - 2).toString(),
            PerApellidos: `+${(_sent_to.length - 2)}`,
            CurDescripcion: ''
        }, false,'',true);
    }

    else {
        for (var i = 0; i < _sent_to.length; i++) {
            const _item = _sent_to[i];


            _result += renderizar_html_seleccionado({
                GrEnColorBurbuja: _item.BG,
                PerApellidos: _item.apellido,
                PerNombres: _item.nombre,
                CurDescripcion: _item.ocupacion
            }, false);
        }
    }


    _result += `</div>`;

    return _result;
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
                   
                    ${(_tipoSelected == 1 ? renderizar_sent_to(_mensaje.MenSendTo) : `
                    <div class="xYc">
                        <div class="photo-user" >
                            <div>${iniciales_usuario(_mensaje.PerApellidos, _mensaje.PerNombres)}</div>
                        </div>
                    </div>
                    <div class="yXc xYc">
                        <div class="w-100">
                            <div class="name-from">
                                <div class="bA4">
                                    <span>${_mensaje.PerApellidos} ${_mensaje.PerNombres}</span>
                                    <span class="text-muted">${_mensaje.tipoAcudiente == '' ? '' : `(${_mensaje.tipoAcudiente})`}</span>
                                </div>                                
                            </div>
                            <div class="text-muted font-weight-bold" style="line-height:12px;padding-left:10px">${_mensaje.EstNombres} ${_mensaje.EstApellidos}</div>
                        </div>
                    </div> `)}
                   
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
async function consultar_mensaje(_this, _id, _idBandeja, _is_rta_ok) {

    document.getElementById('mostrarMensaje').innerHTML = '';
    id_bandeja = _idBandeja;
    _this_ctx = _this;
    $('#responderMensaje').addClass('d-none');
    $('.btn-enviar').addClass('d-none');

    if (_tipoSelected == _tipo_mensaje.Enviados) $('.btn-responder').addClass('d-none');
    else $('.btn-responder').removeClass('d-none');


    if (readonly) $('.btn-responder').addClass('d-none');

    $('#mostrarMensaje').css('max-height', 'calc(100vh - 145px)');
    let modoRad = false;
    const response = await consultarAPI(`Mensajes/?id=${_id}&bandeja=${_idBandeja}`, 'GET');


    $(_this).closest('tr').addClass('mensaje-leido').removeClass('sin-leer');


    let _html_sent_to = '';
    _mensaje_context = response.find(c => c.MenId == _id);

    let _html = '';

    if (response.length == 1 && _tipoSelected != 0) {

        let _sent_to = JSON.parse(response[0].MenSendTo);

        _sent_to.forEach(x => {

            _html_sent_to += renderizar_html_seleccionado({
                GrEnColorBurbuja: x.BG,
                PerApellidos: x.apellido,
                PerNombres: x.nombre,
                PerId: x.id,
                CurDescripcion: x.ocupacion,
                tipo: x.tipo
            }, false, 'rgb(186 231 187)');

        });
    }


    if (_tipoSelected == 1) {

        response[response.length - 1]
    }

    response.forEach(c => _html += renderizar_mensaje(c, _html_sent_to));


    document.getElementById('mostrarMensaje').innerHTML = _html;

    mostrar_mensaje();
    window.parent.cargar_mensajes_no_leidos(function (params) {
        document.getElementById('countNoLeidos').textContent = params;
    });


}
function nuevo_mensaje() {
    destinatarios = [];
    $('#Bandejamensajes, #mensaje').addClass('d-none');
    $('#nuevo-mensaje').removeClass('d-none');

    $('#txtBloquearRespuesta').prop('checked', false);
    $('.btn-bloquear-respuesta').removeClass('d-none');
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
function renderizar_mensaje(_mensaje, sent_to) {

    if (sent_to == undefined || sent_to == null) sent_to = '';

    if (_mensaje.usuario.PerApellidos == null) _mensaje.usuario.PerApellidos = "";

    if (_mensaje.MenBloquearRespuesta == 1) $('.btn-responder').addClass('d-none').removeClass('d-block');
    else $('.btn-responder').removeClass('d-none').addClass('d-block');


    return `
            <div class="messages-view ${(_mensaje.MenUsuario == _sesion.idusuario ? 'owner' : '')}">
                <div>
                     ${(sent_to == '' ? '' : `
                        <div class="mensaje-sent-to mb-2 pb-2">
                            <div>
                                <h6>Para:</h6>
                            </div>
                          ${sent_to}
                        </div>

                    `)}
                </div>

                <div class="messages-header">
                    ${(sent_to == '' ? `${_mensaje.MenAsunto}` : `

                    <div>
                        <div>
                            <h6>Asunto:</h6>
                        </div>
                        <div> <h2 class="title-vm">${_mensaje.MenAsunto} </h2></div>
                    </div>`)}
                   
                </div>
                <div class="messages-sent d-flex">
                   
                      ${(sent_to == '' ? `
                      <div class="d-flex" style="width: 200px;">
                        <div class="xYc">
                            <div class="photo-user">
                                <div>${iniciales_usuario(_mensaje.usuario.PerNombres, _mensaje.usuario.PerApellidos)}</div>
                            </div>
                        </div>
                        <div class="yXc xYc d-flex align-items-center">
                            <div class="w-100">
                                <div class="name-from">
                                    <div class="bA4">
                                        <span>${_mensaje.usuario.PerApellidos} ${_mensaje.usuario.PerNombres}</span>
                                    </div>
                                </div>
                                <div class="text-muted" style="line-height:12px;padding-left:10px">${_mensaje.EstNombres} ${_mensaje.EstApellidos}</div>
                            </div>
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="date-view">${moment(_mensaje.MenFecha).format("DD/MM/YYYY HH:mm A")}</span>
                        </div>
                      </div>`: '')}
                   
                  
                </div>
                <div class="messages-body">${_mensaje.MenMensaje}</div>
                <div class="mt-2">${renderizar_html_adjuntos(_mensaje.adjuntos, false)}</div>
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

    if (validar_datos(data, isReplica)) {
        consultarAPI('Mensajes', 'POST', (response) => {
            destinatarios = [];
            $('#modalDestinatario').find('input[type="checkbox"]').prop('checked', false);
        }, data, (error) => {
            alert('mal');
        });

        window.parent.parent.mostrar_mensajes('', 'Mensaje enviado correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
            localStorage.removeItem("adjuntos-mensajes");
            document.getElementById('DivAdjunto').innerHTML = "";
            limpiar_mensaje_leido();
            _adjuntos_cargados = [];
            window.parent.cargar_mensajes_no_leidos(function (params) {
                document.getElementById('countNoLeidos').textContent = params;
            });

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
    if (isReplica) {
        if (_sesion.tipo == 1)
            return [{ id: _mensaje_context.usuario.PerTipoPerfil == 3 ? _mensaje_context.Estudiante : _mensaje_context.MenUsuario, tipo: _mensaje_context.usuario.PerTipoPerfil == 3 ? '-28' : '-35', estudiante: _mensaje_context.Estudiante }];
        else {

            if (_sesion.tipo == 3) return [{ id: _mensaje_context.MenUsuario, tipo: '-35', estudiante: _mensaje_context.Estudiante }];
            else return [{ id: _mensaje_context.MenUsuario, tipo: '-35', estudiante: 0 }];
        }
    } else {

        return destinatarios.map(_item => { return { id: _item.PerId, tipo: _item.tipo, estudiante: (_item.idEst == undefined || _item.idEst == null) ? 0 : _item.idEst } });
    }
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
        MenBloquearRespuesta: $('#txtBloquearRespuesta').is(':checked'),
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
    let _user_default = obtener_usuario_sesion();

    if (_user_default.PerApellidos == null) _user_default.PerApellidos = "";

    _html = ` 
        <div class="row-select" onclick="selected_profesor(${_user_default.PerId})"> <span id="profesor_${_user_default.PerId}" class="">${_user_default.PerNombres} ${_user_default.PerApellidos}</span>
            <div></div>
        </div>`

    source.forEach(item => {
        if (item.apellido == null) item.apellido = "";
        /*if (item.id != _user_default.id)*/
        _html += ` 
        <div class="row-select" onclick="selected_profesor(${item.id})"> <span id="profesor_${item.id}" class="">${item.nombre} ${item.apellido}</span>
            <div></div>
        </div>`;

    });

    if (_user_default == undefined) {
        const _user_sesion = JSON.parse(localStorage.getItem("colegio"))
        _user_default = {
            PerId: _user_sesion.PerId,
            PerApellidos: _user_sesion.PerApellidos,
            PerNombres: _user_sesion.PerNombres
        };
    };
    if (_user_default.PerApellidos == null) _user_default.PerApellidos = "";

    document.getElementById('spnNombreBandeja').textContent = `${_user_default.PerNombres} ${_user_default.PerApellidos}`;

    document.getElementById('ddlmsnBandeja').innerHTML = _html;
}
function selected_profesor(id) {
    let _profesor = _data_profesores.find(c => c.id == id);
    let _user_default = obtener_usuario_sesion();
    if (_profesor == undefined) _profesor = {
        nombre: _user_default.PerNombres,
        apellido: _user_default.PerApellidos == null ? "" : _user_default.PerApellidos,
        id: _user_default.PerId
    };

    if (_profesor.id == _user_default.PerId) {
        _user_id = _user_default.PerId;
        readonly = false;
    }
    else {
        _user_id = _profesor.id;
        readonly = true;
    }

    mode_readOnly();

    document.getElementById('spnNombreBandeja').textContent = `${_profesor.nombre} ${_profesor.apellido}`;


    $('.content-menu').find('.menu-op').eq(0).find('.item-menu').click();
    ver_otras_bandejas();
}
function mode_readOnly() {
    if (readonly) {

        $('#btnEnviar').addClass('d-none');
    }
    else {
        $('#btnEnviar').removeClass('d-none');
    }
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
function validar_datos(_data, isReplica) {
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

    if (destinatarios.length == 0 && !isReplica) {
        mostrar_mensaje_validacion_error('Los destinatarios son obligatorios.');
        result = false;
        return;
    }

    return _result;
}
function mostrar_mensaje_validacion_error(mensaje) {

    window.parent.parent.mostrar_mensajes('', mensaje, 'error', true, false, false, 'Aceptar', '', '', '', () => {

    });
}
function adjuntar() {
    $('#myInput').click();
}
function armar_url_adjuntos() {
    let _url = '';
    let _usuario = obtener_session().idusuario,
        _adjunto = 0;

    _url += '?usuario=' + _usuario;
    _url += '&adjunto=' + _adjunto;

    return '';
}
function subirAdjunto() {

    let _url = 'https://www.comunicatecolegios.com/api';

    var formData = new FormData();
    var file = $('#myInput')[0];
    formData.append('file', file.files[0]);
    $.ajax({
        url: `${_url}/Adjuntos${armar_url_adjuntos()}`,
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('sesion')}`,
            'Accept': 'application/json',
        },
        data: formData,
        contentType: false,
        processData: false,
        success: function (_response) {

            _adjuntos_cargados.push(_response);
            cargar_adjuntos();
        },
        error: function () {
            alert("Faild please try upload again");
        }
    });
}
function cargar_adjuntos() {



    document.getElementById('DivAdjunto').innerHTML = renderizar_html_adjuntos(_adjuntos_cargados, true);
    //return _html;

}
function renderizar_html_adjuntos(_source, isClose) {
    let _html = '';
    _source.forEach(a => {
        _html += `
        <div class="adjunto-mensaje rounded border p-2 m-1 d-flex">
            <div class="text-adjunto">
                <a href="https://www.comunicatecolegios.com/api/adjunto/descargar?id=${a.AjdId}">
                    <img style="width:30px" src="${_get_icono(a.AjdExtension)}" />
                    ${a.AdjNombre}${a.AjdExtension}
                </a>
               </div>
          ${isClose ?
                ` <button type="button" class="close" aria-label="Close" onclick="eliminar_adjunto(${a.AjdId},this)">
                <span aria-hidden="true">&times;</span>
              </button>`: ''} 
        </div>`;
    });

    return _html;
}
function eliminar_adjunto(_id, _this) {
    var _data = { id: _id };
    $(_this).closest('.card').remove();
    let _index = _adjuntos_cargados.findIndex(c => c.AjdId == _id);
    _adjuntos_cargados.splice(_index, 1);


    cargar_adjuntos();
    consultarAPI('adjunto/eliminar', 'POST', undefined, _data);
}
async function abrir_Destinatarios() {


    $('#modalDestinatario').addClass('d-block').removeClass('d-none');
    //if ($('#DivResultados').css('display') == 'block') $('#DivResultados').css('display', 'none');
    //else
    //    if ($('#DivResultados').find('.ul-profesores').find('li').length == 0)
    if (_data_source_ac.length == 0)
        await buscar_personas();
    //    else $('#DivResultados').css('display', 'block');


}
function cerrar_modal_destinatario() {
    let planta_checked = false;
    destinatarios = [];
    $('#divDestinatarios').empty();
    //se obtiene los checked selecionados
    if ($('[tipo="colegio"]').is(':checked')) {
        const persona = _data_source_ac.find(c => c.tipo == -40);
        destinatarios.push(persona);
        $('#divDestinatarios').append(renderizar_html_seleccionado(persona, true));
    } else {

        if ($('[tipo="planta"]').is(':checked')) {
            planta_checked = true;
            let _plantaEducativa = {
                PerId: 0,
                tipo: -30,
                GrEnColorRGB: '#43AC34',
                GrEnColorBurbuja: '#43AC34',
                GrEnColorObs: 'Planta educativa',
                PerNombres: 'Planta educativa',
                PerApellidos: ''
            };
            destinatarios.push(_plantaEducativa);
            $('#divDestinatarios').append(renderizar_html_seleccionado(_plantaEducativa, true));
        } else {
            $('[tipo="profesores"]').each(function () {
                if ($(this).is(':checked')) {
                    let _id = $(this).attr('profesores');

                    const _info = _data_source_ac.find(c => c.PerId == _id);
                    _info.tipo = 35;
                    destinatarios.push(_info);
                    $('#divDestinatarios').append(renderizar_html_seleccionado(_info, true));

                }
            });
        }

        /*PLANTA EDUCATIVA
         else if ($(this).attr('tipo') == "profesores" && !planta_checked) {
                    let _id = $(this).attr('profesores');
                    const _info = _data_source_ac.find(c => c.PerId == _id);
                    _info.tipo = 35;
                    destinatarios.push(_info);
                    $('#divDestinatarios').append(renderizar_html_seleccionado(_info, true));
                    _planta_cheked = true;
                }
         * */

        /*encabezado grupos*/
        $('[tipo="grupo_detalle"]').each(function () {
            if ($(this).is(':checked')) {
                let _id = $(this).closest('div.mt-1').attr('id_destinatario');
                const _info = _data_source_ac.find(c => c.PerId == _id && c.tipo == -20);
                destinatarios.push(_info);
                $('#divDestinatarios').append(renderizar_html_seleccionado(_info, true));
            }
        });


        /*detalles grupos*/
        $('[tipo="acudiente"]').each(function () {
            if ($(this).is(':checked')) {

                let _parent = $(this).closest('.grupo-class').find('[tipo="grupo_detalle"]').is(':checked');
                if ($(this).attr('tipo') == "acudiente" && !_parent) {
                    let _acudiente = { ...acudiente.find(c => c.PerId == $(this).attr('acudiente')) };
                    _acudiente.CurDescripcion = $(this).closest('.align-items-center').find('.text-muted').last().text();
                    _acudiente.tipo = -25;
                    destinatarios.push(_acudiente);
                    $('#divDestinatarios').append(renderizar_html_seleccionado(_acudiente, true));
                }

            }
        });


    }


    //acudiente
    if (_sesion.tipo == 3) {
        $('[tipo="grupo"]').each(function () {
            if ($(this).is(':checked')) {

                let _acudiente = _data_source_ac[$(this).attr('grupo')];
                destinatarios.push(_acudiente);
                $('#divDestinatarios').append(renderizar_html_seleccionado(_acudiente, true));

            }
        });
    }


    $('#modalDestinatario').removeClass('d-block').addClass('d-none');
}
function armar_url_adjuntos(_adjunto) {
    let _url = '';
    let _usuario = obtener_session().idusuario;
        

    _url += '?usuario=' + _usuario;
    _url += '&id=' + _adjunto;

    return _url;
}

(async function () {



    _user_id = JSON.parse(localStorage.getItem("colegio")).PerId;
    window.parent.cargar_mensajes_no_leidos(function (params) {
        document.getElementById('countNoLeidos').textContent = params;
    });
    consultar_propfesores();
    cargar_bandeja('bandeja', $('.active')[0]);

    if (Get_query_string('noLeidos') == 'true') {
        Ver_no_leidos($('#icono_notificacion_mensajes').find('i')[0]);
    }
    _sesion = obtener_session();
    $('[data-toggle="tooltip"]').tooltip()
    actualizar_bandeja_count();

    if (_sesion.tipo != 0)
        $('.btn-bloquear-respuesta').remove();

    if (_sesion.tipo != 0) $('.fa-chevron-down').remove();



    let _id_emp = obtener_session().empresa;
    const empresa = await consultarAPI('Empresa/' + _id_emp, 'GET');
    let _url = window.location.href.toLowerCase().split('views')[0];
    const url = `${_url}api/Adjuntos${armar_url_adjuntos(empresa.EmpLogo)}`;

    empresa.EmpLogo = url;
    if (empresa.EmpLogo != null) {

        try {
            document.getElementById('MenuImgLogoColegio').src = empresa.EmpLogo;//`${_url}api/adjuntos/${empresa.EmpLogo}`;
        } catch (e) { }
    } else {
        document.getElementById('MenuImgLogoColegio').src = '';
    }

})();

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
});