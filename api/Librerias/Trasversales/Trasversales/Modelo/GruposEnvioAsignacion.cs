using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("GruposEnvioAsignacion", Schema = "msn")]
    public class GruposEnvioAsignacion
    {
        [Key]
        public int GrAsigId { get; set; }
        public int GrAsigPersonaId { get; set; }

        public int GrAsigGrupoEnvioId { get; set; }

    }
}

