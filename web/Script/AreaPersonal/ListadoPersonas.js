let _tipo_perfil = {}, data_personas = [];

function buscar_personas(_this) {
    let _text = _this.value;
    let filtered = [];

    if (_text == '') {
        filtered = data_personas;
    }
    else {
        var res = data_personas.filter((item) => {
            return Object.keys(item).some(
                (key) => item[key] != null && item[key].toString().toLocaleLowerCase().includes(_text));
        });
        filtered = res;
    }
    renderizar_datos(filtered);
}
async function consltar_tipo_perfil() {
    let tipo = Get_query_string('T');

    await consultarAPI('Persona/Tipos', 'GET', response => {
        let filtered = tipo == 'P' ? 'Docente' : 'Estudiante';
        _tipo_perfil = response.find(x => x.UsuPerDescripcion == filtered);


        if (tipo == 'P') {
            $('.opcion-docente').removeClass('d-none');
            $('.opcion-estudiante').addClass('d-none');
        } else {
            $('.opcion-estudiante').removeClass('d-none');
            $('.opcion-docente').addClass('d-none');
        }

        document.getElementById('HeaderOpcion').textContent = `Listado de ${filtered}s`
    });
}
function consultar_personas(_tipo) {
    consultarAPI(`Persona/all?tipo=${_tipo}`, 'GET', response => {
        data_personas = response;
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
    _tr += '<td><div onblur="modificar_persona(this,' + persona.PerId + ')" contenteditable="true" id="PerNombres_' + persona.PerId + '">' + IsNull(persona.PerNombres) + '</div></td>';
    _tr += '<td><div onblur="modificar_persona(this,' + persona.PerId + ')" contenteditable="true" id="PerApellidos_' + persona.PerId + '">' + IsNull(persona.PerApellidos) + '</div></td>';
    _tr += '<td style="width:60px"><div contenteditable="true" onblur="modificar_persona(this,' + persona.PerId + ')" id="PerTIpoDoc_' + persona.PerId + '">' + IsNull(persona.PerTIpoDoc) + '</div></td>';
    _tr += '<td><div contenteditable="true" onblur="modificar_persona(this,' + persona.PerId + ')" id="PerDocumento_' + persona.PerId + '">' + IsNull(persona.PerDocumento) + '</div></td>';
    _tr += '<td><div contenteditable="true" onblur="modificar_persona(this,' + persona.PerId + ')" id="PerEmail_' + persona.PerId + '">' + IsNull(persona.PerEmail) + '</div></td>';
    _tr += '<td><div contenteditable="true" onblur="modificar_persona(this,' + persona.PerId + ')" id="PerTelefono_' + persona.PerId + '">' + IsNull(persona.PerTelefono) + '</div></td>';
    _tr += '<td style="width:65px"><div contenteditable="true" onblur="modificar_persona(this,' + persona.PerId + ')" id="PerGenero_' + persona.PerId + '">' + IsNull(persona.PerGenero) + '</div></td>';
    _tr += '<td style="width:65px"><div contenteditable="true" onblur="modificar_persona(this,' + persona.PerId + ')" id="PerRH_' + persona.PerId + '">' + IsNull(persona.PerRH) + '</div></td>';
    _tr += '<td><div contenteditable="true" onblur="modificar_persona(this,' + persona.PerId + ')" id="PerEPS_' + persona.PerId + '">' + IsNull(persona.PerEPS) + '</div></td>';
    _tr += '<td><div contenteditable="true" onblur="modificar_persona(this,' + persona.PerId + ')" id="PerFechanacimiento_' + persona.PerId + '">' + IsNull(persona.PerFechanacimiento) + '</div></td>';
    _tr += '<td><div contenteditable="true" onblur="modificar_persona(this,' + persona.PerId + ')" id="PerLugarNacimiento_' + persona.PerId + '">' + IsNull(persona.PerLugarNacimiento) + '</div></td>';
    _tr += '<td><div contenteditable="true" onblur="modificar_persona(this,' + persona.PerId + ')" id="PerDireccion_' + persona.PerId + '">' + IsNull(persona.PerDireccion) + '</div></td>';

    _tr += '<td class="text-center" id="PerEstado_' + persona.PerId + '" >';
    _tr += '<div class="custom-control custom-switch">';
    _tr += '<input type="checkbox" class="custom-control-input" onblur="modificar_persona(this,' + persona.PerId + ')" id="customSwitch_' + persona.PerId + '"  ' + (persona.PerEstado ? 'checked' : '') + '>';
    _tr += '<label class="custom-control-label" for="customSwitch_' + persona.PerId + '"></label>';
    _tr += '</div>';
    _tr += '</td>';

    _tr += '<td><button onclick="eliminar_persona(this,' + persona.PerId + ')" class="btn-icono" data-toggle="tooltip" data-placement="top" title="" data-original-title="Eliminar"><i class="fas fa-trash"></i></button></td>';
    _tr += '</tr>';

    return _tr;
}
function eventos_listado_personas() {
    setTimeout(c => { fixed_table_scroll('tblPersonas'); }, 300);

    $('[contenteditable="true"]').off('click');
    $('[contenteditable="true"]').focusin(function () {
        selectText(this);
    });
}
function modificar_persona(this_, id) {
    let data_changed = obtener_datos_persona(id);


    if (validar_campos_obligatorio_persona(data_changed)) {

        data_changed.PerEstado = $('#customSwitch_' + id).is(':checked');
        consultarAPI('Personas', 'PUT', function (response) {
            let _index = data_personas.findIndex(c => c.PerId == data_changed.PerId);
            data_personas[_index] = data_changed;

        }, data_changed);
    }
}
function eliminar_persona(_this, id) {
    let data_changed = { PerId: id };
    window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
    consultarAPI('Personas/' + id, 'DELETE', function (response) {
        let _index = data_personas.findIndex(c => c.PerId == data_changed.PerId);
        data_personas.splice(_index, 1);
        $(_this).closest('tr').remove();
        window.parent.cerrar_mensaje();

    }, data_changed);
}
function guardar_cambios() {

    const datos_persona = obtener_datos_persona(-1);
    if (validar_campos_obligatorio_persona(datos_persona)) {
        window.parent.mostrar_mensajes('', '<span><i class="fas fa-2x fa-circle-notch fa-spin mr-2"></i>Guardando cambios...</span>');
        consultarAPI('Personas', 'POST', response => {
            if (response.codigo < 0) {
                window.parent.mostrar_mensajes('', response.respuesta, 'error', true, false, false, 'Aceptar');
            } else {
                datos_persona.PerId = response.codigo;
                data_personas.push(datos_persona);
                let nuevo_tr = renderizar_tr(datos_persona);

                $('#tbodyDatos').append(nuevo_tr);
                limpiar_registro_personas(-1);
                $('#PerNombres_-1').focus();
                eventos_listado_personas();
                window.parent.mostrar_mensajes('', 'Se guardaron los cambios correctamente.', 'success', true, false, false, 'Aceptar');
            }
        }, datos_persona);
    }


}
function obtener_datos_persona(posicion) {
    var _data = {
        PerId: -1, PerIdEmpresa: 1, PerNombres: '', PerApellidos: '',
        PerTipoDoc: '', PerDocumento: '', PerEmail: '', PerTelefono: '',
        PerGenero: '', PerRH: '', PerEPS: '', PerUsuario: '',
        PerClave: '', PerEstado: 1, PerTipoPerfil: -1,
        PerFechanacimiento: '', PerLugarNacimiento: '', PerDireccion: ''
    };
    _data.PerIdEmpresa = obtener_session().empresa;
    _data.PerId = posicion;
    _data.PerEstado = 1;
    _data.PerTipoPerfil = _tipo_perfil.UsuPerId;
    _data.PerTipoDoc = $('#PerTipoDoc_' + posicion).find('option:selected').val();
    _data.PerGenero = $('#PerGenero_' + posicion).find('option:selected').val();

    _data.PerFechanacimiento = $('#PerFechanacimiento_' + posicion).val();


    if (document.getElementById('PerNombres_' + posicion).tagName.toLowerCase() == 'div') {
        _data.PerNombres = document.getElementById('PerNombres_' + posicion).textContent;
    } else {
        _data.PerNombres = document.getElementById('PerNombres_' + posicion).value;
    }

    if (document.getElementById('PerApellidos_' + posicion).tagName.toLowerCase() == 'div') {
        _data.PerApellidos = document.getElementById('PerApellidos_' + posicion).textContent;
    } else {
        _data.PerApellidos = document.getElementById('PerApellidos_' + posicion).value;
    }

    if (document.getElementById('PerDocumento_' + posicion).tagName.toLowerCase() == 'div') {
        _data.PerDocumento = document.getElementById('PerDocumento_' + posicion).textContent;
    } else {
        _data.PerDocumento = document.getElementById('PerDocumento_' + posicion).value;
    }

    if (document.getElementById('PerEmail_' + posicion).tagName.toLowerCase() == 'div') {
        _data.PerEmail = document.getElementById('PerEmail_' + posicion).textContent;
    } else {
        _data.PerEmail = document.getElementById('PerEmail_' + posicion).value;
    }

    if (document.getElementById('PerTelefono_' + posicion).tagName.toLowerCase() == 'div') {
        _data.PerTelefono = document.getElementById('PerTelefono_' + posicion).textContent;
    } else {
        _data.PerTelefono = document.getElementById('PerTelefono_' + posicion).value;
    }

    if (posicion == -1) {
        _data.PerRH = $('#PerRH_-1').find('option:selected').val();
    } else {
        _data.PerRH = document.getElementById('PerRH_' + posicion).textContent;
    }

    if (document.getElementById('PerEPS_' + posicion).tagName.toLowerCase() == 'div') {
        _data.PerEPS = document.getElementById('PerEPS_' + posicion).textContent;
    } else {
        _data.PerEPS = document.getElementById('PerEPS_' + posicion).value;
    }

    if (document.getElementById('PerLugarNacimiento_' + posicion).tagName.toLowerCase() == 'div') {
        _data.PerLugarNacimiento = document.getElementById('PerLugarNacimiento_' + posicion).textContent;
    } else {
        _data.PerLugarNacimiento = document.getElementById('PerLugarNacimiento_' + posicion).value;
    }

    if (document.getElementById('PerDireccion_' + posicion).tagName.toLowerCase() == 'div') {
        _data.PerDireccion = document.getElementById('PerDireccion_' + posicion).textContent;
    } else {
        _data.PerDireccion_ = document.getElementById('PerDireccion_' + posicion).value;
    }

    return _data;
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
        mostrar_mensaje_validacion_error('Correo electrónico o télefono obligatorio.');
        result = false;
        return;
    }
    if (persona.PerEmail != '' && !validar_correo(persona.PerEmail)) {
        mostrar_mensaje_validacion_error('Correo inválido.');
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
    window.parent.mostrar_mensajes('', mensaje, 'error', true, false, false, 'Aceptar');
}
function limpiar_registro_personas(posicion) {
    document.getElementById('PerNombres_' + posicion).value = "";
    document.getElementById('PerApellidos_' + posicion).value = "";
    document.getElementById('PerDocumento_' + posicion).value = "";
    document.getElementById('PerEmail_' + posicion).value = "";
    document.getElementById('PerTelefono_' + posicion).value = "";
    document.getElementById('PerRH_' + posicion).value = "";
    document.getElementById('PerEPS_' + posicion).value = "";
    //document.getElementById('PerUsuario_' + posicion).value = "";
    //document.getElementById('PerClave_' + posicion).value = "";
    document.getElementById('PerFechanacimiento_' + posicion).value = "";
    document.getElementById('PerLugarNacimiento_' + posicion).value = "";
    document.getElementById('PerDireccion_' + posicion).value = "";

}
(async function () {
    await consltar_tipo_perfil();
    consultar_personas(_tipo_perfil.UsuPerId);
    asignar_control_fecha('PerFechanacimiento_-1');
    $('#PerNombres_-1').focus();
})();
