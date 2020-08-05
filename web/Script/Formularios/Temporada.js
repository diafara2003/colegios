

var _data_termporada = [];
//window.parent.mostrar_mensajes('','<label><i class="fas fa-circle-notch fa-spin"></i> Cargando...</label>');
function eventos_temporada() {
    $('[contenteditable="true"]').off('click');
    $('[contenteditable="true"]').focusin(function () {
        selectText(this);
    });
}
function consultar_temporadas() {
    consultarAPI('Temporada', 'GET', function (response) {
        _data_termporada = response;
        renderizar_temporada(response);

        eventos_temporada();
    });
}
function renderizar_temporada(source) {
    let _html = '';

    source.forEach(item => _html += renderizar_tr_temporada(item));

    document.getElementById('tbltemporada').innerHTML = _html;
}
function renderizar_tr_temporada(_item) {
    let _tr = '';
    _tr += '<tr>';
    _tr += '<th scope="row"><div id="TempAno_' + _item.TempId + '" contenteditable="true" onblur="modificar_temporada(' + _item.TempId + ')">' + _item.TempAno + '</th>';
    _tr += '<td id="TempEstado_' + _item.TempId + '" >';
    _tr += '<div class="custom-control custom-switch">';
    _tr += '<input type="checkbox" class="custom-control-input" onclick="modificar_temporada(' + _item.TempId + ')" id="customSwitch_' + _item.TempId + '"  ' + (_item.TempEstado ? 'checked' : '') + '>';
    _tr += '<label class="custom-control-label" for="customSwitch_' + _item.TempId + '"></label>';
    _tr += '</div>';
    _tr += '</td>';
    _tr += '<td class="text-center"><button onclick="eliminar_temporada(this,' + _item.TempId + ')" class="btn-icono" data-toggle="tooltip" data-placement="top" title="" data-original-title="Eliminar"><i class="fas fa-trash"></i></button></td>';
    _tr += '</tr>';

    return _tr;
}
function modificar_temporada(id) {
    let data_changed = obtener_datos(id);
    consultarAPI('Temporada', 'PUT', function (response) {
        let _index = _data_termporada.findIndex(c => c.TempId == data_changed.TempId);
        _data_termporada[_index] = data_changed;

    }, data_changed);
}
function agregar_temporada() {
    let nueva_data = obtener_datos(-1);

    if (nueva_data.TempAno != '') {
        consultarAPI('Temporada', 'POST', function (response) {
            _data_termporada.push(response);
            let nuevo_tr = renderizar_tr_temporada(response);

            $('#tbltemporada').append(nuevo_tr);
            limpiar_registro_temporada(-1);
            $('#TempAno_-1').focus();
            eventos_temporada();

        }, nueva_data);
    }

}
function eliminar_temporada(_this, _posicion) {
    let data_changed = obtener_datos(-1)
    consultarAPI('Temporada/' + _posicion, 'DELETE', function (response) {
        if (response.codigo < 0) {
            window.parent.mostrar_mensajes('', response.respuesta, 'error', true, false, false, 'Aceptar');
        } else {
            let _index = _data_termporada.findIndex(c => c.TempId == data_changed.TempId);
            _data_termporada.splice(_index, 1);
            $(_this).closest('tr').remove();
        }
    }, data_changed);
}
function obtener_datos(posicion) {

    var _data = { TempId: 0, TempAno: '', TempEstado: 1 };

    if (document.getElementById('TempAno_' + posicion).tagName.toLowerCase() == 'div') {
        _data.TempAno = document.getElementById('TempAno_' + posicion).textContent;
    } else {
        _data.TempAno = document.getElementById('TempAno_' + posicion).value;
    }

    if (posicion != -1) {
        _data.TempId = posicion;
        _data.TempEstado = $('#customSwitch_' + posicion).is(':checked') ? 1 : 0;
    }

    return _data;
}
function limpiar_registro_temporada(posicion) {
    document.getElementById('TempAno_' + posicion).value = "";

}
function buscar_temporada(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _data_termporada;
    }
    else {
        filtered = _data_termporada.filter(x => x.TempAno.toString().toLowerCase().includes(_text) );
    }
    renderizar_temporada(filtered);
}
consultar_temporadas();