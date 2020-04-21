using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("GruposEnvioDet", Schema = "msn")]
    public class GruposEnvioDet
    {
        [Key]
        public int GruEnvDetId { get; set; }
        public int GruEnvDetIdGrupo { get; set; }
    }
}
