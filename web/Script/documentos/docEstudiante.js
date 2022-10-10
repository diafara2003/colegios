
async function consultardocumentos() {
    const id = Get_query_string('id');
    renderizar_documentos(await consultarAPI(`documentoscolegio/estudiante?idestudiante=${id}`, 'GET'));

}
function renderizar_documentos(source) {
    let html = ''
    source.forEach(c => html += adjuntoHTML(c));
    document.getElementById('CardAdjunto').innerHTML = html;

}
function adjuntoHTML(data) {
    return `  <div class="col-lg-3 col-md-4 col-sm-12 doc-render" data-nombre="${data.nombreDocReq}">
                        <div class="card">
                            <div class="file">
                                <a href="javascript:void(0);">
                                    ${data.id == 0 ? ''
                                        :`  <div class="hover">
                                        <button type="button" class="btn btn-icon btn-info">
                                            <i class="fa fa-download"></i>
                                        </button>
                                    </div>`}
                                  
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
function descargar(id) {

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

consultardocumentos();