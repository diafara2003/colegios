let _sesion = {};//39;
let _data_source_ac = [], destinatarios = [], _sent_to = '';
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
    _html += '<div class="desti-nombre bg-estudiante" aria-hidden="true">';
    _html += `<span>${iniciales(persona.PerApellidos, persona.PerNombres)}</span>`;
    _html += '</div></div>';
    _html += `<div style="display:block"><span class="wellItemText-212">${persona.PerNombres} ${persona.PerApellidos}</span>`;
    _html += `<small>${persona.CurDescripcion}</small></div>`;
    if (_id_deleted)
        _html += `<button style="margin-top:-3px" type="button" onclick="eliminar_persona_selected(this,${persona.PerId})" class="btn-icono"><i class="fas fa-times"></i></button>`;
    _html += '</span>';
    _html += '</div>';

    return _html;
}
function set_sent_to() {
    let _data = [];

    destinatarios.forEach(_item => _data.push({ tipo: _item.tipo, id: _item.PerId, ocupacion: _item.CurDescripcion, nombre: _item.PerNombres, apellido: _item.PerApellidos }));

    return JSON.stringify(_data);
}
function eliminar_persona_selected(_this, id) {
    let _index = destinatarios.findIndex(p => p == id);
    destinatarios.splice(_index, 1);
    $(_this).closest('.desti-seleccionado').remove();
}
function enviar_mensaje() {
    let data = {};
    let mensaje = obtener_datos();
    data.destinatarios = obtener_destinatarios();
    data.mensaje = mensaje;
    data.adjuntos = obtener_adjuntos_al_mensaje();
    if (validar_datos(mensaje)) {
        consultarAPI('Mensajes', 'POST', (response) => {
            window.parent.parent.mostrar_mensajes('', 'Mensaje enviado correctamente', 'success', true, false, false, 'Aceptar', '', '', '', () => {
                localStorage.removeItem("adjuntos-mensajes");
                descartar();
            });
        }, data, (error) => {
            alert('mal');
        });
    }
}
function obtener_adjuntos_al_mensaje() {
    let _result = null;
    let _data = localStorage.getItem("adjuntos-mensajes");

    if (_data != '' && _data != undefined) {
        let _adjuntos = JSON.parse(localStorage.getItem("adjuntos-mensajes"));
        _result = [];

        _adjuntos.forEach(c => _result.push(c));

    }
    return _result;
}
function obtener_destinatarios() {
    return destinatarios.map(_item => { return { id: _item.PerId, tipo: _item.tipo } });
}
function obtener_datos() {
    var myobject = {
        MenId: 0, MenEmpId: _sesion.empresa, MenUsuario: _sesion.idusuario, MenClase: 1, MenTipoMsn: 'E', MenAsunto: '',
        MenMensaje: '', MenReplicaIdMsn: 0, MenOkRecibido: 0, MenSendTo: '', MenBloquearRespuesta: 0, MenCategoriaId: 0
    };

    myobject.MenMensaje = quill.root.innerHTML;
    myobject.MenAsunto = document.getElementById('MenAsunto').textContent;
    myobject.MenOkRecibido = $('#MenOkRecibido').is(':checked') ? 1 : 0;
    myobject.MenBloquearRespuesta = $('#MenOkRecibido').is(':checked') ? 1 : 0;
    myobject.MenSendTo = set_sent_to();
    myobject.MenCategoriaId = $('#ddlCategoria').find('option:selected').val();

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
function consultar_mensaje(id) {
    consultarAPI(`mensajes?id=${id}&bandeja=1`, 'GET', response => {
        // read_only();
        cargar_mensaje(response);
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


    let sent_to = JSON.parse(mensaje.MenSendTo);

    sent_to.forEach(_item => {
        let _persona = {};
        //_persona = _item;
        _persona.PerApellidos = _item.nombre;
        _persona.PerNombres = _item.apellido;
        _persona.PerId = _item.id;
        _persona.CurDescripcion = _item.ocupacion;

        $('#DivBusqueda').before(renderizar_html_seleccionado(_persona, false))
    });


}
function renderizar_categorias(_response) {
    let _html = '<option value="-1">Seleccione una categoria para el mensaje</option>';

    _response.forEach(c => {

        _html += `<option style="color:${c.CatColor}" value="${c.CatId}">${c.CatDescripcion}</option>`;
    });

    document.getElementById('ddlCategoria').innerHTML = _html;
}
function consultar_categoria() {

    consultarAPI('Categorias', 'GET', response => {

        if (response.length > 0) {
            renderizar_categorias(response);
            $('#DivCategoria').removeClass('d-none');
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
    window.parent.colapsar_modal();
    $('.fa-compress-alt').closest('a').addClass('d-none');
    $('.fa-expand-alt').closest('a').removeClass('d-none');
}
function adjuntar() {
    $('#modalAdjuntos').empty();
    let _adjuntos = localStorage.getItem("adjuntos-mensajes");
    let _URI = "../Adjuntos/Adjuntos.html";
    if (_adjuntos != null && _adjuntos != undefined && _adjuntos != '') {
        _URI += concatenar_id_adjuntos(JSON.parse(_adjuntos))
    }
    
    $('#modalAdjuntos').append('<iframe frameborder="0" src="' + _URI + '" style="width:100%;height:100%"></iframe>');
    $('#demo').modal('show');
}
function concatenar_id_adjuntos(_adjuntos) {
    let _url = "?id=";

    let id = _adjuntos.join(",");

    
    return _url + id;
}
(function () {
    colapsar_frame();
    $('#DivResultados').css('display', 'none');

    let id = Get_query_string('id');

    if (id != undefined) {
        $('#bodymensaje').css('display', 'none');
        consultar_mensaje(id);
    } else {
        $('.ql-container').addClass('editor-height');
        consultar_categoria();
    }
    _sesion = obtener_session();
})();

//.ql-container