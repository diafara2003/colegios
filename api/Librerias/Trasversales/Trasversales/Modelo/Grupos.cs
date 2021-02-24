using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{

    [Table("Grupos", Schema = "Gargen")]
    public class Grupos
    {
        [Key]
        public int GrId { get; set; }
        public int GrEmpresa { get; set; }
        public int GrTemporada { get; set; }
        public string GrNombre { get; set; }
    }
}
