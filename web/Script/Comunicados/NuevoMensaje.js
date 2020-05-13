let id_usuario = 39;
let _data_source_ac = [], destinatarios = [], _sent_to = '';
let iniciales = (nombre, apellidos) => {
    //apellidos = apellidos == "" ? nombre.substr(0, 3) : apellidos;
    return `${nombre.substr(0, 1).toUpperCase()}${apellidos.substr(0, 1).toUpperCase()}`;
}
var quill = new Quill('#editor', {
    placeholder: 'Mensaje a enviar',
    theme: 'snow'
});
//var _x = '<p><strong>Gerard Arthur Way</strong></p>';
//$('.ql-editor')[0].innerHTML = _x;

let tipos = [
    { tipo: 'P', nombre: 'Profesores', color: 'color-profesor', bg: 'bg-profesor' },
    { tipo: 'E', nombre: 'Estudiantes', color: 'color-estudiante', bg: 'bg-estudiante' },
    { tipo: 'E', nombre: 'Estudiantes', color: 'color-estudiante', bg: 'bg-estudiante' },
];

function descartar() {
    let _url = window.location.href.toLowerCase().split('comunicados')[0];

    window.location.href = _url + 'comunicados/bandejaentrada.html'
}
function buscar_personas(_this) {
    setTimeout(c => {
        let _value = _this.textContent;

        if (_value == "") {
            $('#DivResultados').empty();
            $('#DivResultados').css('display', 'none');
            return;
        }

        consultarAPI(`Persona/enviocorreo?idusuario=${id_usuario}&filter=${_value}`, 'GET', (response) => {
            $('#DivResultados').css('display', 'block');
            _data_source_ac = response;
            renderizar_resultados_ac(response);
        });

    }, 300);

}
function renderizar_resultados_ac(source) {


    let _tipo = tipos.find(c => c.tipo == source[0].tipo);

    let _html = '';

    _html += '<ul class="list-group list-group-flush ul-profesores">';
    _html += ` <li class="list-group-item encabezado-opcion-destinatario ${_tipo.color}">${_tipo.nombre}</li>`;
    source.forEach((item, i) => {
        _html += `<li class="list-group-item" onclick="renderizar_seleccionado(${i})">`;
        _html += `<div class="destinatario-imagen ${_tipo.bg}"> ${iniciales(item.PerApellidos, item.PerNombres)}</div>`;
        _html += '<div style="display:block">';
        _html += `<div class="nombre-destinatario">${item.PerApellidos} ${item.PerNombres}</div>`;
        _html += `<div class="text-muted">${item.CurDescripcion}</div>`;
        _html += '</div>';
        _html += '</li>';


    });
    _html += '</ul>';

    document.getElementById('DivResultados').innerHTML = _html;
}
function renderizar_seleccionado(_i) {
    let persona = _data_source_ac[_i];

    destinatarios.push(persona);
    set_sent_to(persona);

    let _html = '';
    _html += '<div class="desti-seleccionado">';
    _html += '<span class="desti-cuerpo">';
    _html += '<div class="imageArea">';
    _html += '<div class="desti-nombre bg-estudiante" aria-hidden="true">';
    _html += `<span>${iniciales(persona.PerApellidos, persona.PerNombres)}</span>`;
    _html += '</div></div>';
    _html += `<span class="wellItemText-212">${persona.PerNombres} ${persona.PerApellidos}</span>`;
    _html += `<button type="button" onclick="eliminar_persona_selected(this,${persona.PerId})" class="btn-icono"><i class="fas fa-times"></i></button>`;
    _html += '</span>';
    _html += '</div>';

    $('#DivBusqueda').before(_html);
    $('#DivBusqueda').text('');
    $('#DivBusqueda').focus();
    $('#DivResultados').empty();
    $('#DivResultados').css('display', 'none');
}
function set_sent_to() {
    let _data = [];

    destinatarios.forEach(_item => _data.push({ tipo: _item.tipo, id: _item.PerId }));

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
    if (validar_datos()) {
        consultarAPI('Mensajes', 'POST', (response) => {
            alert('bien');
        }, data, (error) => {
            alert('mal');
        });
    }
}
function obtener_destinatarios() {
    return destinatarios.map(_item => { return _item.PerId });
}
function obtener_datos() {
    var myobject = {
        MenId: 0, MenEmpId: 1, MenUsuario: 1, MenClase: 1, MenTipoMsn: 'E', MenAsunto: '',
        MenMensaje: '', MenReplicaIdMsn: 0, MenOkRecibido: 0, MenSendTo: '', MenBloquearRespuesta: 0
    };

    myobject.MenMensaje = quill.root.innerHTML;
    myobject.MenAsunto = document.getElementById('MenAsunto').textContent;
    myobject.MenOkRecibido = $('#MenOkRecibido').is(':checked') ? 1 : 0;
    myobject.MenBloquearRespuesta = $('#MenOkRecibido').is(':checked') ? 1 : 0;
    myobject.MenSendTo = set_sent_to();

    return myobject;
}
function validar_datos() {
    let _result = false;

    return _result;
}
(function () {
    $('#DivResultados').css('display', 'none');
})();