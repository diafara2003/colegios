

let _data_salones = [];

function eventos_salones() {
    $('[contenteditable="true"]').off('click');
    $('[contenteditable="true"]').focusin(function () {
        selectText(this);
    });
}
function consultar_salones() {
    consultarAPI('salones', 'GET', function (response) {
        _data_salones = response;
        renderizar_salones(response);

        eventos_salones();
    });
}
function renderizar_salones(source) {
    let _html = '';

    source.forEach(item => _html += renderizar_tr_salones(item));

    document.getElementById('tblsalones').innerHTML = _html;
}
function renderizar_tr_salones(_item) {
    let _tr = '';
    _tr += '<tr>';
    _tr += '<th scope="row"><div id="SalCodigo_' + _item.SalId + '" contenteditable="true" onblur="modificar_salones(' + _item.SalId + ')">' + _item.SalCodigo + '</th>';
    _tr += '<td scope="row"><div id="SalDescripcion_' + _item.SalId + '" contenteditable="true" onblur="modificar_salones(' + _item.SalId + ')">' + _item.SalDescripcion + '</td>';
    _tr += '<td class="text-center"><button onclick="eliminar_salones(this,' + _item.SalId + ')" class="btn-icono" data-toggle="tooltip" data-placement="top" title="" data-original-title="Eliminar"><i class="fas fa-trash"></i></button></td>';
    _tr += '</tr>';

    return _tr;
}
function modificar_salones(id) {
    let data_changed = obtener_datos_salon(id);
    consultarAPI('salones', 'PUT', function (response) {
        let _index = _data_salones.findIndex(c => c.SalId == data_changed.SalId);
        _data_salones[_index] = data_changed;

    }, data_changed);
}
function agregar_salon() {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');

    let nueva_data = obtener_datos_salon(-1);

    if (nueva_data.TempAno != '') {
        consultarAPI('salones', 'POST', function (response) {
            _data_salones.push(response);
            let nuevo_tr = renderizar_tr_salones(response);

            $('#tblsalones').append(nuevo_tr);
            limpiar_registro_salones(-1);
            $('#SalCodigo_-1').focus();
            eventos_salones();
            window.parent.cerrar_mensaje();
        }, nueva_data);
    }

}
function eliminar_salones(_this, _posicion) {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');

    let data_changed = obtener_datos_salon(-1)
    consultarAPI('salones/' + _posicion, 'DELETE', function (response) {
        let _index = _data_salones.findIndex(c => c.SalId == data_changed.SalId);
        _data_salones.splice(_index, 1);
        $(_this).closest('tr').remove();
        window.parent.cerrar_mensaje();
    }, data_changed);
}
function obtener_datos_salon(posicion) {

    var _data = { SalId: 0, SalCodigo: '', SalDescripcion: 1 };

    if (document.getElementById('SalCodigo_' + posicion).tagName.toLowerCase() == 'div') {
        _data.SalCodigo = document.getElementById('SalCodigo_' + posicion).textContent;
    } else {
        _data.SalCodigo = document.getElementById('SalCodigo_' + posicion).value;
    }

    if (document.getElementById('SalDescripcion_' + posicion).tagName.toLowerCase() == 'div') {
        _data.SalDescripcion = document.getElementById('SalDescripcion_' + posicion).textContent;
    } else {
        _data.SalDescripcion = document.getElementById('SalDescripcion_' + posicion).value;
    }

    if (posicion != -1) {
        _data.SalId = posicion;
    }

    return _data;
}
function limpiar_registro_salones(posicion) {
    document.getElementById('SalCodigo_' + posicion).value = "";
    document.getElementById('SalDescripcion_' + posicion).value = "";

}
function buscar_salones(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _data_salones;
    }
    else {
        filtered = _data_salones.filter(
            x => x.SalCodigo.toString().toLowerCase().indexOf(_text) > -1
                || x.SalDescripcion.toString().toLowerCase().indexOf(_text) > -1
        );
    }
    renderizar_salones(filtered);
}
consultar_salones();