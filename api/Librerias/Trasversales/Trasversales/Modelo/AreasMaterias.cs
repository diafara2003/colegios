using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
