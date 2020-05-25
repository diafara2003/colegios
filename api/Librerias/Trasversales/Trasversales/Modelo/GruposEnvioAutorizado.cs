using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("GruposEnvioAutorizado", Schema = "msn")]
    public class GruposEnvioAutorizado
    {
        [Key]
        public int GruPerId { get; set; }
        public int GruPerGrupoId { get; set; }
        
        public int GruPerPersona { get; set; }
        
    }
}

