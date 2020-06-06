using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{

    [Table("AreasMaterias")]
    public  class AreasMaterias
    {
        [Key]
        public int ArMaId { get; set; }
        [MaxLength(20)]
        public string ArMaCodigo { get; set; }
        [MaxLength(50)]
        public string ArMaDescripcion { get; set; }
    }
}
