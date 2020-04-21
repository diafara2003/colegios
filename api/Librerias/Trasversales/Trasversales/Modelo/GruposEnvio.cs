using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("GruposEnvio", Schema = "msn")]
    public class GruposEnvio
    {
        [Key]
        public int GruEnvId { get; set; }
        public int GruEnvEmpId { get; set; }
        public int GruEnvTemporada { get; set; }
        public int GruEnvProfesor { get; set; }
        [MaxLength(300)]
        public string GruEnvDescripcion { get; set; }
    }
}
