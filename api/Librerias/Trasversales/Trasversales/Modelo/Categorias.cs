using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("Categorias", Schema = "msn")]
    public class Categorias
    {
        [Key]
        public int CatId { get; set; }
        public int CatEmpresaId { get; set; }
        [StringLength(50)]
        public string CatDescripcion { get; set; }
        [StringLength(50)]
        public string CatColor { get; set; }
    }
}
