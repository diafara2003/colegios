let iniciales = (nombre, apellidos) => {

    //apellidos = apellidos == "" ? nombre.substr(0, 3) : apellidos;
    return `${nombre.substr(0, 1).toUpperCase()}${(apellidos == "" || apellidos == null ? "" : apellidos.substr(0, 1).toUpperCase())}`;
}

function actualizar() {
    let _usuario = obtener_usuario_sesion();;
    _usuario.PerClave = document.getElementById('txtclave').value;
    if (clave_valida()) {
        consultarAPI('Personas', 'POST', () => {
            window.parent.mostrar_mensajes('', "Se actualizó la contraseña correctamente", 'success', true, false, false, 'Aceptar');
        }, _usuario);

    }
}
function limpiar_datos() {
    document.getElementById('txtclave').value = '';
    document.getElementById('txtclave2').value = '';
}
function clave_valida() {

    let _clave1 = document.getElementById('txtclave').value;
    let _clave2 = document.getElementById('txtclave2').value;

    if (_clave1 != _clave2) {
        mostrar_mensaje_validacion_error('Las contraseñas no coinciden');
        return false;
    }

    if (_clave1 == '') {
        mostrar_mensaje_validacion_error('La contraseña esta vacia');
        return false;
    }

    if (_clave2 == '') {
        mostrar_mensaje_validacion_error('Las contraseñas no coinciden');
        return false;
    }

    return true;
}
function mostrar_mensaje_validacion_error(mensaje) {
    window.parent.mostrar_mensajes('', mensaje, 'error', true, false, false, 'Aceptar');
}
function consultar_datos() {
    let _usuario = obtener_usuario_sesion();
    document.getElementById('iniciales').textContent = iniciales(_usuario.PerNombres, _usuario.PerApellidos);
    document.getElementById('nombre').textContent = `${_usuario.PerNombres} ${_usuario.PerApellidos}`;
}
(function () {
    consultar_datos();
})();

