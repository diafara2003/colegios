using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Opcion", Schema = "menu")]
    public class Opcion
    {
        [Key]
        public int OpcionId { get; set; }
        public string OpDescripcion { get; set; }
        public int OpSeccionId { get; set; }
        public string OpRuta { get; set; }
        public string OcIcono { get; set; }

    }
}
