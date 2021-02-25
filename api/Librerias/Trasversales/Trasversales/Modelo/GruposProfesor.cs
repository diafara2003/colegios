using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{

    [Table("GruposProfesor", Schema = "Gargen")]
    public class GruposProfesor
    {
        [Key]
        public int GruProId { get; set; }
        public int GruProGrupo { get; set; }
        public int GruProProfesor { get; set; }
    }
}
