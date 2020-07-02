

var _data_grados = [];

function eventos_grados() {
    $('[contenteditable="true"]').off('click');
    $('[contenteditable="true"]').focusin(function () {
        selectText(this);
    });
}
function consultar_grados() {
    consultarAPI('Grados', 'GET', function (response) {
        _data_grados = response;
        renderizar_grados(response);

        eventos_grados();
    });
}
function renderizar_grados(source) {
    let _html = '';

    source.forEach(item => _html += renderizar_tr_grados(item));

    document.getElementById('tblgrados').innerHTML = _html;
}
function renderizar_tr_grados(_item) {
    let _tr = '';
    _tr += '<tr>';
    _tr += '<th scope="row"><div id="GraCodigo_' + _item.GraId + '" contenteditable="true" onblur="modificar_grados(' + _item.GraId + ')">' + _item.GraCodigo + '</th>';
    _tr += '<td scope="row"><div id="GraDescripcion_' + _item.GraId + '" contenteditable="true" onblur="modificar_grados(' + _item.GraId + ')">' + _item.GraDescripcion + '</td>';
    _tr += '<td class="text-center"><button onclick="eliminar_grados(this,' + _item.GraId + ')" class="btn-icono" data-toggle="tooltip" data-placement="top" title="" data-original-title="Eliminar"><i class="fas fa-trash"></i></button></td>';
    _tr += '</tr>';

    return _tr;
}
function modificar_grados(id) {
    let data_changed = obtener_datos_grado(id);
    consultarAPI('Grados', 'PUT', function (response) {
        let _index = _data_grados.findIndex(c => c.GraId == data_changed.GraId);
        _data_grados[_index] = data_changed;

    }, data_changed);
}
function agregar_grados() {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');

    let nueva_data = obtener_datos_grado(-1);

    if (nueva_data.TempAno != '') {
        consultarAPI('grados', 'POST', function (response) {
            _data_grados.push(response);
            let nuevo_tr = renderizar_tr_grados(response);

            $('#tblgrados').append(nuevo_tr);
            limpiar_registro_grados(-1);
            $('#GraCodigo_-1').focus();
            eventos_grados();
            window.parent.cerrar_mensaje();
        }, nueva_data);
    }

}
function eliminar_grados(_this, _posicion) {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');

    let data_changed = obtener_datos_grado(-1)
    consultarAPI('Grados/' + _posicion, 'DELETE', function (response) {
        let _index = _data_grados.findIndex(c => c.GraId == data_changed.GraId);
        _data_grados.splice(_index, 1);
        $(_this).closest('tr').remove();
        window.parent.cerrar_mensaje();
    }, data_changed);
}
function obtener_datos_grado(posicion) {

    var _data = { GraId: 0, GraCodigo: '', GraDescripcion: 1, GraEmpId: 1, GraOrden: 0 };

    if (document.getElementById('GraCodigo_' + posicion).tagName.toLowerCase() == 'div') {
        _data.GraCodigo = document.getElementById('GraCodigo_' + posicion).textContent;
    } else {
        _data.GraCodigo = document.getElementById('GraCodigo_' + posicion).value;
    }

    if (document.getElementById('GraDescripcion_' + posicion).tagName.toLowerCase() == 'div') {
        _data.GraDescripcion = document.getElementById('GraDescripcion_' + posicion).textContent;
    } else {
        _data.GraDescripcion = document.getElementById('GraDescripcion_' + posicion).value;
    }

    if (posicion != -1) {
        _data.GraId = posicion;
    }

    _data.GraEmpId = obtener_session().empresa;
    return _data;
}
function limpiar_registro_grados(posicion) {
    document.getElementById('GraCodigo_' + posicion).value = "";
    document.getElementById('GraDescripcion_' + posicion).value = "";

}
function buscar_grados(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _data_grados;
    }
    else {
        filtered = _data_grados.filter(x =>
            x.GraCodigo.toString().toLowerCase().includes(_text)
            || x.GraDescripcion.toString().toLowerCase().includes(_text));
    }
    renderizar_grados(filtered);
}
function calcular_height_tblDatosGrados() {
    let _window = $(window).height();

    document.getElementById('tblDatosGrados').style.height = "100px";
    document.getElementById('tblDatosGrados').style.overflow = "auto";
    ver_grados();
}
function ver_grados() {
    setTimeout(c => { fixed_table_scroll('tblDatosGrados'); }, 300);
}
consultar_grados();
$(window).resize(calcular_height_tblDatosGrados);
calcular_height_tblDatosGrados();
