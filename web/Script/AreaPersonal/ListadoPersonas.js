let _tipo_perfil = {};

function consltar_tipo_perfil() {
    let tipo = Get_query_string('T');

    consultarAPI('Persona/Tipos', 'GET', response => {
        let filtered = tipo == 'P' ? 'Profesores' : 'Estudiantes';
        _tipo_perfil = response.find(x => x.UsuPerDescripcion == filtered);
        consultar_personas(_tipo_perfil.UsuPerId);
    });
}
function consultar_personas(_tipo) {
    consultarAPI(`Personas?tipo=${_tipo}`, 'GET', response => {
        renderizar_datos(response);
    });
}
function renderizar_datos(response) {

    let _html = '';
    response.forEach(persona => {
        _html += renderizar_tr(persona);
    });
    document.getElementById('tbodyDatos').innerHTML = _html;
    
    eventos_listado_personas();
}
function renderizar_tr(persona) {
    let _tr = '';
    
    _tr += '<tr>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerNombres) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerApellidos) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerTIpoDoc) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerDocumento) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerEmail) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerTelefono) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerGenero) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerRH) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerEPS) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerFechanacimiento) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerLugarNacimiento) + '</div></td>';
    _tr += '<td><div contenteditable="true">' + IsNull(persona.PerDireccion) + '</div></td>';
    _tr += '</tr>';

    return _tr;
}
function eventos_listado_personas() {
    setTimeout(c => { fixed_table_scroll('tblPersonas'); }, 300);

    $('[contenteditable="true"]').off('click');
    $('[contenteditable="true"]').click(function () {
        selectText(this);
    });
}
(function () {
    consltar_tipo_perfil();
})();
