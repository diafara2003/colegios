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
    let _dataform = $('form').serialize().split('&');
    let _documento = _dataform[0].split('=')[1];
    let _clave = _dataform[1].split('=')[1];



    if (_documento == '' || _clave == '') {
        is_valido = false;
        usuario_no_valido("Documento y contraseña obligatorios");
    }

    return is_valido;
}

function validar_enter(_event) {
    if (_event.keyCode == 13) $('#btnLogin').click();
}

async function validar_nombre_usuario(_this) {
    $('#btnLogin').append('<i class="fas fa-spinner fa-spin"></i>');

    if (!validar_datos()) {

        return false;
    }
    $(_this).attr('disabled', 'disabled');




    let _dataform = $('form').serialize().split('&');


    let _documento = _dataform[0].split('=')[1];
    let _clave = _dataform[1].split('=')[1];

    const response = await consultarAPI(`login/validacion`, 'POST', undefined, {
        username: _documento,
        password: _clave
    }, undefined, true);

    if (response != null) {
        localStorage.setItem("sesion", response.token);
        localStorage.setItem("colegio", JSON.stringify(response.usuario));
        window.location.href = window.location.href.toLowerCase().split('views')[0] + 'views/login/menu.html';

    } else {
        $('#btnLogin').find('i').remove();
        $('#btnLogin').text('Ingresar');
        usuario_no_valido("El documento o contraseña no son válidos");
    }
}

function generar_token() {
    let _documento = document.getElementById('txtusuario').value;
    let _clave = document.getElementById('txtclave').value;
    consultarAPI(`login/token`, 'POST', response => {
        localStorage.setItem("sesion", response);
        localStorage.setItem("colegio", JSON.stringify(_user));
        window.location.href = window.location.href.toLowerCase().split('login')[0] + 'login/menu.html';
    }, {
        username: _documento,
        password: _clave
    });
}

function usuario_no_valido(msn) {
    // document.getElementById('lblmensajewe').textContent = msn;
    $('#AlertMsn').removeClass('d-none').addClass('show');
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

$(document).ready(function() {
    $('form').submit(function(e) {
        e.preventDefault();
        // or return false;
    });
});