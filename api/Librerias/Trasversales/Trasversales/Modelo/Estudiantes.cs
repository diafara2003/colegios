

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("Estudiantes", Schema = "DP")]
    public class Estudiantes
    {
        [Key]
        public int EstId { get; set; }
        public int EstIdPersona { get; set; }
        [MaxLength(50)]
        public string EstNombresEstudiante { get; set; }


        [MaxLength(50)]
        public string EstNombresMama { get; set; }
        [MaxLength(50)]
        public string EstApellidosMama { get; set; }
        [MaxLength(50)]
        public string EstTelefonoMama { get; set; }
        [MaxLength(50)]
        public string EstCorreoMama { get; set; }
        [MaxLength(50)]
        public string EstEmpresaMama { get; set; }
        [MaxLength(50)]
        public string EstCargoMama { get; set; }
        [MaxLength(50)]
        public string EstTeleEmpresaMama { get; set; }


        [MaxLength(50)]
        public string EstNombresPapa { get; set; }
        [MaxLength(50)]
        public string EstApellidosPapa { get; set; }
        [MaxLength(50)]
        public string EstTelefonoPapa { get; set; }
        [MaxLength(50)]
        public string EstCorreoPapa { get; set; }        
        [MaxLength(50)]
        public string EstEmpresaPapa { get; set; }
        [MaxLength(50)]
        public string EstCargoPapa { get; set; }
        [MaxLength(50)]
        public string EstTeleEmpresaPapa { get; set; }


        [MaxLength(50)]
        public string EstNombresAcuediente { get; set; }
        [MaxLength(50)]
        public string EstApellidosAcudiente { get; set; }
        [MaxLength(50)]
        public string EstTelefonoAcudiente { get; set; }        
        [MaxLength(50)]
        public string EstEmpresaAcudiente { get; set; }
        [MaxLength(50)]
        public string EstCargoAcudiente { get; set; }
        [MaxLength(50)]
        public string EstTeleEmpresaAcudiente { get; set; }

    }
}
