

document.querySelector('.custom-file-input').addEventListener('change', function (e) {
    var fileName = document.getElementById("myInput").files[0].name;
    var nextSibling = e.target.nextElementSibling
    nextSibling.innerText = `Nombre: ${fileName}`;
})


async function subirAdjunto() {

    let _url = window.location.href.toLowerCase().split('views')[0];
    var id = -1;

   //[{"codigo":"ENG","descripcion":"Ingles"},{"codigo":"ESP","descripcion":"Español"}]

    var formData = new FormData();
    var file = $('#myInput')[0];
    formData.append('file', file.files[0]);


    $.ajax({
        url: `${_url}api/Excel/ConvertirExcelToJson`,
        type: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('sesion')}`,
            'Accept': 'application/json',
        },
        data: formData,
        contentType: false,
        processData: false,
        success: async function (_response) {
            PintarImportaciones(_response);
        },
        error: function () {
            alert("Faild please try upload again");
        }
    });
}
function descargar_plantilla() {
    $('#descargar').attr('href', '../../formatos/AreaMateriaxlsx.xlsx');
    $('#descargar').click();
}
function renderizar_EXCEL() {

}
function PintarEncabezado(data) {

    let html_ = '';
    for (var i = 0; i < data.length; i++) {
        html_ += '<th>' + data[i] + '</th>';
    }
    $('#HeadTable').html(html_);

}
function PintarImportaciones(_sourc_) {
    let html_up = '';
    ExcelDatos = _sourc_;
    $('#DetalleTabla').html('');
    let Titulos_ = Object.keys(_sourc_[0]);
    PintarEncabezado(Titulos_);

    for (let i = 0; i < _sourc_.length; i++) {
        html_up += '<tr>';

        for (var j = 0; j < Titulos_.length; j++) {
            let valor = _sourc_[i][Titulos_[j]] == null ? '' : _sourc_[i][Titulos_[j]];
            html_up += '<td>' + valor + '</td>';
        }
        html_up += '</tr>';
    }
    $('#DetalleTabla').html(html_up);
}

