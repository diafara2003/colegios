using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("Adjuntos")]
    public class Adjuntos
    {
        [Key]
        public int AjdId { get; set; }
        public int AdjIdEmpresa { get; set; }
        public int AdjIdUsuario { get; set; }
        public string AdjIdRuta { get; set; }
        public string AdjNombre { get; set; }
        public string AjdExtension { get; set; }
    }
}
