using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("GruposEnvio", Schema = "msn")]
    public class GruposEnvio
    {
        [Key]
        public int GruEnvId { get; set; }
        public int GruEnvEmpId { get; set; }
        public int GruEnvTemporada { get; set; }
        [StringLength(2)]
        public string GruEnvTipo { get; set; }        
        [MaxLength(300)]
        public string GruEnvDescripcion { get; set; }
        public string GruEnvioColor { get; set; }
        public bool GruEstado { get; set; }
    }
}
