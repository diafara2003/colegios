function consultarAPI(metodo, type, callback, error) {

    let _url = window.location.href.toLowerCase().split('views')[0];
    var myHeaders = new Headers();
    var Init = {
        method: type,
        headers: myHeaders,
        //mode: 'cors',
        //cache: 'default'
    };

    fetch(_url + 'api/' + metodo, Init)
  .then(function (response) {
      if (response.ok) {
          if (callback)
              return (response.json().then(c=> {
                  callback(c);
              }).cath(e=> {
                  if (error)
                      error(e);
              }));
      } else {
          if (error)
              error(response);
      }
  })
  .catch(function (myJson) {
      console.log(myJson);
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