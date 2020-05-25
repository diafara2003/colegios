using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("GruposEnvioAutorizadoAll", Schema = "msn")]
    public class GruposEnvioAutorizadoAll
    {
        [Key]
        public int GrEnAuAllId { get; set; }

        public int GrEnAuAllEmp { get; set; }
        
        public int GeEnAuAllTemporada { get; set; }
        
        public int GrEnAuAllPersonaId { get; set; }
    }
}

