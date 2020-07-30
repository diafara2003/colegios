let _estudiantes = [];
let iniciales = (nombre, apellidos) => {
    //apellidos = apellidos == "" ? nombre.substr(0, 3) : apellidos;
    return `${nombre.substr(0, 1).toUpperCase()}${apellidos.substr(0, 1).toUpperCase()}`;
}


function changeGrado() {
    let _value = $('#DdlGrados').find('option:selected').val();
    cargar_estudiantes(_value);
}
function cargar_grados() {
    consultarAPI('Grados', 'GET', (_response) => {
        renderizar_grados(_response);
    });
}
function renderizar_grados(_response) {
    let _html = '<option selected vaue="-1">Buscar todos</option>';
    _response.forEach(_g => {
        _html += `<option value="${_g.GraId}">${_g.GraDescripcion}</option>`;
    });
    document.getElementById('DdlGrados').innerHTML = _html;
}
function buscar_estudiantes(_this) {
    let _text = _this.value.toString();
    let filtered = [];

    if (_text == '') {
        filtered = _estudiantes;
    }
    else {
        filtered = _estudiantes.filter(_estudiante=>
            _estudiante.estudiante.PerNombres.toString().toLowerCase().includes(_text)
            || _estudiante.estudiante.PerApellidos.toString().toLocaleLowerCase().includes(_text)
            || _estudiante.curso.CurDescripcion.toString().toLocaleLowerCase().includes(_text)
        );
    }
    renderizar_estudiantes(filtered);
}
function cargar_estudiantes(grado) {

    consultarAPI('Persona/grado/estudiantes?grado=' + grado, 'GET', (_response) => {
        _estudiantes = _response;
        renderizar_estudiantes(_response);
    });
}
function renderizar_estudiantes(_response) {
    let _html = '';
    _response.forEach(u => {
        _html += renderizar_estudiante(u);;
    });
    document.getElementById('ulEstudiantes').innerHTML = _html;
}
function renderizar_estudiante(_estudiante) {
    let _li = '';

    _li += '<li class="list-group-item">';
    _li += '<div class="d-flex justify-content-between">';
    _li += '<div class="d-flex">';
    _li += '<div class="rounded-circle border" style="width:40px;height:40px;padding:8px 7px 7px 8px">';
    _li += `<span style="font-size:16px">${iniciales(_estudiante.estudiante.PerNombres, _estudiante.estudiante.PerApellidos)}</span>`;
    _li += '</div>';
    _li += '<div class="mt-2 pl-1">';
    _li += `<h5>${_estudiante.estudiante.PerNombres} ${_estudiante.estudiante.PerApellidos}</h5>`;
    _li += '</div>';
    _li += '</div>';
    _li += '<div class="mt-2 pl-1">';
    _li += `<h5>${_estudiante.curso.CurDescripcion} (${_estudiante.grado.GraDescripcion})</h5>`;
    _li += '</div>';
    _li += '</div>';
    _li += '</li>';

    return _li;
}
(function () {
    cargar_grados();
    cargar_estudiantes(-1);
})();