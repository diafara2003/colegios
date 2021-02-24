using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{

    [Table("Estudiantes", Schema = "Gargen")]
    public  class Garden_Estudiantes
    {
        [Key]
        public int EstId { get; set; }
        public int EstEmpresa { get; set; }
        public string EstNombres { get; set; }
        public string EstApellidos { get; set; }
        public int EstGrupo { get; set; }
        public DateTime EstFechaNacimineto { get; set; }
        public string EstRC { get; set; }
        public string EstRH { get; set; }
        public string EstAseguradora { get; set; }
        public string EstAlergias { get; set; }
        public string EstMedicamentos { get; set; }
        public string EstObs { get; set; }
        public string EstDireccion { get; set; }
        public string EstTelefono { get; set; }
        public string EstJornada { get; set; }
        public bool EstAlimentacion { get; set; }
        public bool EsTrasporte { get; set; }
        public string EstNombreTransportador { get; set; }


    }
}
