using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Salones")]
    public class Salones
    {
        [Key]
        public int SalId { get; set; }
        [MaxLength(20)]
        public string SalCodigo { get; set; }
        [MaxLength(50)]
        public string SalDescripcion { get; set; }
    }
}
