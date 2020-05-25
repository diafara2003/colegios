using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("GruposEnvioColores", Schema = "msn")]
    public class GruposEnvioColores
    {
        [Key]
        public int GrEnColorId { get; set; }
        public int GrEnColorEmp { get; set; }
        public int GrEnColorTipo { get; set; }
        [StringLength(50)]
        public string GrEnColorRGB { get; set; }
        [StringLength(50)]
        public string GrEnColorObs { get; set; }
        [StringLength(50)]
        public string GrEnColorBurbuja { get; set; }
    }
}
