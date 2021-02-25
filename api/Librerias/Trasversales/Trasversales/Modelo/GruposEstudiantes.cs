using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{

    [Table("GruposEstudiantes", Schema = "Gargen")]
    public class GruposEstudiantes
    {
        [Key]
        public int GruEstId { get; set; }
        public int GruEstGrupo { get; set; }
        public int GruEstEstudiante { get; set; }
    }
}
