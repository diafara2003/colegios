

let _data_cursos = [];

function eventos_cursos() {
    $('[contenteditable="true"]').off('click');
    $('[contenteditable="true"]').click(function () {
        selectText(this);
    });
}
function consultar_cursos() {
    consultarAPI('cursos', 'GET', function (response) {
        _data_cursos = response;
        renderizar_cursos(response);

        eventos_cursos();
    });
}
function renderizar_cursos(source) {
    let _html = '';

    source.forEach(item => _html += renderizar_tr_cursos(item));

    document.getElementById('tblcursos').innerHTML = _html;
}
function renderizar_tr_cursos(_item) {
    let _tr = '';
    _tr += '<tr>';
    _tr += '<th scope="row"><div id="CurTemporada_' + _item.CurId + '" contenteditable="true" onblur="modificar_cursos(' + _item.CurId + ')">' + _item.NombreTemporada + '</th>';
    _tr += '<td scope="row"><div id="CurCodigo_' + _item.CurId + '" contenteditable="true" onblur="modificar_cursos(' + _item.CurId + ')">' + _item.CurCodigo + '</td>';
    _tr += '<td scope="row"><div id="CurDescripcion_' + _item.CurId + '" contenteditable="true" onblur="modificar_cursos(' + _item.CurId + ')">' + _item.CurDescripcion + '</td>';
    _tr += '<td scope="row"><div id="CurTutor_' + _item.CurId + '" contenteditable="true" onblur="modificar_cursos(' + _item.CurId + ')">' + _item.CurTutor + '</td>';
    _tr += '<td class="text-center"><button onclick="eliminar_cursos(this,' + _item.CurId + ')" class="btn-icono" data-toggle="tooltip" data-placement="top" title="" data-original-title="Eliminar"><i class="fas fa-trash"></i></button></td>';
    _tr += '</tr>';

    return _tr;
}
function modificar_cursos(id) {
    let data_changed = obtener_datos_curso(id);
    consultarAPI('cursos', 'PUT', function (response) {
        let _index = _data_cursos.findIndex(c => c.CurId == data_changed.CurId);
        _data_cursos[_index] = data_changed;

    }, data_changed);
}
function agregar_curso() {
    let nueva_data = obtener_datos_curso(-1);

    if (nueva_data.TempAno != '') {
        consultarAPI('cursos', 'POST', function (response) {
            _data_cursos.push(response);
            let nuevo_tr = renderizar_tr_cursos(response);

            $('#tblcursos').append(nuevo_tr);
            limpiar_registro_cursos(-1);
            $('#CurCodigo_-1').focus();
            eventos_cursos();

        }, nueva_data);
    }

}
function eliminar_cursos(_this, _posicion) {
    let data_changed = obtener_datos_curso(-1)
    consultarAPI('cursos/' + _posicion, 'DELETE', function (response) {
        let _index = _data_cursos.findIndex(c => c.CurId == data_changed.CurId);
        _data_cursos.splice(_index, 1);
        $(_this).closest('tr').remove();

    }, data_changed);
}
function obtener_datos_curso(posicion) {

    var _data = { CurId: 0, CurCodigo: '', CurDescripcion: 1, CurEmpId: 1, CurTutor: 1, CurTemporada: 1 };

    if (document.getElementById('CurCodigo_' + posicion).tagName.toLowerCase() == 'div') {
        _data.CurCodigo = document.getElementById('CurCodigo_' + posicion).textContent;
    } else {
        _data.CurCodigo = document.getElementById('CurCodigo_' + posicion).value;
    }

    if (document.getElementById('CurDescripcion_' + posicion).tagName.toLowerCase() == 'div') {
        _data.CurDescripcion = document.getElementById('CurDescripcion_' + posicion).textContent;
    } else {
        _data.CurDescripcion = document.getElementById('CurDescripcion_' + posicion).value;
    }
    if (document.getElementById('CurTutor_' + posicion).tagName.toLowerCase() == 'div') {
        _data.CurTutor = document.getElementById('CurTutor_' + posicion).textContent;
    } else {
        _data.CurTutor = document.getElementById('CurTutor_' + posicion).value;
    }

    if (document.getElementById('CurTemporada_' + posicion).tagName.toLowerCase() == 'select') {
        _data.CurTemporada = $('#CurTemporada_' + posicion).find('option:selected').val();
    } else {
        _data.CurTemporada = document.getElementById('CurTemporada_' + posicion).value;
    }

    if (posicion != -1) {
        _data.CurId = posicion;
    }

    return _data;
}
function limpiar_registro_cursos(posicion) {
    document.getElementById('CurCodigo_' + posicion).value = "";
    document.getElementById('CurDescripcion_' + posicion).value = "";
    document.getElementById('CurTutor_' + posicion).value = "";
    document.getElementById('CurDescripcion_' + posicion).value = "";

}
function renderizar_ddl_temporada() {
    $('#CurTemporada_-1').empty();

    $('#CurTemporada_-1').append('<option selected>Seleccione...</option>');
    _data_termporada
        .filter(f => { return f.TempEstado == 1 })
        .forEach(t => {
            $('#CurTemporada_-1').append('<option value="' + t.TempId + '">' + t.TempAno + '</option>');
        })
}
function buscar_cursos(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = _data_cursos;
    }
    else {
        filtered = _data_cursos.filter(x =>
            x.NombreTemporada.toString().toLowerCase().indexOf(_text) > -1
            || x.CurCodigo.toString().toLowerCase().indexOf(_text) > -1
            || x.CurDescripcion.toString().toLowerCase().indexOf(_text) > -1
        );
    }
    renderizar_cursos(filtered);
}
function ver_cursos() {
    renderizar_ddl_temporada();
}
consultar_cursos();