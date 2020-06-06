using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("CategoriaPerfil",Schema = "msn")]
    public    class CategoriaPerfil
    {
        [Key]
        public int CatPerId { get; set; }
        public int CatPerCategoria { get; set; }
        public int CatPerPerfil { get; set; }
    }
}
