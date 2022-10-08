
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("DocumentosEstudiante", Schema = "dbo")]
    public class DocumentosEstudiante
    {
        [Key]
        public int DocEstId { get; set; }
        public int DocEstIdDoc { get; set; }
        public int DocEstIdEmpresa { get; set; }
        public int DocEstIdAdj { get; set; }
    }
}
