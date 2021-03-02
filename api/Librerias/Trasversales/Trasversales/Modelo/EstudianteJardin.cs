
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{

    [Table("EstudianteJardin", Schema = "Gargen")]
    public class EstudianteJardin
    {
        [Key]
        public int EstId { get; set; }
        public int EstEmpresa { get; set; }
        public string EstNombres { get; set; }
        public string EstApellidos { get; set; }
        public DateTime EstFechaNacimineto { get; set; }
        public string EstRC { get; set; }
        public string EstRH { get; set; }
        public string EstAseguradora { get; set; }
        public string EstAlergias { get; set; }
        public string EstMedicamentos { get; set; }
        public string EstObs { get; set; }
        public string EstDireccion { get; set; }
        public string EstTelefono { get; set; }
        public int Acudiente1 { get; set; }
        public int Acudiente2 { get; set; }
        public bool EstEstado { get; set; }

    }
}
