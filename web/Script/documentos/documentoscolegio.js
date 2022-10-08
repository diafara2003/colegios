
const _input = document.getElementById('txtdocumento');

function mySubmitFunction(e) {
    e.preventDefault();

    return false;
}

async function consultardocumentos() {
    renderizar_documentos(await consultarAPI('documentoscolegio/consultar', 'GET'));

    _input.focus();

}
async function agregarDocumento() {
    let data = {
        nombre: _input.value
    };

    const nuevoRegistro = await consultarAPI(`documentoscolegio/nuevo`, 'POST', undefined, data);

    alertify.success('Documento creado');

    $('#LstAdjuntos').append(adjuntoHTML(nuevoRegistro));
    _input.value = '';
}
function renderizar_documentos(source) {
    let html = ''
    source.forEach(c => html += adjuntoHTML(c));
    document.getElementById('LstAdjuntos').innerHTML = html;

}
function adjuntoHTML(adjunto) {
    return `<a href="#" class="list-group-item list-group-item-action " aria-current="true">
              <div class="d-flex justify-content-between">
                  <div>
                      ${adjunto.nombre}
                  </div>

                  <i onclick="eliminarAdjunto(this)" class="fas fa-trash" data-id="${adjunto.id}"></i>
              </div>
           </a>`;
}
function eliminarAdjunto(_this) {
    const id = parseInt(_this.getAttribute('data-id'));


    consultarAPI(`documentoscolegio/eliminar`, 'POST', undefined, {
        id
    });

    _this.closest('a').remove();
}

consultardocumentos();