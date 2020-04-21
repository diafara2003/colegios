using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("CursoEstudiantes")]
    public class CursoEstudiantes
    {
        [Key]
        public int CurEstId { get; set; }
        public int CurEstCursoId { get; set; }
        public int CurEstEstudianteId { get; set; }
    }
}
