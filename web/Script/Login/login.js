let _user = {};
function next() {

    $('.sleep-email').addClass('element-animation');
    setTimeout(() => {
        document.getElementById('lblcorreo').textContent = document.getElementById('txtusuario').value;
        $('.sleep-email').css('display', 'none')
        $('.sleep-password').css('display', 'block')
    }, 800)

}
function validar_nombre_usuario(_this) {
    $(_this).attr('disabled', 'disabled');
    let _documento = document.getElementById('txtusuario').value;
    let _clave = document.getElementById('txtclave').value;
    
    consultarAPI(`login/validacion?username=${_documento}&password=${_clave}`, 'GET', response => {
        $(_this).removeAttr('disabled');
        if (response != null) {
            localStorage.setItem("sesion", response.token);
            localStorage.setItem("colegio", JSON.stringify(response.usuario));
            window.location.href = window.location.href.toLowerCase().split('login.html')[0] + 'menu.html';
            
        } else {
            usuario_no_valido();
        }

    }, undefined, undefined,true);
}
function generar_token() {
    let _documento = document.getElementById('txtusuario').value;
    let _clave = document.getElementById('txtclave').value;
    consultarAPI(`login/token?username=${_documento}&password=${_clave}`, 'GET', response => {
        localStorage.setItem("sesion", response);
        localStorage.setItem("colegio", JSON.stringify(_user));
        window.location.href = window.location.href.toLowerCase().split('login')[0] + 'login/menu.html';
    });
}
function usuario_no_valido() {
    $('#Div_error').removeClass('d-none').addClass('show');
}
function validar_clave() {
    let _clave = document.getElementById('txtclave').value;

    if (_clave == _user.PerClave) return true;
    else return false;
}
function ingresar() {
    if (validar_clave())
        generar_token();
}
//https://bootsnipp.com/snippets/dldxB