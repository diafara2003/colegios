let objEstudiante = {
    persona: {
        PerId: 0,
        PerNombres: '',
        PerApellidos: '',
        PerDocumento: '',
        PerFechanacimiento: '',
        PerGenero: ''
    },
    estudiante: {
        EstId: 0,
        EstIdPersona: 0,
        EstNombresEstudiante: '',


        EstNombresMama: '',
        EstApellidosMama: '',
        EstTelefonoMama: '',
        EstCorreoMama: '',
        EstParentestoAcudiente1: '',


        EstNombresPapa: '',
        EstApellidosPapa: '',
        EstTelefonoPapa: '',
        EstCorreoPapa: '',
        EstParentestoAcudiente2: '',
    },
    grupo: {
        id: 0,
        nombre: ''
    }
};

async function consultar_estudiante(id) {
    objEstudiante = await consultarAPI('Estudiantes/' + id, 'GET', undefined);

    cargar_estudiante();
    $('#Btnguardar').removeAttr('disabled');

}
function cargar_estudiante() {
    /*estudiante*/
    document.getElementById('PerNombres').value = objEstudiante.persona.PerNombres;
    document.getElementById('PerApellidos').value = objEstudiante.persona.PerApellidos;
    document.getElementById('PerDocumento').value = objEstudiante.persona.PerDocumento;
    document.getElementById('PerFechanacimiento').value = objEstudiante.persona.PerFechanacimiento;
    $('#PerGenero').find(`option[value="${objEstudiante.persona.PerGenero}"]`).attr('selected', 'selected');

    /*grupo*/
    $('#ddlgrupo').find(`option[value="${objEstudiante.grupo.id}"]`).attr('selected', 'selected');

    /*acudiente */
    document.getElementById('EstNombresMama').value = objEstudiante.estudiante.EstNombresMama;
    document.getElementById('EstApellidosMama').value = objEstudiante.estudiante.EstApellidosMama;
    document.getElementById('EstCorreoMama').value = objEstudiante.estudiante.EstCorreoMama;
    document.getElementById('EstTelefonoMama').value = objEstudiante.estudiante.EstTelefonoMama;
    $('#EstParentestoAcudiente1').find(`option[value="${objEstudiante.estudiante.EstParentestoAcudiente1}"]`).attr('selected', 'selected');


    /*acudiente 2*/
    document.getElementById('EstApellidosPapa').value = objEstudiante.estudiante.EstApellidosPapa;
    document.getElementById('EstCorreoPapa').value = objEstudiante.estudiante.EstCorreoPapa;
    document.getElementById('EstNombresPapa').value = objEstudiante.estudiante.EstNombresPapa;
    document.getElementById('EstTelefonoPapa').value = objEstudiante.estudiante.EstTelefonoPapa;
    $('#EstParentestoAcudiente2').find(`option[value="${objEstudiante.estudiante.EstParentestoAcudiente2}"]`).attr('selected', 'selected');

}
async function consultar_grupos() {
    const response = await consultarAPI('Grupos', 'GET');

    _data_grupos = response;
    renderizar_grupos(response);


}
function renderizar_grupos(_grupos) {
    let _html = ``;

    _grupos.forEach(c => _html += `<option value="${c.IdGrupo}" >${c.Nombre}</option> `);

    $('#ddlgrupo').append(_html);
}
async function habilitar_boton_agregar() {
    obtener_datos_formulario();

    if (validar_campos_obligatorios()) $('#Btnguardar').removeAttr('disabled');
    else $('#Btnguardar').attr('disabled', 'disabled');

}
function validar_campos_obligatorios() {
    if (objEstudiante.persona.PerNombres == '') return false;
    if (objEstudiante.persona.PerApellidos == '') return false;
    if (objEstudiante.persona.PerDocumento == '') return false;



    if (objEstudiante.estudiante.EstCorreoMama == '') return false;
    else if (validar_correo(objEstudiante.estudiante.EstCorreoMama == '')) return false;

    if (objEstudiante.estudiante.EstNombresMama == '') return false;
    if (objEstudiante.estudiante.EstApellidosMama == '') return false;
    if (objEstudiante.estudiante.EstParentestoAcudiente1 == '') return false;
    if (objEstudiante.estudiante.EstTelefonoMama == '') return false;


    if (objEstudiante.grupo.id <= 0) return false;




    return true;
}
function obtener_datos_formulario() {

    /*estudiante*/
    objEstudiante.persona.PerNombres = document.getElementById('PerNombres').value;
    objEstudiante.persona.PerApellidos = document.getElementById('PerApellidos').value;
    objEstudiante.persona.PerDocumento = document.getElementById('PerDocumento').value;
    objEstudiante.persona.PerFechanacimiento = document.getElementById('PerFechanacimiento').value;
    objEstudiante.persona.PerGenero = $('#PerGenero').find('option:selected').val();

    /*grupo*/
    objEstudiante.grupo.id = $('#ddlgrupo').find('option:selected').val();

    /*acudiente */
    objEstudiante.estudiante.EstNombresMama = document.getElementById('EstNombresMama').value;
    objEstudiante.estudiante.EstApellidosMama = document.getElementById('EstApellidosMama').value;
    objEstudiante.estudiante.EstCorreoMama = document.getElementById('EstCorreoMama').value;
    objEstudiante.estudiante.EstTelefonoMama = document.getElementById('EstTelefonoMama').value;
    objEstudiante.estudiante.EstParentestoAcudiente1 = $('#EstParentestoAcudiente1').find('option:selected').val();

    /*acudiente 2*/
    objEstudiante.estudiante.EstApellidosPapa = document.getElementById('EstApellidosPapa').value;
    objEstudiante.estudiante.EstCorreoPapa = document.getElementById('EstCorreoPapa').value;
    objEstudiante.estudiante.EstNombresPapa = document.getElementById('EstNombresPapa').value;
    objEstudiante.estudiante.EstTelefonoPapa = document.getElementById('EstTelefonoPapa').value;
    objEstudiante.estudiante.EstParentestoAcudiente2 = $('#EstParentestoAcudiente2').find('option:selected').val();
}
async function agregar_estudiante() {
    obtener_datos_formulario();
    if (validar_campos_obligatorios()) {
        const _result = await consultarAPI('Estudiantes', 'POST', undefined, objEstudiante);


        if (objEstudiante.persona.PerId == 0) alertify.success('Estudiante creado correctamente');
        else alertify.success('Estudiante modificado correctamente');

        objEstudiante.persona.PerId = _result.persona.PerId;
        objEstudiante.estudiante.EstId = _result.estudiante.EstId;
        objEstudiante.estudiante.EstIdPersona = _result.estudiante.EstIdPersona;

    }
}





var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
    dd = '0' + dd
}
if (mm < 10) {
    mm = '0' + mm
}

today = yyyy + '-' + mm + '-' + dd;
document.getElementById("PerFechanacimiento").setAttribute("max", today);


(async () => {

    await consultar_grupos();


    const _id = Get_query_string('id')
    if (_id != undefined) consultar_estudiante(_id);
    
})();