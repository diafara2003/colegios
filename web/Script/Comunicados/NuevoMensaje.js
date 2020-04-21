function descartar() {
    let _url = window.location.href.toLowerCase().split('comunicados')[0];

    window.location.href = _url + 'comunicados/bandejaentrada.html'
}

var quill = new Quill('#editor', {
    placeholder: 'Mensaje a enviar',
    theme: 'snow'
});