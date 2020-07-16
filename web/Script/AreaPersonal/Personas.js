
let tipo = '', _tipo_perfil = {}, _persona = -1, _usuario = '', _clave = '124',
    _profesor = {}, _estudiantes = {};

function consltar_tipo_perfil() {

    consultarAPI('Persona/Tipos', 'GET', response => {
        let filtered = tipo == 'E' ? 'Estudiante' : 'Docente';
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
        PerFechanacimiento: '', PerLugarNacimiento: '', PerDireccion: ''
    };

    myobject.PerUsuario = _usuario;
    myobject.PerClave = _clave;
    myobject.PerId = _persona;
    myobject.PerIdEmpresa = obtener_session().empresa;
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
    if (persona.PerEmail == '' && persona.PerTelefono == '') {
        mostrar_mensaje_validacion_error('Correo electrónico o telefono obligatorio.');
        result = false;
        return;
    }
    if (persona.PerEmail != '' && !validar_correo(persona.PerEmail)) {
        mostrar_mensaje_validacion_error('Correo invalido.');
        result = false;
        return;
    }

    if (persona.PerGenero == '') {
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

    consultarAPI('Persona/profesor', 'POST', (_response) => {

    }, obtener_datos);
}
function obtener_datos_profesor() {
    var _data = {};
    _data.ProfIdPersona = _persona;
    _data.ProfId = _profesor.ProfId;
    _data.ProfProfesion = document.getElementById('ProfProfesion').value;
    _data.ProfEspacialidad = document.getElementById('ProfEspacialidad').value;

    return _data;
}
function guardar_estudiante() {
    const obtener_datos = obtener_datos_estudiante();

    consultarAPI('Persona/estudiante', 'POST', (_response) => {

    }, obtener_datos);
}
function obtener_datos_estudiante() {
    var _data = {};

    _data.EstIdPersona = _persona;
    _data.EstId = _estudiantes.EstId;

    _data.EstNombresEstudiante = "";//document.getElementById('EstNombresEstudiante').value;
    _data.EstNombresMama = document.getElementById('EstNombresMama').value;
    _data.EstApellidosMama = document.getElementById('EstApellidosMama').value;
    _data.EstTelefonoMama = document.getElementById('EstTelefonoMama').value;
    //_data.EstCorreoMama = document.getElementById('EstCorreoMama').value;
    _data.EstNombresPapa = document.getElementById('EstNombresPapa').value;
    _data.EstApellidosPapa = document.getElementById('EstApellidosPapa').value;
    _data.EstTelefonoPapa = document.getElementById('EstTelefonoPapa').value;
    //_data.EstCorreoPapa = document.getElementById('EstCorreoPapa').value;

    return _data;
}
function cargar_usuario(_user) {
    consultarAPI('Personas?id=' + _user, 'GET', (_response) => {
        renderizar_usuario(_response[0]);
        _persona = _response[0].PerId;
        _usuario = _response[0].PerUsuario;
        _clave = _response[0].PerClave;

        if (_response[0].PerTipoPerfil == 1) {
            consultarAPI('Persona/profesor?id=' + _persona, 'GET', (_response) => {
                _profesor = _response;
                renderizar_profesor();
            });
        } else {
            consultarAPI('Persona/estudiante?id=' + _persona, 'GET', (_response) => {
                _estudiantes = _response;
                renderizar_esteudiante(_estudiantes);
            });
        }
    });
}
function renderizar_profesor() {
    var _data = {};
    document.getElementById('ProfProfesion').value = _profesor.ProfProfesion;
    document.getElementById('ProfEspacialidad').value = _profesor.ProfEspacialidad;

    return _data;
}
function renderizar_esteudiante(_data) {
    _data.EstNombresEstudiante = "";//document.getElementById('EstNombresEstudiante').value;
    document.getElementById('EstNombresMama').value = _data.EstNombresMama;
    document.getElementById('EstApellidosMama').value = _data.EstApellidosMama;
    document.getElementById('EstTelefonoMama').value = _data.EstTelefonoMama;
    //document.getElementById('EstCorreoMama').value = _data.EstCorreoMama;
    document.getElementById('EstNombresPapa').value = _data.EstNombresPapa;
    document.getElementById('EstApellidosPapa').value = _data.EstApellidosPapa;
    document.getElementById('EstTelefonoPapa').value = _data.EstTelefonoPapa;
    //document.getElementById('EstCorreoPapa').value = _data.EstCorreoPapa;
}
function renderizar_usuario(_response) {
    document.getElementById('PerNombres').value = _response.PerNombres;
    document.getElementById('PerApellidos').value = _response.PerApellidos;
    document.getElementById('PerEPS').value = _response.PerEPS;
    $('#PerTipoDoc').find(`option[value="${_response.PerTIpoDoc}"]`).attr('selected', 'selected');
    document.getElementById('PerDocumento').value = _response.PerDocumento;
    document.getElementById('PerEmail').value = _response.PerEmail;

    var $radios = $('input:radio[name=customGenero]').each(function () {
        if ($(this).val() == _response.PerGenero) {
            $(this).prop('checked', true);
        }
    });

    document.getElementById('PerTelefono').value = _response.PerTelefono;
    document.getElementById('PerRH').value = _response.PerRH;
    document.getElementById('PerFechanacimiento').value = _response.PerFechanacimiento;
    document.getElementById('PerLugarNacimiento').value = _response.PerLugarNacimiento;
    document.getElementById('PerDireccion').value = _response.PerDireccion;
}
(function () {
    let qs = Get_query_string('T');

    if (Get_query_string('user') != undefined)
        cargar_usuario(Get_query_string('user'));

    tipo = qs;
    consltar_tipo_perfil();
    validar_visual_tipo();
})();