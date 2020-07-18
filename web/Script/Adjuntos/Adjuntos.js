
/* show file value after file select */
document.querySelector('.custom-file-input').addEventListener('change', function (e) {
    var fileName = document.getElementById("myInput").files[0].name;
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = `Nombre: ${fileName}`;
})
var _Adjuntos_subidos = [];
let _readonly = false;
let _get_icono = (_extencion) => {
    let _icono = '';
    switch (_extencion.toLocaleLowerCase().replace('.', '')) {

        case 'doc':
        case 'docx':
            _icono = '../../Img/word.svg'; break;
        case 'xls':
        case 'xlsx':
            _icono = '../../Img/excel.svg'; break;
        case 'pdf': _icono = '../../Img/pdf.svg'; break;
        case '.zip':
        case '.rar': _icon = '../../Img/comprimido.svg'; break;
        default:
            _icono = '../../Img/imagen.svg'; break;
    }

    return _icono;
}

function validar_visual() {
    if (Get_query_string('readonly') != undefined) {
        $('DivAdjuntar').remove();
        _readonly = true;
    }
}
function cargar_adjuntos() {
    consultarAPI('Adjuntos' + armar_url(), 'GET', (_response) => {
        let _html = '';
        _response.forEach(c => {
            _Adjuntos_subidos.push(c.AjdId);
            return _html += renderizar_adjunto(c);
        });

        document.getElementById('DivAdjunto').innerHTML = _html;
    });
}
function armar_url() {
    let _url = '';
    let _usuario = obtener_session().idusuario, _adjunto = 0;

    if (Get_query_string('adjunto') != undefined) {
        _adjunto = Get_query_string('adjunto');
    }

    _url += '?usuario=' + _usuario;
    _url += '&adjunto=' + _adjunto;

    return _url;
}
function renderizar_adjunto(_adjunto) {
    let _html = '';

    _html += '<div class="card shadow-sm m-1 bg-light">';
    _html += '<div class="card-body">';
    if (!_readonly) {
        _html += `<button type="button" class="close" aria-label="Close" onclick="eliminar_adjunto(${_adjunto.AjdId},this)">`;
        _html += '<span aria-hidden="true">&times;</span>';
        _html += '</button>';
    }
    _html += `<img src="${_get_icono(_adjunto.AjdExtension)}" />`;
    _html += `<span class="card-title">${_adjunto.AdjNombre}</span>`;
    _html += '</div>';
    _html += '</div>';

    return _html;
}
function limpiar_texto() {
    document.getElementById('myInput').value = "";
}
function subirAdjunto() {
    if (document.getElementById('lblAdjunto').textContent != '') {

        let _url = window.location.href.toLowerCase().split('views')[0];

        var formData = new FormData();
        var file = $('#myInput')[0];
        formData.append('file', file.files[0]);
        $.ajax({
            url: `${_url}api/Adjuntos${armar_url()}`,
            type: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('sesion')}`,
                'Accept': 'application/json',
            },
            data: formData,
            contentType: false,
            processData: false,
            success: function (_response) {
                let _html = '';

                _Adjuntos_subidos = [];
                _Adjuntos_subidos.push(_response.AjdId);

                _html += renderizar_adjunto(_response);
                $('#DivAdjunto').append(_html);

            },
            error: function () {
                alert("Faild please try upload again");
            }
        });

    }
}
function eliminar_adjunto(_id, _this) {
    var _data = { id: _id };
    consultarAPI('adjunto/eliminar', 'POST', () => {
        $(_this).closest('.card').remove();
        let _index = _Adjuntos_subidos.findIndex(c => c == _id);
        _Adjuntos_subidos.splice(_index, 1);
    }, _data);
}

(function () {
    _Adjuntos_subidos = [];
    validar_visual();
    cargar_adjuntos();
})();