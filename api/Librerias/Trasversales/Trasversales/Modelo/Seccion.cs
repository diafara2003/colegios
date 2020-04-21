using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Seccion", Schema = "menu")]
    public class Seccion
    {
        [Key]
        public int SeccionId { get; set; }
        public string SecDescripcion { get; set; }
        public string SecIcono { get; set; }

    }
}
