using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Empresas")]
    public class Empresas
    {
        [Key]
        public int EmpId { get; set; }
        [MaxLength(100)]
        public string EmpNombre { get; set; }
        [MaxLength(100)]
        public string EmpDireccion { get; set; }
        [MaxLength(100)]
        public string EmpLogo { get; set; }
        [MaxLength(500)]
        public string EmpNit { get; set; }        
        public byte EmpEstado { get; set; }
    }
}
