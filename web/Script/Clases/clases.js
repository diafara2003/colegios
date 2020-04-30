function consultar_grados() {
    consultarAPI('Grados', 'GET', renderizar_grados);


}
function renderizar_grados(response) {

    let _html = '<option value="-1">--Seleccione un grado---</option>';
    response.forEach(grado => {
        _html += '<option value="' + grado.GraId + '">' + grado.GraDescripcion + '</option>';
    });
    document.getElementById('ddlGrados').innerHTML = _html;
}
function selected_grado() {
    let grado = $('#ddlGrados').find('option:selected').val();

    consultar_materias_grado(grado);
}
function consultar_materias_grado(grado) {
    consultarAPI(`Clase/materias?empresa=1&grado=${grado}`,'GET', renderizar_materias)
}
function renderizar_materias(response) {

}

(function () {
    consultar_grados();
})();