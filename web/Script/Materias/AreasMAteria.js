

var _data_area_materia = [];

function eventos_area_materia() {
    $('[contenteditable="true"]').off('click');
    $('[contenteditable="true"]').focusin(function () {
        selectText(this);
    });
}
function consultar_area_materia() {
    consultarAPI('materia/areasmaterias', 'GET', function (response) {
        _data_area_materia = response;
        renderizar_area_materia(response);

        eventos_area_materia();
    });
}
function renderizar_area_materia(source) {
    let _html = '';

    source.forEach(item => _html += renderizar_tr_area_materia(item));

    document.getElementById('tblAreaMateria').innerHTML = _html;
}
function renderizar_tr_area_materia(_item) {
    let _tr = '';
    _tr += '<tr>';
    _tr += '<th scope="row"><div id="ArMaCodigo_' + _item.ArMaId + '" contenteditable="true" onblur="modificar_area_materia(' + _item.ArMaId + ')">' + _item.ArMaCodigo + '</td>';
    _tr += '<td scope="row"><div id="ArMaDescripcion_' + _item.ArMaId + '" contenteditable="true" onblur="modificar_area_materia(' + _item.ArMaId + ')">' + _item.ArMaDescripcion + '</td>';
    _tr += '<td class="text-center"><button onclick="eliminar_area_materia(this,' + _item.ArMaId + ')" class="btn-icono" data-toggle="tooltip" data-placement="top" title="" data-original-title="Eliminar"><i class="fas fa-trash"></i></button></td>';
    _tr += '</tr>';

    return _tr;
}
function modificar_area_materia(id) {
    let data_changed = obtener_datos_area_materia(id);
    consultarAPI('materia/areasmaterias', 'PUT', function (response) {
        let _index = _data_area_materia.findIndex(c => c.ArMaId == data_changed.ArMaId);
        _data_area_materia[_index] = data_changed;

    }, data_changed);
}
function agregar_area_materia() {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
    let nueva_data = obtener_datos_area_materia(-1);

    if (nueva_data.TempAno != '') {
        consultarAPI('materia/areasmaterias', 'POST', function (response) {
            _data_area_materia.push(response);
            let nuevo_tr = renderizar_tr_area_materia(response);

            $('#tblAreaMateria').append(nuevo_tr);
            limpiar_registro_area_materia(-1);
            $('#ArMaCodigo_-1').focus();
            eventos_area_materia();
            window.parent.cerrar_mensaje();

        }, nueva_data);
    }

}
function eliminar_area_materia(_this, _posicion) {
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
    let data_changed = { ArMaId: _posicion };
    consultarAPI('materia/areasmaterias/eliminar?id=' + _posicion, 'GET', (response) => {
        if (response.codigo < 0) {
            window.parent.mostrar_mensajes('', response.respuesta, 'error', true, false, false, 'Aceptar');
        } else {
            let _index = _data_area_materia.findIndex(c => c.ArMaId == data_changed.ArMaId);
            _data_area_materia.splice(_index, 1);
            $(_this).closest('tr').remove();
            window.parent.cerrar_mensaje();
        }

    });
}
function obtener_datos_area_materia(posicion) {

    var _data = { ArMaId: 0, ArMaCodigo: '', ArMaDescripcion: 1 };

    if (document.getElementById('ArMaCodigo_' + posicion).tagName.toLowerCase() == 'div') {
        _data.ArMaCodigo = document.getElementById('ArMaCodigo_' + posicion).textContent;
    } else {
        _data.ArMaCodigo = document.getElementById('ArMaCodigo_' + posicion).value;
    }

    if (document.getElementById('ArMaDescripcion_' + posicion).tagName.toLowerCase() == 'div') {
        _data.ArMaDescripcion = document.getElementById('ArMaDescripcion_' + posicion).textContent;
    } else {
        _data.ArMaDescripcion = document.getElementById('ArMaDescripcion_' + posicion).value;
    }

    if (posicion != -1) {
        _data.ArMaId = posicion;
    }

    return _data;
}
function limpiar_registro_area_materia(posicion) {
    document.getElementById('ArMaCodigo_' + posicion).value = "";
    document.getElementById('ArMaDescripcion_' + posicion).value = "";

}
function buscar_area_materia(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _data_area_materia;
    }
    else {
        filtered = _data_area_materia.filter(x =>
            x.ArMaCodigo.toString().toLowerCase().includes(_text)
            || x.ArMaDescripcion.toString().toLowerCase().includes(_text));
    }
    renderizar_area_materia(filtered);
}
function calcular_height_tblDatosAreaMateria() {
    let _window = $(window).height();

    document.getElementById('tblDatosAreaMateria').style.height = "100px";
    document.getElementById('tblDatosAreaMateria').style.overflow = "auto";
    ver_area_materia();
}
function ver_area_materia() {
    setTimeout(c => { fixed_table_scroll('tblDatosAreaMateria'); }, 300);
}
consultar_area_materia();
$(window).resize(calcular_height_tblDatosAreaMateria);
calcular_height_tblDatosAreaMateria();
