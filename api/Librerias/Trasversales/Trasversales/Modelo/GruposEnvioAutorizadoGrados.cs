using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("GruposEnvioAutorizadoGrados", Schema = "msn")]
    public class GruposEnvioAutorizadoGrados
    {
        [Key]
        public int GrEnAuGraId { get; set; }

        public int GrEnAuGraGradoId { get; set; }
      
        public int GrEnAuGraPersonaId { get; set; }
    }
}

