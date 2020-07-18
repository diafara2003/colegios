using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("AdjuntosMensaje", Schema = "msn")]
    public class AdjuntosMensaje
    {
        [Key]
        public int AdjMenId { get; set; }
        public int AdjMenAdjuntoId { get; set; }
        public int AdjMsnMensajeId { get; set; }
    }
}
