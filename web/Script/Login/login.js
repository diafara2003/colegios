let _user = {};
function next() {

    $('.sleep-email').addClass('element-animation');
    setTimeout(() => {
        document.getElementById('lblcorreo').textContent = document.getElementById('txtusuario').value;
        $('.sleep-email').css('display', 'none')
        $('.sleep-password').css('display', 'block')
    }, 800)

}
function validar_datos() {

    let is_valido = true;

    let _documento = document.getElementById('txtusuario').value;
    let _clave = document.getElementById('txtclave').value;



    if (_documento == '' || _clave == '') {
        is_valido = false;
        usuario_no_valido("Documento y contraseña obligatorios");
    }

    return is_valido;
}
function validar_nombre_usuario(_this) {
    if (!validar_datos()) {
        return;
    }
    $(_this).attr('disabled', 'disabled');

    _this.textContent = "";
    $(_this).append('<i style="color:#212529;font-size:20px" class="fas fa-circle-notch fa-spin mr-2"></i>');


    let _documento = document.getElementById('txtusuario').value;
    let _clave = document.getElementById('txtclave').value;

    consultarAPI(`login/validacion?username=${_documento}&password=${_clave}`, 'GET', response => {
        $(_this).removeAttr('disabled');
        if (response != null) {
            localStorage.setItem("sesion", response.token);
            localStorage.setItem("colegio", JSON.stringify(response.usuario));
            window.location.href = window.location.href.toLowerCase().split('views')[0] + 'views/login/menu.html';

        } else {
            _this.textContent = "Ingresar";
            $(_this).find('i').remove();
            usuario_no_valido("El documento o contraseña no son válidos");

        }

    }, undefined, undefined, true);
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
function usuario_no_valido(msn) {
    document.getElementById('lblmensajewe').textContent = msn;
    $('#Div_error').removeClass('d-none').addClass('show');
}
function validar_clave() {
    let _clave = document.getElementById('txtclave').value;

    if (_clave == _user.PerClave) return true;
    else return false;
}
function ingresar(_this) {
    _this.textContent = "";
    $(_this).append('<i style="color:#212529;font-size:20px" class="fas fa-circle-notch fa-spin mr-2"></i>');
    //if (validar_clave())
    //    generar_token();
}
//https://bootsnipp.com/snippets/dldxB