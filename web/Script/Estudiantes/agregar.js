const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
let objEstudiante = {
    acudientes: [],
    estudiante: {
        EstId: 0,
        EstNombres: '',
        EstApellidos: '',
        EstFechaNacimineto: '',
        EstRC: '',
        EstRH: '',
        EstAseguradora: '',
        EstAlergias: '',
        EstMedicamentos: '',
        EstObs: '',
        EstDireccion: '',
        EstTelefono: '',
        Acudiente1: 0,
        Acudiente2: 0
    },
    grupo: {
        id: 0,
        nombre: ''
    }
};
let _acudiente1 = {
    PerId: 0,
    PerNombres: '',
    PerApellidos: '',
    PerEmail: '',
    PerTelefono: '',
    PerTipoAcudiente: ''

};
let _acudiente2 = {
    PerId: 0,
    PerNombres: '',
    PerApellidos: '',
    PerEmail: '',
    PerTelefono: '',
    PerTipoAcudiente: ''

};

async function consultar_estudiante(id) {
    objEstudiante = await consultarAPI('Estudiantes/' + id, 'GET', undefined);

    cargar_estudiante();


    _acudiente1 = objEstudiante.acudientes[0];

    if (objEstudiante.acudientes.length == 2)
        _acudiente2 = objEstudiante.acudientes[1];


    $('#Btnguardar').removeAttr('disabled');

}
function cargar_estudiante() {


    const parts = objEstudiante.estudiante.EstFechaNacimineto.split(/[- :]/);
    const wanted = `${parts[0]}-${parts[1]}-${parts[2].split('T')[0]}`;
    /*estudiante*/
    document.getElementById('EstNombres').value = objEstudiante.estudiante.EstNombres;
    document.getElementById('EstApellidos').value = objEstudiante.estudiante.EstApellidos;
    document.getElementById('EstRC').value = objEstudiante.estudiante.EstRC;
    document.getElementById('EstFechaNacimineto').value = wanted;
    $('#EstRH').find(`option[value="${objEstudiante.estudiante.EstRH}"]`).attr('selected', 'selected');

    document.getElementById('EstAseguradora').value = objEstudiante.estudiante.EstAseguradora;
    document.getElementById('EstAlergias').value = objEstudiante.estudiante.EstAlergias;
    document.getElementById('EstMedicamentos').value = objEstudiante.estudiante.EstMedicamentos;


    /*grupo*/
    $('#ddlgrupo').find(`option[value="${objEstudiante.grupo.id}"]`).attr('selected', 'selected');

    /*acudiente */
    document.getElementById('PerNombres_1').value = objEstudiante.acudientes[0].PerNombres;
    document.getElementById('PerApellidos_1').value = objEstudiante.acudientes[0].PerApellidos;
    document.getElementById('PerEmail_1').value = objEstudiante.acudientes[0].PerEmail;
    document.getElementById('PerTelefono_1').value = objEstudiante.acudientes[0].PerTelefono;
    $('#PerTipoAcudiente_1').find(`option[value="${objEstudiante.acudientes[0].PerTipoAcudiente}"]`).attr('selected', 'selected');


    if (objEstudiante.acudientes.length == 2 && objEstudiante.acudientes[1] != null) {
        /*acudiente 2*/
        document.getElementById('PerNombres_2').value = objEstudiante.acudientes[1].PerNombres;
        document.getElementById('PerApellidos_2').value = objEstudiante.acudientes[1].PerApellidos;
        document.getElementById('PerEmail_2').value = objEstudiante.acudientes[1].PerEmail;
        document.getElementById('PerTelefono_2').value = objEstudiante.acudientes[1].PerTelefono;
        $('#PerTipoAcudiente_2').find(`option[value="${objEstudiante.acudientes[1].PerTipoAcudiente}"]`).attr('selected', 'selected');
    }
}
async function consultar_grupos() {
    const response = await consultarAPI('Grupos', 'GET');

    _data_grupos = response;
    renderizar_grupos(response);


}
function validar_correo_formulario(_this) {
    if (!emailRegex.test(_this.value) && _this.value != '') alertify.error("El correo ingresado es invalido");
    habilitar_boton_agregar();

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


    if (objEstudiante.estudiante.EstNombres == '') return false;
    if (objEstudiante.estudiante.EstApellidos == '') return false;
    if (objEstudiante.estudiante.EstRC == '') return false;
    if (objEstudiante.estudiante.EstRH == '') return false;
    if (objEstudiante.estudiante.EstFechaNacimineto == '') return false;


    if (objEstudiante.acudientes[0].PerEmail == '') return false;
    else if (validar_correo(objEstudiante.acudientes[0].PerEmail == '')) return false;

    if (objEstudiante.acudientes[0].PerNombres == '') return false;
    if (objEstudiante.acudientes[0].PerApellidos == '') return false;
    if (objEstudiante.acudientes[0].PerTipoAcudiente == '') return false;
    if (objEstudiante.acudientes[0].PerEmail == '') return false;
    if (objEstudiante.acudientes[0].PerTelefono == '') return false;


    if (!emailRegex.test(objEstudiante.acudientes[0].PerEmail)) return false;


    if (objEstudiante.length == 2 && emailRegex.test(objEstudiante[1].PerEmail)) return false;

    if (objEstudiante.grupo.id <= 0) return false;

    return true;
}
function obtener_datos_formulario() {

    /*estudiante*/
    objEstudiante.estudiante.EstNombres = document.getElementById('EstNombres').value;
    objEstudiante.estudiante.EstApellidos = document.getElementById('EstApellidos').value;
    objEstudiante.estudiante.EstFechaNacimineto = document.getElementById('EstFechaNacimineto').value;
    objEstudiante.estudiante.EstRC = document.getElementById('EstRC').value;
    objEstudiante.estudiante.EstAseguradora = document.getElementById('EstAseguradora').value;
    objEstudiante.estudiante.EstAlergias = document.getElementById('EstAlergias').value;
    objEstudiante.estudiante.EstMedicamentos = document.getElementById('EstMedicamentos').value;
    objEstudiante.estudiante.EstRH = $('#EstRH').find('option:selected').val();

    /*grupo*/
    objEstudiante.grupo.id = $('#ddlgrupo').find('option:selected').val();

    /*acudiente */
    _acudiente1.PerNombres = document.getElementById('PerNombres_1').value;
    _acudiente1.PerApellidos = document.getElementById('PerApellidos_1').value;
    _acudiente1.PerEmail = document.getElementById('PerEmail_1').value;
    _acudiente1.PerTelefono = document.getElementById('PerTelefono_1').value;
    _acudiente1.PerTipoAcudiente = $('#PerTipoAcudiente_1').find('option:selected').val();


    objEstudiante.acudientes = [];
    objEstudiante.acudientes.push(_acudiente1);
    if (_acudiente2 == null) _acudiente2 = {}

    /*acudiente 2*/
    _acudiente2.PerNombres = document.getElementById('PerNombres_2').value;
    _acudiente2.PerApellidos = document.getElementById('PerApellidos_2').value;
    _acudiente2.PerEmail = document.getElementById('PerEmail_2').value;
    _acudiente2.PerTelefono = document.getElementById('PerTelefono_2').value;
    _acudiente2.PerTipoAcudiente = $('#PerTipoAcudiente_2').find('option:selected').val();


    if (_acudiente2.PerEmail != '' && emailRegex.test(_acudiente2.PerEmail)) objEstudiante.acudientes.push(_acudiente2);
}
async function agregar_estudiante() {
    obtener_datos_formulario();
    if (validar_campos_obligatorios()) {
        const _result = await consultarAPI('Estudiantes', 'POST', undefined, objEstudiante);


        if (_result.resultado.codigo == -1) {

            alertify.error(_result.resultado.respuesta);
            return;
        }

        if (objEstudiante.estudiante.EstId == 0) alertify.success('Estudiante creado correctamente');
        else alertify.success('Estudiante modificado correctamente');

        objEstudiante.estudiante.EstId = _result.modelo.estudiante.EstId;
        objEstudiante.estudiante.Acudiente1 = _result.modelo.estudiante.EstIdPersona;
        objEstudiante.acudientes[0].PerId = _result.modelo.acudientes[0].PerId;
        _acudiente1.PerId = _result.modelo.estudiante.Acudiente1;

        if (objEstudiante.acudientes.length == 2) {
            objEstudiante.acudientes[1].PerId = _result.modelo.acudientes[1].PerId;
            objEstudiante.estudiante.Acudiente2 = _result.modelo.estudiante.Acudiente2;
            _acudiente2.PerId = _result.modelo.estudiante.Acudiente2;
        }


    }
}
async function enviarCorreo(_type) {
    let _id = 0;


    if (_type == 1) _id = objEstudiante.acudientes[0].PerId;
    else if (objEstudiante.acudientes.length == 2) _id = objEstudiante.acudientes[1].PerId;

    const _result = await consultarAPI('Persona/EnviarCorreo?id=' + _id, 'GET');

    if (_result.codigo == 1)
        alertify.success(_result.respuesta);
    else
        alertify.error(_result.respuesta);

}
async function restablecer_contraseña(_type) {
    let _id = 0;

    if (_type == 1) _id = objEstudiante.acudientes[0].PerId;
    else if (objEstudiante.acudientes.length == 2) _id = objEstudiante.acudientes[1].PerId;

    const _result = await consultarAPI('Persona/Restablecer?id=' + _id, 'GET');

    if (_result.codigo == 1)
        alertify.success(_result.respuesta);
    else
        alertify.error(_result.respuesta);
}
function nuevo_estudiante() {
    window.location.reload();
}
function regresar() {
    window.location.href = `${window.location.href.split('views')[0]}/views/estudiantes/estudiantes.html`;
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
document.getElementById("EstFechaNacimineto").setAttribute("max", today);


(async () => {
    await consultar_grupos();

    const _id = Get_query_string('id')
    if (_id != undefined) {
        consultar_estudiante(_id);
        $('#Btnguardar').text('Editar estudiante')
    } else $('#Btnguardar').text('Crear estudiante');




    $('[data-toggle="tooltip"]').tooltip();
})();