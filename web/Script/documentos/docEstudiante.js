const readonly = Get_query_string('readonly');
let files = [];
const idEstudiante = Get_query_string('id');
async function consultardocumentos() {
    let id = Get_query_string('id');

    if (id == undefined || id == null)
        id = obtener_usuario_sesion().PerId;

    renderizar_documentos(await consultarAPI(`documentoscolegio/estudiante?idestudiante=${id}`, 'GET'));

}
function renderizar_documentos(source) {
    files = source;
    let html = ''
    source.forEach(c => html += adjuntoHTML(c));
    document.getElementById('CardAdjunto').innerHTML = html;
    const docs = source.filter(c => c.id > 0).length;
    document.getElementById('docPendientes').textContent = `${docs}/${source.length}`

}
function adjuntoHTML(data) {
    return `  <div class="col-lg-3 col-md-4 col-sm-12 doc-render" data-id="${data.id}" data-nombre="${data.nombreDocReq}">
                        <div class="card">
                            <div class="file">
                                    ${data.id == 0 ?
            (readonly == "true" ? '' : `<div class="hover">${htmlUpload(data)}</div>`)
            : (readonly == null)
                ? (`<div class="hover">${htmlUpload(data)}${htmldownload(data)}</div>`)
                : ` <div class="hover">${htmlvisor(data)}${htmldownload(data)}</div>`}
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
function htmlvisor(data) {
    return `<button title="visializar archivo ${data.nombreDocReq}" type="button" class="btn btn-icon btn-info" onclick="visualizarArvhivo(${data.id})">
                <i class="fa fa-folder-open"></i>
           </button>`;
}
function visualizarArvhivo() {
    renderizarAdjuntosModal();
    var myModal = new bootstrap.Modal(document.getElementById('staticBackdrop'));

    myModal.show();

}
function cerrarmodal() {

    $('.modal-backdrop').remove();
    $('#staticBackdrop').removeClass('show');
    $('.modal-open').removeClass('modal-open');
    $('#staticBackdrop').css('display', 'none');
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
async function VisualizarArchivo(id, index,_this) {

    const tipo = files[index].extension.toLowerCase();
    $('.docu-active').removeClass('docu-active');
    $(_this).addClass('docu-active');

    document.querySelectorAll('.fa-eye-slash').forEach(c => {
        if (c != _ielement) {
            c.classList.add('fa-eye');
            c.classList.remove('fa-eye-slash');
        }

    });

    if (iconoDocumento(files[index]) == '../../Img/icon/download.svg') {
        await downloadFile(id, false);


        return;
    }


    if (tipo != '.pdf') {

        //$('#ImgMostrar').attr('src', VerArchivo() window.location.href.split('#')[0].split('V3')[0] + "V3/ADPRO/api/UploadFile/Descargar?tipo=" + Tipo + "&OrigenID=" + OrigenID + "&OrigenID2=" + OrigenID_2 + "&idarchivo=" + item.ArchivoID);
        MostrarArchivos('ImgMostrar', id);
        document.getElementById('dvImage').style.display = "table";
        document.getElementById('dvPdf').style.display = "none";


    } else {

        MostrarArchivos('FrmMostrar', id);
        //$('#FrmMostrar').attr('src', window.location.href.split('#')[0].split('V3')[0] + "V3/ADPRO/api/UploadFile/DescargarPdf?tipo=" + Tipo + "&OrigenID=" + OrigenID + "&OrigenID2=" + OrigenID_2 + "&idarchivo=" + item.ArchivoID);
        document.getElementById('dvPdf').style.display = "table";
        document.getElementById('dvImage').style.display = "none";
    }
}
async function MostrarArchivos(idObj, id) {

    const objectURL = await downloadFile(id, true);

    document.getElementById(idObj).setAttribute("src", objectURL);
}
async function downloadFile(id, visualizar) {

    if (visualizar == undefined) visualizar = false;

    const base_URL = `http://localhost/colegios/api/adjunto/descargar?id=${id}`;

    let Init = {
        method: 'GET',
    };

    Init.headers = { ...Init.headers };

    const response = await fetch(`${base_URL}`, Init);


    if (response.ok) {

        let filename = "";
        const disposition = response.headers.get('Content-Disposition');
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec((disposition ? disposition : ''));
        if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
        }

        const blob = await response.blob();

        const url = window.URL.createObjectURL(blob);
        if (!visualizar) {

            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();  //aft
        }
        else {
            return url;
        }
    }
}
function iconoDocumento(data) {

    let Icono = '';
    switch (data.extension.toLowerCase()) {

        case ".pdf":
            Icono = 'https://coderthemes.com/highdmin/layouts/assets/images/file_icons/pdf.svg';
            break;
        case ".bpm":
            Icono = 'https://coderthemes.com/highdmin/layouts/assets/images/file_icons/bmp.svg';
            break;
        case ".psd":
            Icono = 'https://coderthemes.com/highdmin/layouts/assets/images/file_icons/psd.svg';
            break;
        case ".avi":
            Icono = 'https://coderthemes.com/highdmin/layouts/assets/images/file_icons/avi.svg';
            break;


        case ".txt":
            Icono = 'https://coderthemes.com/highdmin/layouts/assets/images/file_icons/txt.svg';
            break;
        case ".zip":
        case ".rar":
            Icono = 'https://coderthemes.com/highdmin/layouts/assets/images/file_icons/zip.svg';
            break;
        case ".png":
        case ".jpeg":
        case ".jpg":
        case ".svg":
        case ".png":
            Icono = 'https://coderthemes.com/highdmin/layouts/assets/images/file_icons/png.svg';
            break;

        default:
            Icono = `../../Img/icon/download.svg`;
            break;
    }
    return Icono;

}
function svgdownload() {
    return `<?xml version="1.0" encoding="iso-8859-1"?>
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
	<path style="fill:#2D527C;" d="M364.745,512c-1.961,0-3.94-0.379-5.823-1.158c-5.687-2.357-9.397-7.907-9.397-14.064V411.47
		c0-8.406,6.817-15.223,15.223-15.223h85.307c6.158,0,11.708,3.71,14.064,9.397c2.355,5.689,1.052,12.236-3.3,16.59l-85.307,85.307
		C372.601,510.453,368.707,512,364.745,512z M379.971,426.693v33.332l33.332-33.332H379.971z"/>
	<path style="fill:#2D527C;" d="M297.412,512H83.931c-20.519,0-37.209-16.692-37.209-37.209V37.209C46.721,16.692,63.412,0,83.931,0
		h344.137c20.519,0,37.209,16.692,37.209,37.209v374.26c0,4.037-1.604,7.908-4.459,10.764l-85.307,85.307
		c-5.946,5.943-15.582,5.943-21.53,0c-5.945-5.945-5.945-15.584,0-21.53l80.849-80.849V37.209c0-3.73-3.034-6.764-6.764-6.764
		H83.931c-3.73,0-6.764,3.034-6.764,6.764v437.58c0,3.73,3.034,6.764,6.764,6.764h213.481c8.406,0,15.223,6.817,15.223,15.223
		C312.635,505.182,305.818,512,297.412,512z"/>
</g>
<polygon style="fill:#CEE8FA;" points="287.968,236.085 287.968,129.787 224.032,129.787 224.032,236.085 152.268,236.085
	256,382.213 359.732,236.085 "/>
<path style="fill:#2D527C;" d="M256,397.434c-4.932,0-9.558-2.388-12.413-6.412L139.856,244.896
	c-3.296-4.643-3.725-10.738-1.111-15.797c2.614-5.059,7.832-8.237,13.526-8.237h56.541v-91.074c0-8.406,6.817-15.223,15.223-15.223
	h63.936c8.406,0,15.223,6.817,15.223,15.223v91.074h56.541c5.693,0,10.912,3.179,13.526,8.237
	c2.614,5.059,2.184,11.154-1.111,15.797L268.416,391.022C265.558,395.046,260.932,397.434,256,397.434z M181.744,251.308
	L256,355.914l74.256-104.606h-42.288c-8.406,0-15.223-6.817-15.223-15.223v-91.074h-33.49v91.074
	c0,8.406-6.817,15.223-15.223,15.223H181.744z"/>
<g>

</svg>
`
}
function renderizarAdjuntosModal() {
    let html = ``;

    files.filter(c => c.id > 0).forEach((c, i) => {
        let icono = iconoDocumento(c);

        icono = ` <img src="${iconoDocumento(c)}" />`


        html += ` <div class="border border-1 p-2 cursor-pointer" onclick="VisualizarArchivo(${c.id},${i},this)">
                    <div class="d-flex align-items-center">
                        <div>
                           ${icono}
                        </div>
                        <div>
                            <h6>${c.nombreDocReq}</h6>
                        </div>
                    </div>
                </div>`;
    });

    document.getElementById('arvivosModal').innerHTML = html;

}

consultardocumentos();
consultarInfoEstudiante();
