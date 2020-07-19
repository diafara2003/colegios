
/* show file value after file select */
document.querySelector('.custom-file-input').addEventListener('change', function (e) {
    var fileName = document.getElementById("myInput").files[0].name;
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = `Nombre: ${fileName}`;
})

let _readonly = false, _adjuntos_cargados = [];


function validar_visual() {
    if (Get_query_string('readonly') != undefined) {
        $('DivAdjuntar').remove();
        _readonly = true;
    }
}
function descargar_archivo(id) {

    var Init = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${localStorage.getItem('sesion')}`
        },
        //mode: 'cors',
        //cache: 'default'
    };


    Init.headers.Authorization = `Bearer ${localStorage.getItem('sesion')}`

    let _url = window.location.href.toLowerCase().split('views')[0]
    fetch(`${_url}api/adjunto/descargar?id=${id}`, Init)
        .then(res => {

        })
        .catch(error => {
            if (!error)
                error(error);
        });

}
function cargar_adjuntos() {
    consultarAPI('Adjuntos' + armar_url(), 'GET', (_response) => {
        let _html = '';
        _adjuntos_cargados = _response;
        _response.forEach(c => {

            return _html += renderizar_adjunto(c);
        });

        localStorage.getItem("adjuntos-mensajes", JSON.stringify(_response.map(c => c.AjdId)));

        document.getElementById('DivAdjunto').innerHTML = _html;
    });
}
function armar_url() {
    let _url = '';
    let _usuario = obtener_session().idusuario, _adjunto = 0;

    if (Get_query_string('id') != null) {
        _adjunto = Get_query_string('id').split(',');
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
    _html += `<a href="${window.location.href.toLowerCase().split('views')[0]}api/adjunto/descargar?id=${_adjunto.AjdId}" class="card-title"><span> ${_adjunto.AdjNombre}</span></a>`;
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

                _adjuntos_cargados.push(_response);

                localStorage.setItem("adjuntos-mensajes", JSON.stringify(_adjuntos_cargados.map(c => c.AjdId)));

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
        let _index = _adjuntos_cargados.findIndex(c => c.AjdId == _id);
        _adjuntos_cargados.splice(_index, 1);

        localStorage.setItem("adjuntos-mensajes", JSON.stringify(_adjuntos_cargados.map(c => c.AjdId)));
    }, _data);
}

(function () {
    _adjuntos_cargados = [];
    //localStorage.removeItem("adjuntos-mensajes");
    validar_visual();

    if (Get_query_string('id') != null)
        cargar_adjuntos();
})();