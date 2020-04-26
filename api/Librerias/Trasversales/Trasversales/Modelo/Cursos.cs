using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Cursos")]
    public class Cursos
    {
        [Key]
        public int CurId { get; set; }
        public int CurEmpId { get; set; }
        public int CurTemporada { get; set; }
        public int CurGrado { get; set; }
        [MaxLength(20)]
        public string CurCodigo { get; set; }
        [MaxLength(50)]
        public string CurDescripcion { get; set; }
        public int? CurTutor { get; set; }
        public int? CurAuxiliar { get; set; }
    }
}
