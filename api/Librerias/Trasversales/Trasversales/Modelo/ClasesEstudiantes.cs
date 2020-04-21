using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("ClasesEstudiantes")]
    public   class ClasesEstudiantes
    {
        [Key]
        public int ClaEstId { get; set; }
        public int ClaEstclaseId { get; set; }
        public int ClaEstEstudianteId { get; set; }
    }
}

