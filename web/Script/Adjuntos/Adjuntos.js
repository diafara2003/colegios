
/* show file value after file select */
document.querySelector('.custom-file-input').addEventListener('change', function (e) {
    var fileName = document.getElementById("myInput").files[0].name;
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = `Nombre: ${fileName}`;
})
