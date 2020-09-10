using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Accesos", Schema = "menu")]
   public class Accesos
    {
        [Key]
        public int AccesoId { get; set; }
        public int? PersonaID { get; set; }
        public int? PerfilID { get; set; }
        public int EmpresaID { get; set; }
        public int Opcion { get; set; }
    }
}
