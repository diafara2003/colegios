﻿async function consultar() {
    renderizarDatos(await consultarAPI('documentoscolegio/estudiantes/validacion', 'GET'));

}
function renderizarDatos(source) {
    let html = ''
    source.forEach(c => html += renderizarEstudiante(c));
    document.getElementById('m_widget4_tab1_content').innerHTML = html;

}
function renderizarEstudiante(est) {
    const porcentaje = ((est.totalDocumentosSubidos * 100) / est.totalDocumentos).toFixed(0);
    return `<div class="m-widget4 m-widget4--progress" data-grupo="${est.nombreGuupo}" data-nombre="${est.nombreEstudiante}">
                                <div class="m-widget4__item">
                                    <div class="m-widget4__img m-widget4__img--pic">
                                        <img src="../../Img/kid.png" alt="">
                                    </div>
                                    <div class="m-widget4__info">
                                        <span class="m-widget4__title">
                                            ${est.nombreEstudiante}
                                        </span>
                                        <br>
                                        <span class="m-widget4__sub">
                                            ${est.nombreGuupo}
                                        </span>
                                    </div>
                                    <div class="m-widget4__progress">
                                        <div class="m-widget4__progress-wrapper">
                                            <span class="m-widget17__progress-number">
                                                ${porcentaje}%
                                            </span>
                                            <span class="m-widget17__progress-label">
                                                completado
                                            </span>
                                            <div class="progress">
                                                <div class="progress-bar" style="width:${porcentaje}%" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="m-widget4__ext">
                                        <a href="#" class="m-btn m-btn--hover-brand m-btn--pill btn btn-sm btn-secondary">
                                            Documentos
                                        </a>
                                    </div>
                                </div>
                            </div>
`;
}
function buscarKeyPress() {
    const value = document.getElementById('txtdocumento').value.toLowerCase();


    $('.m-widget4--progress').each(function () {
        const grupo = $(this).attr('data-grupo').toLowerCase();
        const nombre = $(this).attr('data-nombre').toLowerCase();

        if (grupo.includes(value) || nombre.includes(value))
            $(this).removeClass('d-none');
        else $(this).addClass('d-none');

    })
}


consultar();