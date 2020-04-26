function consultarAPI(metodo, type, callback, _data, error, ) {

    var Init = {
        method: type,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        //mode: 'cors',
        //cache: 'default'
    };

    if (_data != undefined) {
        Init.body = JSON.stringify(_data);
    }


    let _url = window.location.href.toLowerCase().split('views')[0];

    fetch(_url + 'api/' + metodo, Init)
        .then(res => {
            return res.json();
        })
        .then(data => {
            callback(data);
        });


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
    console.log(_this, element);
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
    var options = {
        url: function (whiting) {
            return `http://localhost/colegios/api/${_api}&filter=${whiting}`;
        },
        getValue: GetValueProperty,
        requestDelay: 500,
        placeholder: placeholder,
        list: {
            maxNumberOfElements: 10,
            onClickEvent: function () {
                let _selected = $(`#${id_input}`).getSelectedItemData()
                fn_selected(_selected);
            },
            match: {
                enabled: false
            },
        }
    };

    if (SecondProperty != undefined) {
        options.template = {
            type: "description",
            fields: {
                description: SecondProperty
            }
        }
    }
    //http://easyautocomplete.com/guide#sec-template-links
    $(`#${id_input}`).easyAutocomplete(options);
}