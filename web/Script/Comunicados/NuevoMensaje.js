let _sesion = {};//39;
_adjuntos_cargados = [];
let _data_source_ac = [], destinatarios = [], _sent_to = '', _Categorias = [];
let iniciales = (nombre, apellidos) => {
    //apellidos = apellidos == "" ? nombre.substr(0, 3) : apellidos;
    return `${nombre.substr(0, 1).toUpperCase()}${apellidos.substr(0, 1).toUpperCase()}`;
}
var quill = new Quill('#editor', {
    placeholder: 'Mensaje a enviar',
    theme: 'snow'
});


function descartar() {
    window.parent.cerrar_modal();
}
function buscar_personas(_this) {
    setTimeout(c => {
        let _value = _this.textContent;

        if (_value == "") {
            $('#DivResultados').empty();
            $('#DivResultados').css('display', 'none');
            return;
        }

        consultarAPI(`Mensajes/destinatarios?idusuario=${_sesion.idusuario}&filter=${_value}&temporada=${_sesion.temporada}&empresa=${_sesion.empresa}`, 'GET', (response) => {
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

        _html += `<li class="list-group-item" onclick="renderizar_seleccionado(${i})">`;
        _html += `<div class="destinatario-imagen" style="background:${item.GrEnColorBurbuja}"> ${iniciales(item.PerApellidos, item.PerNombres)}</div>`;
        _html += '<div style="display:block">';
        _html += `<div class="nombre-destinatario">${item.PerApellidos} ${item.PerNombres}</div>`;
        _html += `<div class="text-muted">${item.CurDescripcion}</div>`;
        _html += '</div>';
        _html += '</li>';

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


    $('#DivBusqueda').before(renderizar_html_seleccionado(persona, true));
    $('#DivBusqueda').text('');
    $('#DivBusqueda').focus();
    $('#DivResultados').empty();
    $('#DivResultados').css('display', 'none');
}
function renderizar_html_seleccionado(persona, _id_deleted) {
    let _html = '';
    _html += '<div class="desti-seleccionado">';
    _html += '<span class="desti-cuerpo">';
    _html += '<div class="imageArea">';
    _html += `<div class="desti-nombre" style="background-color:${persona.GrEnColorBurbuja}" aria-hidden="true">`;
    _html += `<span>${iniciales(persona.PerApellidos, persona.PerNombres)}</span>`;
    _html += '</div></div>';
    _html += `<div style="display:block;ine-height: 0px"><span class="wellItemText-212">${persona.PerNombres} ${persona.PerApellidos}</span>`;
    _html += `<small>${persona.CurDescripcion}</small></div>`;
    if (_id_deleted)
        _html += `<button style="margin-top:1px" type="button" onclick="eliminar_persona_selected(this,${persona.PerId})" class="btn-icono"><i class="fas fa-times"></i></button>`;
    _html += '</span>';
    _html += '</div>';

    return _html;
}
function set_sent_to() {
    let _data = [];

    destinatarios.forEach(_item => _data.push({ BG: _item.GrEnColorBurbuja, tipo: _item.tipo, id: _item.PerId, ocupacion: _item.CurDescripcion, nombre: _item.PerNombres, apellido: _item.PerApellidos }));

    return JSON.stringify(_data);
}
function eliminar_persona_selected(_this, id) {
    let _index = destinatarios.findIndex(p => p == id);
    destinatarios.splice(_index, 1);
    $(_this).closest('.desti-seleccionado').remove();
}
function armar_objeto_mensaje() {
    let data = {};
    let mensaje = obtener_datos();
    data.destinatarios = obtener_destinatarios();
    data.mensaje = mensaje;
    data.adjuntos = obtener_adjuntos_al_mensaje();
    return data;
}
function enviar_mensaje() {

    let data = armar_objeto_mensaje();
    if (validar_datos(data)) {
        consultarAPI('Mensajes', 'POST', (response) => {

        }, data, (error) => {
            alert('mal');
        });

        window.parent.parent.mostrar_mensajes('', 'Mensaje enviado correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
            localStorage.removeItem("adjuntos-mensajes");
            descartar();
        });

    }
}
function obtener_adjuntos_al_mensaje() {
    return _adjuntos_cargados.map(c => c.AjdId);
}
function obtener_destinatarios() {
    return destinatarios.map(_item => { return { id: _item.PerId, tipo: _item.tipo } });
}
function obtener_datos() {
    var myobject = {
        MenId: 0, MenEmpId: _sesion.empresa, MenUsuario: _sesion.idusuario, MenClase: 1, MenTipoMsn: 'E', MenAsunto: '',
        MenMensaje: '', MenReplicaIdMsn: 0, MenOkRecibido: 0, MenSendTo: '', MenBloquearRespuesta: 0, MenCategoriaId: 0,
        MenEstado: 0, MenFechaMaxima: ''
    };

    let id = Get_query_string('id');

    if (id != null && id != undefined) {
        myobject.MenId = id;
    }

    myobject.MenMensaje = quill.root.innerHTML;
    myobject.MenAsunto = document.getElementById('MenAsunto').textContent;
    myobject.MenOkRecibido = $('#MenOkRecibido').is(':checked') ? 1 : 0;
    myobject.MenBloquearRespuesta = $('#MenBloquearRespuesta').is(':checked') ? 1 : 0;
    myobject.MenSendTo = set_sent_to();
    myobject.MenCategoriaId = $('#ddlCategoria').find('option:selected').val();
    myobject.MenFechaMaxima = document.getElementById('datetimepicker4').value;

    return myobject;
}
function validar_datos(_data) {
    let _result = true;

    if (_data.MenAsunto == '') {
        mostrar_mensaje_validacion_error('Asunto obligatorio.');
        result = false;
        return;
    }
    if (_data.MenMensaje == '') {
        mostrar_mensaje_validacion_error('No hay mensaje.');
        result = false;
        return;
    }

    return _result;
}
function mostrar_mensaje_validacion_error(mensaje) {
    window.parent.mostrar_mensajes('', mensaje, 'error', true, false, false, 'Aceptar');
}
async function consultar_mensaje(id) {
    //se balida si el panel es borrador

    consultarAPI(`mensajes?id=${id}&bandeja=1`, 'GET', response => {
        // read_only();
        cargar_mensaje(response);
        if (response.adjuntos != null && response.adjuntos.length > 0) {
            _adjuntos_cargados = response.adjuntos;
            cargar_adjuntos();
        }
        $('#bodymensaje').css('display', 'block');
    });
}
function read_only() {
    $('[contenteditable="true"]').removeAttr('contenteditable');

    $('#botones, .ql-toolbar, #DivBusqueda').css('display', 'none');
    $('.ql-container.ql-snow').css('border', 'none');
    quill.disable();

}
function cargar_mensaje(mensaje) {
    // $('.ql-editor')[0].innerHTML = mensaje.MenMensaje;
    quill.clipboard.dangerouslyPasteHTML(0, mensaje.MenMensaje);
    document.getElementById('MenAsunto').textContent = mensaje.MenAsunto;

    if (mensaje.MenOkRecibido == 1) {
        $('#MenOkRecibido').attr('checked', 'checked');
    }

    if (mensaje.MenBloquearRespuesta == 1) {
        $('#MenBloquearRespuesta').attr('checked', 'checked');
    }

    $('#ddlCategoria').find('option[value="' + mensaje.MenCategoriaId + '"]').attr('selected', 'selected');
    let sent_to = JSON.parse(mensaje.MenSendTo);


    sent_to.forEach(_item => {
        let _persona = {};
        //_persona = _item;
        _persona.PerApellidos = _item.nombre;
        _persona.PerNombres = _item.apellido;
        _persona.PerId = _item.id;
        _persona.CurDescripcion = _item.ocupacion;
        _persona.tipo = _item.tipo;
        _persona.GrEnColorBurbuja = _item.BG;
        destinatarios.push(_persona);


        $('#DivBusqueda').before(renderizar_html_seleccionado(_persona, true))
    });


}
function renderizar_categorias(_response) {
    let _html = '<option value="-1">Seleccione una categoria para el mensaje</option>';

    _response.forEach(c => {

        _html += `<option style="color:${c.CatColor}" value="${c.CatId}"><i class="fas fa-tag"></i>${c.CatDescripcion}</option>`;
    });

    document.getElementById('ddlCategoria').innerHTML = _html;
}
async function consultar_categoria() {

    consultarAPI('Categorias', 'GET', response => {
        _Categorias = response;
        if (response.length > 0) {
            renderizar_categorias(response);
        } else {
            $('#DivCategorias').addClass('d-none').removeClass('d-flex');
        }
    })
}
function cerrar_modal_nuevo_mensaje() {
    window.parent.cerrar_modal_nuevo();
}
function expandir_frame() {
    window.parent.expandar_modal();
    $('.fa-expand-alt').closest('a').addClass('d-none');
    $('.fa-compress-alt').closest('a').removeClass('d-none');
}
function colapsar_frame() {
    if (window.parent.colapsar_modal != undefined)
        window.parent.colapsar_modal();

    $('.fa-compress-alt').closest('a').addClass('d-none');
    $('.fa-expand-alt').closest('a').removeClass('d-none');
}
function adjuntar() {
    $('#myInput').click();
}
function concatenar_id_adjuntos(_adjuntos) {
    let _url = "?id=";

    let id = _adjuntos.join(",");


    return _url + id;
}
function cargar_adjuntos() {

    let _html = '';

    _adjuntos_cargados.forEach(a => {
        _html += `<div class="adjunto-mensaje rounded border p-2 m-1">`;
        _html += `<a href="${window.location.href.toLowerCase().split('views')[0]}api/adjunto/descargar?id=${a.AjdId}">`;
        _html += `<img style="width:30px" src="${_get_icono(a.AjdExtension)}" />`;;
        _html += `${a.AdjNombre}${a.AjdExtension}</a>`

        _html += `<button type="button" class="close" aria-label="Close" onclick="eliminar_adjunto(${a.AjdId},this)">`;
        _html += '<span aria-hidden="true">&times;</span>';
        _html += '</button></div>';
    });
    document.getElementById('DivAdjunto').innerHTML = _html;
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
function guardar_mensaje() {

    let data = armar_objeto_mensaje();
    if (validar_datos(data)) {
        consultarAPI('Mensajes/borrador', 'POST', (response) => {
            window.parent.parent.mostrar_mensajes('', 'Mensaje guardado correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
                cerrar_modal_nuevo_mensaje();
            });
        }, data);
    }
}
function ddlCategorias(_this) {
    let selected = $(_this).find('option:selected').val();

    let _categoria = _Categorias.find(x => { return x.CatId == selected });
    if (_categoria != null && _categoria.CarHoraPermitida) {
        $('#divFechaHora').removeClass('d-none').addClass('d-flex')
    } else {
        if (!$('#divFechaHora').hasClass('d-none')) {
            $('#divFechaHora').addClass('d-none').removeClass('d-flex');
        }

    }
}
(function () {
    inicio();
})();
async function inicio() {
    colapsar_frame();
    $('#DivResultados').css('display', 'none');
    $('#datetimepicker4').datetimepicker({
        format: 'd/m/Y H:i',        
        minDate: '0',
    });
    let id = Get_query_string('id');

    if (id != undefined) {
        $('#bodymensaje').css('display', 'none');
        await consultar_categoria();
        consultar_mensaje(id);
    } else {
        $('.ql-container').addClass('editor-height');
        consultar_categoria();
    }
    _sesion = obtener_session();
}

//.ql-container