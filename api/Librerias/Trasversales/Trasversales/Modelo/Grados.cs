using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Grados")]
    public class Grados
    {
        [Key]
        public int GraId { get; set; }
        [MaxLength(20)]
        public string GraCodigo { get; set; }
        public int GraEmpId { get; set; }
        [MaxLength(50)]
        public string GraDescripcion { get; set; }
        public int GraOrden { get; set; }
    }
}
