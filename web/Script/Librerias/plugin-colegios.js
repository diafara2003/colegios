﻿async function consultarAPI(metodo, type, callback, _data, error, AllowAnonymous) {
    if (AllowAnonymous == undefined && localStorage.getItem('sesion') == null || localStorage.getItem('sesion') == "") {
        localStorage.clear();
        window.parent.location.href = window.location.href = window.location.href.toLowerCase().split('views')[0];
        return;
    }

    var Init = {
        method: type,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            //'Authorization': `Bearer ${localStorage.getItem('sesion')}`
        },
        //mode: 'cors',
        //cache: 'default'
    };
    if (AllowAnonymous == undefined)
        Init.headers.Authorization = `Bearer ${localStorage.getItem('sesion')}`

    if (_data != undefined) {
        Init.body = JSON.stringify(_data);
    }


    let _url = window.location.href.toLowerCase().split('views')[0];

    try {
        const response = await fetch(`${_url}api/${metodo}`, Init);

        if (response.ok) {
            const _result = await response.json();

            if (callback != undefined) {
                callback(_result);
            }
            return _result;
        }
        else {
            paginar_sesion();
        }
    } catch (e) {

    }
}
function paginar_sesion() {
    localStorage.clear();
    window.location.href = window.location.href.toLowerCase().split('views')[0];
}
function GetDateNow() {
    return moment(new Date()).format("DD/MM/YYYY");
}
function mostrar_panel() {


    if ($('.panel').css('display') == 'none') {
        $('.panel').show('slow')
    }
    else {
        $('.panel').hide('slow')
    }

}
function selectText(_this) {
    var doc = document;
    var element = _this;
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
function only_number(evt) {

    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;

    return true;
}
function fixed_table_scroll(name_table) {
    $('#' + name_table).floatThead();

    return;

}
function Get_query_string(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
function validar_correo(str) {
    var patron = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/
    if (patron.test(str)) {
        return true;
    } else {
        return false;
    }
}
function autocomplete(id_input, _api, GetValueProperty, SecondProperty, placeholder, fn_selected) {

    if (localStorage.getItem('sesion') == null || localStorage.getItem('sesion') == "") {
        localStorage.clear();
        paginar_sesion();
        return;
    }

    let _url = window.location.href.toLowerCase().split('views')[0];


    var options = {
        url: function (whiting) {
            return `${_url}api/${_api}&filter=${whiting}`;
        },
        getValue: GetValueProperty,
        requestDelay: 500,
        placeholder: placeholder,
        list: {
            maxNumberOfElements: 10,
            onChooseEvent: function () {
                let _selected = $(`#${id_input}`).getSelectedItemData()
                $(`#${id_input}`).attr('result', JSON.stringify(_selected));

                fn_selected(_selected, `#${id_input}`);
            },
            match: {
                enabled: false
            },
        }
    };
    options.ajaxSettings = {
        dataType: "json",
        method: "GET",
        data: { dataType: "json" },
        headers: { 'Authorization': `Bearer ${localStorage.getItem('sesion')}` }
    }

    if (SecondProperty != undefined) {
        options.template = {
            type: "description",
            fields: {
                description: SecondProperty
            }
        }
    }

    options.preparePostData = function (data) {
        data.phrase = $(`#${id_input}`).val();
        return data;
    };
    //http://easyautocomplete.com/guide#sec-template-links

    $(`#${id_input}`).on('focus', function (e) {
        $(this).removeAttr('result');
    })

    $(`#${id_input}`).easyAutocomplete(options);
}
function IsNull(data) {
    return data == null ? "" : data;
}
function asignar_control_fecha(id) {
    $('#' + id).datepicker({
        format: "dd/mm/yyyy",
        maxViewMode: 2,
        todayBtn: "linked",
        language: "es",
        autoclose: true,
        todayHighlight: true,
        toggleActive: true
    });
    $('.input-group-append').click(function () {
        $(event.target).closest('div.input-group').find('input').focus();
    });
}
function obtener_session() {
    let _usuario = obtener_usuario_sesion();
    var _sesion = {};
    _sesion.idusuario = _usuario.PerId;
    _sesion.empresa = _usuario.PerIdEmpresa;
    _sesion.temporada = 1;
    _sesion.tipo = _usuario.PerTipoPerfil;

    return _sesion
}
function obtener_usuario_sesion() {
    return JSON.parse(localStorage.getItem('colegio'));
}
function cerrar_session() {
    localStorage.clear();
    window.location.href = window.location.href.toLowerCase().split('views')[0] ;
}
function groupBy(arr, prop) {
    const map = new Map(Array.from(arr, obj => [obj[prop], []]));
    arr.forEach(obj => map.get(obj[prop]).push(obj));
    return Array.from(map.values());
}
function random_data(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
let _get_icono = (_extencion) => {
    let _icono = '';
    switch (_extencion.toLocaleLowerCase().replace('.', '')) {

        case 'doc':
        case 'docx':
            _icono = '../../Img/word.svg'; break;
        case 'xls':
        case 'xlsx':
            _icono = '../../Img/excel.svg'; break;
        case 'pdf': _icono = '../../Img/pdf.svg'; break;
        case '.zip':
        case '.rar': _icon = '../../Img/comprimido.svg'; break;
        default:
            _icono = '../../Img/imagen.svg'; break;
    }

    return _icono;
}

document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

document.addEventListener('touchmove', function (event) {
    event = event.originalEvent || event;
    if (event.scale > 1) {
        event.preventDefault();
    }
}, false);