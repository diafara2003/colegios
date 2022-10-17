﻿const readonly = Get_query_string('readonly');

const idEstudiante = Get_query_string('id');
async function consultardocumentos() {
    let id = Get_query_string('id');

    if (id == undefined || id == null)
        id = obtener_usuario_sesion().PerId;

    renderizar_documentos(await consultarAPI(`documentoscolegio/estudiante?idestudiante=${id}`, 'GET'));

}
function renderizar_documentos(source) {
    let html = ''
    source.forEach(c => html += adjuntoHTML(c));
    document.getElementById('CardAdjunto').innerHTML = html;

}
function adjuntoHTML(data) {
    return `  <div class="col-lg-3 col-md-4 col-sm-12 doc-render" data-id="${data.id}" data-nombre="${data.nombreDocReq}">
                        <div class="card">
                            <div class="file">
                                    ${data.id == 0 ?
            (readonly == "true" ? '' : `<div class="hover">${htmlUpload(data)}</div>`)
            : (readonly == null) ? (`<div class="hover">${htmlUpload(data)}${htmldownload(data)}</div>`) : ` <div class="hover">${htmldownload(data)}</div>`}
                                    <div class="icon">
                                        <i class="fa fa-file text-info"></i>
                                    </div>
                                    <div class="file-name">
                                        <p class="m-b-5 text-muted">${data.nombreDocReq}</p>
                                        <small>
                                            ${data.id == 0
            ? `<span class="date text-warning"><strong>Pendiente</strong></span>`
            : `<span class="date text-muted">${data.nombreAdj}.${data.extension}</span>`}                                            
                                        </small>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>`;
}
function htmlUpload(data) {
    return `<button type="button" title="subir archivo ${data.nombreDocReq}" class="btn btn-icon btn-info" onclick="subirdocumento(${data.idDocReq})">
               <i class="fa fa-upload"></i>
           </button>`;
}
function htmldownload(data) {
    return `<button title="descargar archivo ${data.nombreDocReq}" type="button" class="btn btn-icon btn-info" onclick="descargardocumento(${data.id})">
                <i class="fa fa-download"></i>
           </button>`;
}
function descargardocumento(id) {
    let _url = window.location.href.toLowerCase().split('views')[0];
    $('#adescarga').attr('href', `${_url}api/adjunto/descargar?id=${id}`)
    $('#adescarga').attr('download', `sss`)
    document.getElementById('adescarga').click();
}
function buscarKeyPress() {
    const value = document.getElementById('txtdocumento').value.toLowerCase();

    if (value == '') $('.doc-render').removeClass('d-none')
    else {
        $('.doc-render').each(function () {
            const nombre = $(this).attr('data-nombre').toLowerCase();


            if (nombre.includes(value)) $(this).removeClass('d-none');
            else $(this).addClass('d-none');

        })
    }
}
function verFaltantes() {
    const value = $('#customSwitch');
    debugger;
    if (value.is(':checked')) {
        $(`.doc-render`).each(function () {
            const id = parseInt($(this).attr('data-id'));

            if (id > 0) $(this).addClass('d-none');

        })
    } else {
        $(`.doc-render`).each(function () {
            const id = $(this).attr('data-id');

            if (id > 0) $(this).removeClass('d-none');

        })
    }
}
function subirAdjunto(nameinputFile) {

    let _url = window.location.href.toLowerCase().split('views')[0];

    let formData = new FormData();
    let file = $(`#${nameinputFile}`)[0];
    formData.append('file', file.files[0]);
    formData.append('idestudiante', idEstudiante);
    formData.append('iddocreq', $(`#${nameinputFile}`).attr('data-req'));

    $.ajax({
        url: `${_url}api/documentoscolegio/estudiante/subir`,
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('sesion')}`,
            'Accept': 'application/json',
        },
        data: formData,
        contentType: false,
        processData: false,
        success: function (_response) {
            window.location.reload();
        },
        error: function () {
            alert("Faild please try upload again");
        }
    });
}
function subirdocumento(id) {

    $('#subirAdjunto').attr('data-req', id);
    $('#subirAdjunto').click();
}
function regresar() {
    if (window.parent.cerrarFrame)
        window.parent.cerrarFrame();
}
async function consultarInfoEstudiante() {
    renderizarEstudiante(await consultarAPI(`Estudiantes/acudiente?id=${idEstudiante}`, 'GET'));

}
function renderizarEstudiante(est) {
    document.getElementById('nombreEstudiante').textContent = `${est.estudiante.EstNombres} ${est.estudiante.EstApellidos}`
    document.getElementById('nombreGradoEstudiante').textContent = `${est.grupo.nombre}`
}

consultardocumentos();
consultarInfoEstudiante();