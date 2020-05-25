function next() {

    $('.sleep-email').addClass('element-animation');
    setTimeout(function (params) {
        document.getElementById('lblcorreo').textContent = document.getElementById('exampleInputEmail1').value;
        $('.sleep-email').css('display', 'none')
        $('.sleep-password').css('display', 'block')
    }, 800)
 
}