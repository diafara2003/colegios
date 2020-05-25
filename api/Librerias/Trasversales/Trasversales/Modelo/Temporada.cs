using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Trasversales.Modelo
{
    [Table("Temporada")]
    public class Temporada
    {
        [Key]
        public int TempId { get; set; }
        public int TempAno { get; set; }
        public byte TempEstado { get; set; }
    }
}
