using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Clases")]
    public class Clases
    {
        [Key]
        public int Claid { get; set; }
        public int ClaEmpId { get; set; }
        public Int16 ClaTemporada { get; set; }
        [MaxLength(20)]
        public string ClaCodigo { get; set; }
        public int ClaMateriaId { get; set; }
        public int? ClaSalonId { get; set; }
        public int ClaCursoId { get; set; }
        public int? ClaProfesor { get; set; }
        [MaxLength]
        public string ClaObservacion { get; set; }
    }
}
