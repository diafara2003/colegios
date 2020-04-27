
let tipo = '', _tipo_perfil = {};

function consltar_tipo_perfil() {

    consultarAPI('Persona/Tipos', 'GET', response => {
        let filtered = tipo == 'P' ? 'Profesores' : 'Estudiantes';
        _tipo_perfil = response.find(x => x.UsuPerDescripcion == filtered);
    });
}
function validar_visual_tipo() {
    switch (tipo) {
        case 'E':
            $('.estudiante').css('display', 'block')
            break;
        case 'P':
            $('.profesor').css('display', 'block')
            break;

    }
}
function guardar_cambios() {

    const datos_persona = obtener_datos_persona();
    if (validar_campos_obligatorio_persona(datos_persona)) {
        window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
        consultarAPI('Personas', 'POST', response => {
            switch (tipo) {
                case 'E':
                    guardar_estudiante(response);
                    break;
                case 'P':
                    guardar_profesor(response);
                    break;
            }
            window.parent.mostrar_mensajes('', 'Se guardaron los cambios correctamente.', 'success', true, false, false, 'Aceptar');

        }, datos_persona);
    }


}
function obtener_datos_persona() {
    var myobject = {
        PerId: -1, PerIdEmpresa: 1, PerNombres: '', PerApellidos: '',
        PerTipoDoc: '', PerDocumento: '', PerEmail: '', PerTelefono: '',
        PerGenero: '', PerRH: '', PerEPS: '', PerUsuario: '',
        PerClave: '', PerEstado: 1, PerTipoPerfil: -1,
        PerFechanacimiento: '', PerLugarNacimiento: '', PerDireccion:''
    };
    myobject.PerEstado = _tipo_perfil.UsuPerId;
    myobject.PerNombres = document.getElementById('PerNombres').value;
    myobject.PerApellidos = document.getElementById('PerApellidos').value;
    myobject.PerTipoDoc = $('#PerTipoDoc').find('option:selected').val();
    myobject.PerDocumento = document.getElementById('PerDocumento').value;
    myobject.PerEmail = document.getElementById('PerEmail').value;
    myobject.PerTelefono = document.getElementById('PerTelefono').value;
    myobject.PerGenero = $('input[name=customGenero]:checked').val();

    myobject.PerGenero = myobject.PerGenero == undefined ? '' : myobject.PerGenero;


    myobject.PerRH = document.getElementById('PerRH').value;
    myobject.PerEPS = document.getElementById('PerEPS').value;
    myobject.PerTipoPerfil = _tipo_perfil.UsuPerId;

    myobject.PerFechanacimiento = document.getElementById('PerFechanacimiento').value;
    myobject.PerLugarNacimiento = document.getElementById('PerLugarNacimiento').value;
    myobject.PerDireccion = document.getElementById('PerDireccion').value;

    return myobject;
}
function validar_campos_obligatorio_persona(persona) {
    let result = true;

    if (persona.PerNombres == '') {
        mostrar_mensaje_validacion_error('Nombres obligatorios.');
        result = false;
        return;
    }
    if (persona.PerApellidos == '') {
        mostrar_mensaje_validacion_error('Apellidos obligatorios.');
        result = false;
        return;
    }
    if (persona.PerTipoDoc == '-1') {
        mostrar_mensaje_validacion_error('Tipo de documento obligatorio.');
        result = false;
        return;
    }
    if (persona.PerDocumento == '') {
        mostrar_mensaje_validacion_error('Número de documento obligatorio.');
        result = false;
        return;
    }
    if (persona.PerEmail == '' && persona.PerTelefono=='') {
        mostrar_mensaje_validacion_error('Correo electrónico o telefono obligatorio.');
        result = false;
        return;
    }
    if (persona.PerEmail != '' && !validar_correo(persona.PerEmail)) {
        mostrar_mensaje_validacion_error('Correo invalido.');
        result = false;
        return;
    }

    if (persona.PerGenero=='') {
        mostrar_mensaje_validacion_error('Genero obligatorio.');
        result = false;
        return;
    }
    if (persona.PerEPS == '') {
        mostrar_mensaje_validacion_error('EPS obligatorio.');
        result = false;
        return;
    }
    if (persona.PerRH == '') {
        mostrar_mensaje_validacion_error('Tipo de sangre obligatorio.');
        result = false;
        return;
    }

    return result;
}
function mostrar_mensaje_validacion_error(mensaje) {
    window.parent.mostrar_mensajes('Campos obligatorios', mensaje, 'error', true, false, false, 'Aceptar');
}
function guardar_profesor() {
    const obtener_datos = obtener_datos_profesor();
}
function obtener_datos_profesor() {

}
function guardar_estudiante() {

}
function obtener_datos_estudiante() {

}

(function () {
    let qs = Get_query_string('T');

    tipo = qs;
    consltar_tipo_perfil();
    validar_visual_tipo();
})();