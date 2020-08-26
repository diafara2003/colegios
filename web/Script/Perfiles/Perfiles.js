

var _data_termporada = [];
//window.parent.mostrar_mensajes('','<label><i class="fas fa-circle-notch fa-spin"></i> Cargando...</label>');
function eventos__data_usuarios_perfil() {
    $('[contenteditable="true"]').off('click');
    $('[contenteditable="true"]').focusin(function () {
        selectText(this);
    });
}
function consultar__data_usuarios_perfil() {
    consultarAPI('TipoPerfil', 'GET', function (response) {
        _data_termporada = response;
        renderizar__data_usuarios_perfil(response);

        eventos__data_usuarios_perfil();
    });
}
function renderizar__data_usuarios_perfil(source) {
    let _html = '';

    source.forEach(item => _html += renderizar_tr__data_usuarios_perfil(item));

    document.getElementById('tbl_data_usuarios_perfil').innerHTML = _html;
}
function renderizar_tr__data_usuarios_perfil(_item) {
    let _tr = '';
    _tr += '<tr>';
    _tr += '<th scope="row"><div id="UsuPerDescripcion_' + _item.UsuPerId + '" contenteditable="true" onblur="modificar__data_usuarios_perfil(' + _item.UsuPerId + ')">' + _item.UsuPerDescripcion + '</th>';
    _tr += '<td id="UsuPerEstado_' + _item.UsuPerId + '" >';
    if (_item.UsuEmpId != null) {
        _tr += '<div class="custom-control custom-switch">';
        _tr += '<input type="checkbox" class="custom-control-input" onclick="modificar__data_usuarios_perfil(' + _item.UsuPerId + ')" id="customSwitch_' + _item.UsuPerId + '"  ' + (_item.UsuPerEstado ? 'checked' : '') + '>';
        _tr += '<label class="custom-control-label" for="customSwitch_' + _item.UsuPerId + '"></label>';
    }

    _tr += '</div>';
    _tr += '</td>';
    if (_item.UsuEmpId != null)
        _tr += '<td class="text-center"><button onclick="eliminar__data_usuarios_perfil(this,' + _item.UsuPerId + ')" class="btn-icono" data - toggle="tooltip" data - placement="top" title = "" data - original - title="Eliminar" > <i class="fas fa-trash"></i></button ></td > ';
    else
        _tr += '<td></td>';

    _tr += '</tr>';

    return _tr;
}
function modificar__data_usuarios_perfil(id) {
    let data_changed = obtener_datos(id);
    consultarAPI('TipoPerfil', 'PUT', function (response) {
        if (response.codigo < 0) {
            window.parent.mostrar_mensajes('', response.respuesta, 'error', true, false, false, 'Aceptar', '', '', '', () => {
                renderizar_datos_pagina(_data_termporada);
            });
        } else {
            let _index = _data_termporada.findIndex(c => c.TempId == data_changed.TempId);
            _data_termporada[_index] = data_changed;
        }
    }, data_changed);
}
function agregar__data_usuarios_perfil() {
    let nueva_data = obtener_datos(-1);

    if (nueva_data.TempAno != '') {
        consultarAPI('TipoPerfil', 'POST', function (response) {
            renderizar_datos_pagina(response);

        }, nueva_data);
    }

}
function renderizar_datos_pagina(response) {
    _data_termporada = response;
    let nuevo_tr = renderizar__data_usuarios_perfil(response);

    $('#tbl_data_usuarios_perfil').append(nuevo_tr);
    limpiar_registro__data_usuarios_perfil(-1);
    $('#UsuPerDescripcion_-1').focus();
    eventos__data_usuarios_perfil();
}
function eliminar__data_usuarios_perfil(_this, _posicion) {
    let data_changed = obtener_datos(-1)
    consultarAPI('TipoPerfil/' + _posicion, 'DELETE', function (response) {
        if (response.codigo < 0) {
            window.parent.mostrar_mensajes('', response.respuesta, 'error', true, false, false, 'Aceptar', '', '', '', () => {


            });
        } else {
            let _index = _data_termporada.findIndex(c => c.TempId == data_changed.TempId);
            _data_termporada.splice(_index, 1);
            $(_this).closest('tr').remove();
        }
    }, data_changed);
}
function obtener_datos(posicion) {

    var _data = { UsuPerId: 0, UsuPerDescripcion: '', UsuPerEstado: 1, UsuEmpId: obtener_session().empresa };

    if (document.getElementById('UsuPerDescripcion_' + posicion).tagName.toLowerCase() == 'div') {
        _data.UsuPerDescripcion = document.getElementById('UsuPerDescripcion_' + posicion).textContent;
    } else {
        _data.UsuPerDescripcion = document.getElementById('UsuPerDescripcion_' + posicion).value;
    }

    if (posicion != -1) {
        _data.UsuPerId = posicion;
        _data.UsuPerEstado = $('#customSwitch_' + posicion).is(':checked') ? 1 : 0;
    }

    return _data;
}
function limpiar_registro__data_usuarios_perfil(posicion) {
    document.getElementById('UsuPerDescripcion_' + posicion).value = "";

}
function buscar_nombre_perfil(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _data_termporada;
    }
    else {
        filtered = _data_termporada.filter(x => x.UsuPerDescripcion.toString().toLowerCase().includes(_text));
    }
    renderizar__data_usuarios_perfil(filtered);
}
consultar__data_usuarios_perfil();