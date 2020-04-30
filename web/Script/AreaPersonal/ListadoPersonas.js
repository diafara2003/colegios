let _tipo_perfil = {}, data_personas = [];

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
            data_personas.push(response);
            let nuevo_tr = renderizar_tr(response);

            $('#tbodyDatos').append(nuevo_tr);
            limpiar_registro_personas(-1);
            $('#PerNombres_-1').focus();
            eventos_listado_personas();
            window.parent.mostrar_mensajes('', 'Se guardaron los cambios correctamente.', 'success', true, false, false, 'Aceptar');

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

    if (document.getElementById('PerRH_' + posicion).tagName.toLowerCase() == 'div') {
        _data.PerRH = document.getElementById('PerRH_' + posicion).textContent;
    } else {
        _data.PerRH = document.getElementById('PerRH_' + posicion).value;
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
(function () {
    consltar_tipo_perfil();
    asignar_control_fecha('PerFechanacimiento_-1');
    $('#PerNombres_-1').focus();
})();
