
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("DocumentosColegio", Schema = "dbo")]
    public class DocumentosColegio
    {
        [Key]
        public int DocId { get; set; }
        public int DocIdEmpresa { get; set; }
        public string DocTexto { get; set; }

    }
}
