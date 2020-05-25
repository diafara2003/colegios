using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("TipoMensaje", Schema ="msn")]
    public class TipoMensaje
    {
        [Key]
        public int TipMenId { get; set; }
        [StringLength(50)]
        public string TipMenDesc { get; set; }
        [StringLength(50)]
        public string TpMenColor { get; set; }
    }
}
