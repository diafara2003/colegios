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