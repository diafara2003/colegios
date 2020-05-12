using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("GrupoEnvioAsignacion", Schema = "msn")]
    public  class GrupoEnvioAsignacion
    {
        [Key]
        public int GruAsigId { get; set; }
        public int GruAsigIdPersona { get; set; }
        public int GruAsigIdGrupoEnvio { get; set; }
    }
}
