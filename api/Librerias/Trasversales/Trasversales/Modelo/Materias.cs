using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Materias")]
    public class Materias
    {
        [Key]
        public int MatID { get; set; }
        [MaxLength(20)]
        public string MatCodigo { get; set; }
        public int MatEmpId { get; set; }
        public int MatTemporadaId { get; set; }
        public int MatGradoId { get; set; }
        public int MatAreaId { get; set; }
        [MaxLength(50)]
        public string MatDescripcion { get; set; }
        public byte MatEstado { get; set; }        
        public bool MatElectiva { get; set; }
    }
}
