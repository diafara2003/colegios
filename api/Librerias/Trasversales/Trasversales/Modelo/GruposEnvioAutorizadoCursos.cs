using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("GruposEnvioAutorizadoCursos", Schema = "msn")]
    public class GruposEnvioAutorizadoCursos
    {
        [Key]
        public int GrEnAuCurId { get; set; }

        public int GrEnAuCurCursoId { get; set; }
        
        public int GrEnAuCurPersonaId { get; set; }
    }
}

