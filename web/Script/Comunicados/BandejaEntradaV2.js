const _tipo_mensaje = { borradores: -2, eliminados: -1, bandeja: 0, Enviados: 1, NoLeidos: 2 }
let _mensaje_context = {}, data_mensajes = [], id_bandeja = -1, _is_recibido = 0, _sesion = {};//39;
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

function strar_no_leidos(_ocultar_leidos) {
    if (_ocultar_leidos) {
        $('.mensaje-leido').addClass('d-none');
    } else {
        $('.mensaje-leido').removeClass('d-none');
    }
}
function convertir_fecha(fecha) {
    //const date = fecha.split('/');

    //const _date_format = `${date[0]}/${date[1]}/${date[2]}`;

    //let _m_date = moment();


    //_m_date.set("year", fecha.split('/')[2].split(' ')[0]);
    //_m_date.set("month", parseInt(date[1]) - 1);
    //_m_date.set("date", date[0]);

    //if (fecha.split(' ')[1].split(':').length > 0) {

    //    _m_date.set("hour", fecha.split(' ')[1].split(':')[0]);
    //    _m_date.set("minute", fecha.split(' ')[1].split(':')[1]);
    //}
    _m_date = moment(fecha);
    return _m_date;
}
function buscar_mensajes(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = data_mensajes;
    }
    else {
        filtered = data_mensajes.filter(x => x.MenAsunto.toString().toLowerCase().indexOf(_text) > -1
            || x.PerApellidos.toString().toLowerCase().indexOf(_text) > -1
            || x.PerNombres.toString().toLowerCase().indexOf(_text) > -1);
    }


    var _html = '';
    if (filtered.length > 0) {
        filtered.forEach(_mensaje => {
            _html += renderizar_bandeja(_mensaje);
        });
    } else {
        _html = no_hay_mensajes();
    }

    document.getElementById('tbodydatos').innerHTML = _html;
}
function mostrar_mensaje() {
    if ($('#DivMensaje').hasClass('d-none')) {
        $('#DivMensaje').fadeIn();
        $('#DivTableMsn').css('display', 'none');
        $('#DivMensaje').addClass('d-flex').removeClass('d-none');

    } else {
        $('#DivMensaje').addClass('d-none').removeClass('d-flex');
        $('#DivTableMsn').css('display', 'block');
        $('#DivMensaje').fadeOut();

    }
    $('#enviarReplicaBtn').addClass('d-none');
}
async function cargar_bandeja(tipo, _this) {
    $('#enviarReplicaBtn').addClass('d-none');
    $('.fa-glasses').css('color', '#999');
    $('#DivAcBuscarMensajes, #BtnNoLeidos').removeClass('d-none');
    $('#buscargrado').val('');

    if (_tipo_mensaje[tipo] == _tipo_mensaje.eliminados) {
        $('#btnMensajesOpciones').addClass('d-none').removeClass('d-flex');
        $('#BtnModalMensaje').addClass('w-100 justify-content-end');
    } else {
        $('#btnMensajesOpciones').removeClass('d-none').addClass('d-flex');
        $('#BtnModalMensaje').removeClass('w-100 justify-content-end');
    }

    await consultarAPI(`BandejaEntrada/mensajes?tipo=${_tipo_mensaje[tipo]}`, 'GET', response => {
        let _html = '';

        if (_this != undefined) {
            $('.actived').removeClass('actived');
            $(_this).addClass('actived');
            $('#DivMensaje').addClass('d-none').removeClass('d-flex');
            $('#DivTableMsn').css('display', 'block');
        }

        data_mensajes = response;
        if (response.length > 0) {

            var _agrupado = _.groupBy(response, 'CatDescripcion');

            Object.keys(_agrupado).forEach(c => {

                let _desc = c;

                if (_desc == '') {
                    _desc = "Sin Categoría";
                }
                
                _html += '<tr>';
                _html += `<td style="color:${_agrupado[c][0].MenColor}" onclick="ocultar_categoria(${_agrupado[c][0].MenCategoriaId},this)" colspan="3">${_desc}</td>`;
                _html += `<td style="color:${_agrupado[c][0].MenColor}"> ${_agrupado[c].length}</td>`;
                _html += '</tr>';
                let _html_categoria = '';
                _agrupado[c].forEach(m => {
                    _html_categoria += renderizar_bandeja(m);
                });
                _html += _html_categoria;

            });

            setTimeout(c => { fixed_table_scroll('tblDatosMensajes'); }, 300);
        } else {
            _html = no_hay_mensajes();
        }
        document.getElementById('tbodydatos').innerHTML = _html;
        $('[data-toggle="tooltip"]').tooltip();
    });

    window.parent.cargar_mensajes_no_leidos();


    limpiar_mensaje_leido();
}
function renderizar_bandeja(_mensaje) {

    let _html = '';
    const color = _mensaje.MenColor == "" ? "#ebebeb" : _mensaje.MenColor;
    //border: 2px solid #A8518A
    _html += `<tr categoria="${_mensaje.MenCategoriaId}" clase="${_mensaje.BanClaseId}" class="${_mensaje.BanHoraLeido == null ? 'sin-leer' : 'mensaje-leido '}" >`;
    //_html += `<div style="border: 2px solid ${color}"></div>`;
    _html += '<td ><div class="custom-control custom-checkbox">';
    _html += `<input type="checkbox" class="custom-control-input d-none" onclick="habiitar_btn_encabezado(this)" id="customCheck${_mensaje.MenId}">`;

    _html += `<label class="custom-control-label d-none" for="customCheck${_mensaje.MenId}"></label>`;
    _html += `<i onclick="marcar_destacado(${_mensaje.BanId},this)" data-toggle="tooltip" title="Favorito" class="${(_mensaje.BanDestacado == 0 ? 'far no-favorito' : 'fa favorito')} fa-star"></i>`;
    if (_mensaje.MenColor != '')
        _html += `<i data-toggle="tooltip" title="${_mensaje.CatDescripcion}" style="color:${_mensaje.MenColor};margin-left:4px" class="fas fa-tag"></i>`;

    if (_mensaje.TieneAdjuntos > 0)
        _html += `<i data-toggle="tooltip" title="Adjuntos"  class="fas fa-paperclip"></i>`;

    _html += '</td>';
    _html += `<td onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${_mensaje.PerApellidos} ${_mensaje.PerNombres}</td>`;
    _html += `<td onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${_mensaje.MenAsunto}</td>`;
    _html += `<td onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${(_mensaje.MenFecha.split(' ')[0])}</td>`;

    //_html += `<td onclick="consultar_mensaje(this,${_mensaje.MenId},${_mensaje.BanId},${_mensaje.BanOkRecibido})">${localLocale.startOf().fromNow()}</td>`;
    _html += '</tr>';

    return _html;
}
function no_hay_mensajes() {
    let _html = '';

    _html += '<tr><td colspan="4"><div class="text-center pt-5" id="cargando_mensajes">';
    _html += '<span style="color:#6c757d" >No hay mensajes</span>';
    _html += '<br/><i style="font-size:62px;color:#6c757d" class="far fa-envelope-open"></i>';
    _html += '</div></td></tr>';

    return _html;
}
function ocultar_categoria(_id, _this) {
    if ($(_this).attr('closed') != undefined) {
        $(_this).removeAttr('closed');
        $(`#tbodydatos tr[categoria="${_id}"]`).fadeIn();
    } else {
        $(_this).attr('closed', 'true');
        $(`#tbodydatos tr[categoria="${_id}"]`).fadeOut();
    }
}
function limpiar_mensaje_leido() {
    document.getElementById('MenAsunto').textContent = "";
    document.getElementById('MenUsuario').textContent = "";
    document.getElementById('MenFecha').textContent = "";
    document.getElementById('MenMensaje').innerHTML = "";
    document.getElementById('DivIniciales').textContent = "";
}
function armar_para_redactar(_sent_to) {
    let _html = '';
    _sent_to.forEach(c => {
        _html += c.nombre + ';';
    });

    return _html;
}
function consultar_mensaje(_this, _id, _idBandeja, _is_rta_ok) {
    $('#DivAdjuntos').empty();
    reiniciar_reenviar();
    if ($('.panel').find('.actived').attr('borrador') == 'true') {

        ocultar_bandeja(_id);
        return;
    }

    id_bandeja = _idBandeja;
    _this_ctx = _this;
    if (_idBandeja == 0) {
        _is_rta_ok = 0;
        $('.responder').addClass('d-none');
    } else {
        $('.responder').removeClass('d-none');
    }

    _is_recibido = _is_rta_ok;
    if (_is_rta_ok == 0) {
        $('.recividook').addClass('d-none');
    } else {
        $('.recividook').removeClass('d-none');
    }
    $('#DivAcBuscarMensajes, #BtnNoLeidos').addClass('d-none');
    consultarAPI(`Mensajes/?id=${_id}&bandeja=${_idBandeja}`, 'GET', response => {
        $(_this).closest('tr').addClass('mensaje-leido').removeClass('sin-leer');
        $('#modalverMensaje').modal('show');
        $('.container-kids__content').addClass('d-none');
        renderizar_mensaje(response._mensaje);

        if (response.replicas != null) renderizar_replicas(response.replicas);
        if (response.adjuntos != null && response.adjuntos.length > 0)
            renderizar_adjuntos(response.adjuntos);

        mostrar_mensaje();
        window.parent.cargar_mensajes_no_leidos();
        renderizar_categorias();
        renderizar_clases_bandeja();
        actualizar_bandeja_count();
    });
}
function renderizar_replicas(mensaje) {

    $('#ContenedorMensaje').append(renderizar_mensaje_replica(mensaje._mensaje));

    if (mensaje.replicas != null) {
        renderizar_replicas(mensaje.replicas);
    }
}
function renderizar_mensaje_replica(_mensaje) {
    let _html = ``;

    _html += `<div class="mensaje-detalle mt-2">
                                        <div class="rounded-lg mensaje p-2" style="border:1px solid #ebebeb;border-radius:5px">
                                            <div class="titulo-mensaje">
                                                <div class="titulo-mensaje d-flex justify-content-between">
                                                    <div class="d-flex pb-1">
                                                        <div class="bg-secondary rounded-circle text-white" style="display:flex;justify-content:center;align-items:center;width:45px">

                        <div>${ iniciales_usuario(_mensaje.usuario.PerNombres, _mensaje.usuario.PerApellidos)}</div></div>
                                                        <div class=" ml-2">
                                                            <div>
                                                                <span style="font-size:20px">${ _mensaje.usuario.PerApellidos + ' ' + _mensaje.usuario.PerNombres}</span>
                                                            </div>
                                                            <div style="line-height:0.5">
                                                                <label style="font-size:12px;">Para:</label>
                                                                <label style="font-size:12px;" >${armar_para_redactar(JSON.parse(_mensaje.MenSendTo))}</label>
                                                            </div>
                                                        </div>
                                                    </div>                                                    
                                                    <div>
                                                        <span class="mensaje-fecha" style="font-size:14px" >Fecha de envío: ${ moment(_mensaje.MenFecha).format("DD/MM/YYYY HH:mm A")}</span>
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-end w-100"></div>
                                                <div class="d-flex justify-content-between mt-2">
                                                    <div>
                                                        <label class="">Asunto:</label>

                                                        <span style="font-size:14px">${_mensaje.MenAsunto}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <div class="lectura-mensaje pt-2" style="border-top:1px solid #ebebeb">${_mensaje.MenMensaje}</div>
                                            </div>
                                            <p class="d-none font-weight-bold m-0" id="spnAdjuntos">Adjuntos:</p>
                                            <div id="DivAdjuntos" class="d-flex">
                                            </div>
                                        </div>
                                    </div>`;

    return _html;
}
function reiniciar_reenviar() {
    document.getElementById('MenMensaje').innerHTML = '';
    $('.ql-editor')[0].innerHTML = "";
    $('#DivRespuesta').removeClass('d-block').addClass('d-none');
}
function renderizar_adjuntos(_adjuntos) {
    let _html = "";

    _adjuntos.forEach(a => {
        _html += `<div class="adjunto-mensaje rounded border p-2 m-1">`;
        _html += `<a href="${window.location.href.toLowerCase().split('views')[0]}api/adjunto/descargar?id=${a.AjdId}">`;
        _html += `<img style="width:30px" src="${_get_icono(a.AjdExtension)}" />`;;
        _html += `${a.AdjNombre}${a.AjdExtension}</a></div>`
    });
    document.getElementById('DivAdjuntos').innerHTML = _html;
    $('#spnAdjuntos').removeClass('d-none');
}
function renderizar_mensaje(_mensaje) {

    let _fecha = convertir_fecha(_mensaje.MenFechaMaxima);

    document.getElementById('DivIniciales').textContent = iniciales_usuario(_mensaje.usuario.PerNombres, _mensaje.usuario.PerApellidos);
    document.getElementById('MenAsunto').textContent = _mensaje.MenAsunto;
    document.getElementById('MenUsuario').textContent = _mensaje.usuario.PerApellidos + ' ' + _mensaje.usuario.PerNombres;
    document.getElementById('MenFecha').textContent = "Fecha de envío: " + moment(_mensaje.MenFecha).format("DD/MM/YYYY HH:mm A");
    document.getElementById('MenMensaje').innerHTML = _mensaje.MenMensaje;
    document.getElementById('para_recibido').textContent = armar_para_redactar(JSON.parse(_mensaje.MenSendTo));

    $('#MenFechaMaxima').addClass('d-none');
    if (_mensaje.MenFechaMaxima != null && _mensaje.MenFechaMaxima != '') {
        document.getElementById('MenFechaMaxima').textContent = "Fecha máxima de respuesta: " + moment(_fecha).format("DD/MM/YYYY HH:mm A");

        $('#MenFechaMaxima').removeClass('d-none');
    }


    if (_mensaje.MenBloquearRespuesta == 1) $('.responder').css('display', 'none');
    else $('.responder').css('display', '');

    if (_mensaje.MenOkRecibido == 1) $('.recividook').css('display', 'none');
    else $('.recividook').css('display', '');
    _mensaje_context = _mensaje;


    //si la fecha maxima es positiva es porque ya se paso el tiempo para responder el mensaje
    if (_mensaje.MenFechaMaxima != null && _mensaje.MenFechaMaxima != '')
        var _duracion = moment.duration(moment().diff(_fecha)).asMinutes();

    if (_duracion > 0) {
        $('#DivBtnReplicar').addClass('d-none');
        $('#MenFechaMaxima').addClass('text-danger');
    } else {
        $('#DivBtnReplicar').removeClass('d-none');
        $('#MenFechaMaxima').removeClass('text-danger');
    }

}
function nuevo_mensaje(id) {
    let _url = window.location.href.toLowerCase().split('comunicados')[0];
    var _paramter = '';

    if (id != undefined) {
        _paramter = '?id=' + id;
    }
    window.location.href = _url + 'comunicados/nuevomensaje.html' + _paramter;
}
function recibido_ok() {
    if (_is_recibido == 0) {

        consultarAPI('BandejaEntrada/mensajes/recibido', 'POST', (response) => {
            window.parent.mostrar_mensajes('', 'Mensaje de recibido correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
                mostrar_mensaje();
            });
        }, { id: id_bandeja }, (error) => {
            alert('mal');
        });
    }
}
function check_All(_this) {
    if ($(_this).is(':checked')) {
        $('#tbodydatos').find('input[type="checkbox"]').attr('checked', 'checked');

        $('.menu-panel i').css('color', 'black');
    } else {

        $('#tbodydatos').find('input[type="checkbox"]').removeAttr('checked');

        $('.menu-panel i').css('color', '#666');
    }
    habiitar_btn_encabezado(_this);
}
function habiitar_btn_encabezado(_this) {
    if ($(_this).is(':checked')) {
        $('#EncabezadoIconos').removeClass('d-none');
    } else {
        $('#EncabezadoIconos').addClass('d-none');
    }
}
function ocultar_replica() {
    //si es negativo es porque se encuentra dentro de la fecha maxima de envio

    $('#DivRespuesta').addClass('d-none').removeClass('d-block');


}
function replicar_mensaje() {

    $('#DivRespuesta').addClass('d-block').removeClass('d-none');
    $('#enviarReplicaBtn,#AdjuntosReplicaBtn').removeClass('d-none');
}
function enviar_replica_mensaje() {
    let data = {};
    let mensaje = obtener_datos_replica();
    data.destinatarios = obtener_destinatarios();
    data.mensaje = mensaje;
    data.adjuntos = obtener_adjuntos_al_mensaje();
    consultarAPI('Mensajes', 'POST', (response) => {

        if (response.codigo > 0) {
            window.parent.mostrar_mensajes('', 'Mensaje enviado correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
                ocultar_replica();
                $('#DivTableMsn').css('display', 'block');
                $('#enviarReplicaBtn').addClass('d-none');
            });
        }
        else {
            window.parent.mostrar_mensajes('', response.respuesta, 'error', true, false, false, 'Aceptar', '', '', '', () => {
                ocultar_replica();
                $('#DivTableMsn').css('display', 'block');
                $('#enviarReplicaBtn').addClass('d-none');
            });

        }
    }, data, (error) => {
        alert('mal');
    });

}
function obtener_destinatarios() {
    return [{ id: _mensaje_context.MenUsuario, tipo: _mensaje_context.MenTipoMsn }];
}
function obtener_datos_replica() {
    var myobject = {
        MenId: 0, MenEmpId: _sesion.empresa, MenUsuario: _sesion.idusuario, MenClase: 1, MenTipoMsn: 'E', MenAsunto: '',
        MenMensaje: '', MenReplicaIdMsn: 0, MenOkRecibido: 0, MenSendTo: '', MenBloquearRespuesta: 0, MenCategoriaId: 0
    };

    myobject.MenReplicaIdMsn = _mensaje_context.MenId;

    myobject.MenMensaje = quill.root.innerHTML;
    myobject.MenAsunto = _mensaje_context.MenAsunto;
    myobject.MenOkRecibido = 1;
    myobject.MenBloquearRespuesta = 1;
    myobject.MenSendTo = _mensaje_context.MenSendTo;
    myobject.MenCategoriaId = _mensaje_context.MenCategoriaId;

    return myobject;
}
function mostrar_panel_mensajes() {
    if (_times == 0) {
        _times = 1;
        $('.panel').find('span').fadeOut();
        $('.panel').find('.no-btn').fadeOut();
        setTimeout(() => {
            $('.panel').css('width', '60px');

            calcular_width_tabla();
        }, 400);
        //
        $('#LiOocionesCategorias').find('ul').css('display', 'none');
        $('#LiOocionesClases').find('ul').css('display', 'none');
        $('.panel').find('[open="open"]').removeAttr('open');
    } else {
        _times = 0;
        $('.panel').find('span').fadeIn();
        $('.panel').find('.no-btn').fadeIn();
        $('.panel').css('width', '180px');
        calcular_width_tabla();
    }

}
function mostrar_ul(_this) {
    let _attr = $(_this).attr('open');
    if (_attr == undefined) {
        $(_this).attr('open', 'open');
        $(_this).closest('li').find('ul').fadeIn();
        $(_this).closest('li').find('ul').removeClass('d-none');
    } else {
        $(_this).removeAttr('open');
        $(_this).closest('li').find('ul').fadeOut();
    }
}
function calcular_width_tabla() {
    let _container = $('.container-kids__content').width();
    let _panel = $('.panel').width();
    $('#DivTableMsn').css('width', (_container - (_panel + 30)) + 'px');
}
function renderizar_categorias() {
    consultarAPI('BandejaEntrada/mensajes/NoLeido/categorias', 'GET', (_response) => {
        document.getElementById('LiOocionesCategorias').innerHTML = renderizar_tipo_bandeja(_response, 'categoria');
    });
}
async function renderizar_clases_bandeja() {
    consultarAPI('BandejaEntrada/mensajes/NoLeido/tipo', 'GET', (_response) => {
        document.getElementById('LiOocionesClases').innerHTML = renderizar_tipo_bandeja(_response, 'clase');
    });
}
function renderizar_tipo_bandeja(_response, _attr) {
    let _html = '';
    _html = `<ul class="list-group list-group-flush list-sub-menu d-none">`
    _response.forEach(c => {

        _html += `<li class="list-group-item" onclick=ver_mensajes__tipo(this,${c.id},\"${_attr}"\)>`;
        _html += `<div class="d-flex justify-content-between">`;
        _html += `<div class="w-100">${c.Color != undefined ? `<i data-toggle="tooltip" style="color:${c.Color};" class="fas fa-tag"></i>` : ``}${c.Descripcion}</div>`;
        _html += `<div style="color:#2E8CFF" class="">${c.Count == 0 ? '' : c.Count}</div>`;
        _html += `<div>`;
        _html += `</li>`;
    });
    _html += `</ul>`;


    return _html;

}
function Ver_mensaje_x_tipo() {

}
function marcar_destacado(id, _this) {
    let _estado = 1;
    if ($(_this).hasClass('favorito')) {
        _estado = 0;
        $(_this).removeClass('fa').addClass('far').removeClass('favorito');
    } else {
        $(_this).removeClass('far').addClass('fa').addClass('favorito');
    }

    consultarAPI(`BandejaEntrada/mensajes/favorito?id=${id}&estado=${_estado}`, 'GET', (_r => {

    }));
}
function cargar_mensajes() {
    window.location.reload();
}
function actualizar_bandeja_count() {
    let _inter = setInterval(C => {
        if (localStorage.getItem('noleidos') != undefined) {
            clearInterval(_inter);
            document.getElementById('countNoLeidos').textContent = localStorage.getItem('noleidos');
            document.getElementById('numeroMsn').textContent = localStorage.getItem('noleidos');
        }
    }, 500)
}
function cerrar_modal() {
    cerrar_modal_nuevo();
    $('.panel').find('.actived').click();
    renderizar_categorias();
    renderizar_clases_bandeja();
    window.parent.cargar_mensajes_no_leidos();
    actualizar_bandeja_count();
}
function cerrar_modal_mensaje() {
    $('.container-kids__content, #DivAcBuscarMensajes').removeClass('d-none');
    $('#icono_notificacion_mensajes').find('button').removeClass('d-none');
}
function cerrar_modal_nuevo() {
    $('#exampleModal').modal('hide');
    $('.container-kids__content, #DivAcBuscarMensajes').removeClass('d-none');
    $('#icono_notificacion_mensajes').find('button').removeClass('d-none');
}
function ocultar_bandeja(id) {
    colapsar_modal();
    var url = 'NuevoMensaje.html';
    if (id != undefined) {
        url += '?id=' + id;
    }

    $('#frameNuevoMensaje').attr('src', url);
    $('#exampleModal').modal('show');
    $('.container-kids__content').addClass('d-none');
}
function Ver_no_leidos(_this) {
    if (_times_glasses == 0) {
        _times_glasses = 1;
        $(_this).css('color', '#369');
        $(_this).closest('button').addClass('btn-active-gmail');
    } else {
        _times_glasses = 0;
        $(_this).css('color', 'black');
        $(_this).closest('button').removeClass('btn-active-gmail')

    }
    mostrar_no_leidos(_times_glasses == 0 ? false : true);
}
function mostrar_no_leidos(_is_hidden) {
    if (_is_hidden)
        $('.mensaje-leido ').addClass('d-none');
    else
        $('.mensaje-leido ').removeClass('d-none');
}
function ver_destacados(_this) {
    $('.actived').removeClass('actived');
    $(_this).addClass('actived');
    $('#tbodydatos').find('.no-favorito').closest('tr').remove();
}
function ver_mensajes__tipo(_this, _tipo, _attr) {
    $('.actived').removeClass('actived');
    $(_this).addClass('actived');
    $('#tbodydatos').find('tr').removeClass('d-none');
    $('#tbodydatos').find('tr').not(`tr[${_attr.trim()}="${_tipo}"]`).addClass('d-none');
}
function expandar_modal() {
    $('#modalsize, #modalsize2').addClass('modal-full-view');
    $('.fa-expand-alt').closest('button').addClass('d-none');
    $('.fa-compress-alt').closest('button').removeClass('d-none');
}
function colapsar_modal() {
    $('#modalsize, #modalsize2').removeClass('modal-full-view');
    $('.fa-compress-alt').closest('button').addClass('d-none');
    $('.fa-expand-alt').closest('button').removeClass('d-none');
}
function tamano_frame() {
    let _w = $(window).width();

}
function eliminar_mensaje() {

    consultarAPI('BandejaEntrada/mensajes/cambioEstado', 'POST', () => {

    }, {
            idBandeja: id_bandeja,
            Estado: -1
        });

    let index = data_mensajes.findIndex(c => c.BanId == id_bandeja);
    data_mensajes.splice(index, 1);
    $(_this_ctx).closest('tr').remove();

    $('#modalverMensaje').modal('hide');
    $('.container-kids__content').removeClass('d-none');
}
function adjuntar() {
    $('#myInput').click();
}
function obtener_adjuntos_al_mensaje() {
    return _adjuntos_cargados.map(c => c.AjdId);
}
function cargar_adjuntos() {

    let _html = '';

    _adjuntos_cargados.forEach(a => {
        _html += `<div class="adjunto-mensaje rounded border p-2 mt-1 mr-1">`;
        _html += `<a href="${window.location.href.toLowerCase().split('views')[0]}api/adjunto/descargar?id=${a.AjdId}">`;
        _html += `<img style="width:30px" src="${_get_icono(a.AjdExtension)}" />`;;
        _html += `${a.AdjNombre}${a.AjdExtension}</a>`

        _html += `<button type="button" class="close" aria-label="Close" onclick="eliminar_adjunto(${a.AjdId},this)">`;
        _html += '<span aria-hidden="true">&times;</span>';
        _html += '</button></div>';
    });
    document.getElementById('DivAdjuntoreplica').innerHTML = _html;
    //return _html;

}
function armar_url_adjuntos() {
    let _url = '';
    let _usuario = obtener_session().idusuario, _adjunto = 0;

    _url += '?usuario=' + _usuario;
    _url += '&adjunto=' + _adjunto;

    return _url;
}
function subirAdjunto() {

    let _url = window.location.href.toLowerCase().split('views')[0];

    var formData = new FormData();
    var file = $('#myInput')[0];
    formData.append('file', file.files[0]);
    $.ajax({
        url: `${_url}api/Adjuntos${armar_url_adjuntos()}`,
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
function eliminar_adjunto(_id, _this) {
    var _data = { id: _id };
    consultarAPI('adjunto/eliminar', 'POST', () => {
        $(_this).closest('.card').remove();
        let _index = _adjuntos_cargados.findIndex(c => c.AjdId == _id);
        _adjuntos_cargados.splice(_index, 1);


        cargar_adjuntos();

    }, _data);
}
(async function () {
    calcular_width_tabla();
    window.parent.cargar_mensajes_no_leidos();
    renderizar_categorias();
    renderizar_clases_bandeja();
    await cargar_bandeja('bandeja');

    if (Get_query_string('noLeidos') == 'true') {
        Ver_no_leidos($('#icono_notificacion_mensajes').find('i')[0]);
    }
    _sesion = obtener_session();
    $('[data-toggle="tooltip"]').tooltip()
    actualizar_bandeja_count();
    tamano_frame();
})();
$(window).resize(tamano_frame);

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && typeof module.exports === 'object') {
        factory(require('jquery'));
    } else {
        factory(jQuery);
    }
});
