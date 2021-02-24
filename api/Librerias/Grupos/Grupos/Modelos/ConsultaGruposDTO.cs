using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GruposGarden.Modelos
{
   public class ConsultaGruposDTO
    {
        public int IdGrupo { get; set; }
        public string Nombre { get; set; }
        public int Estudiantes { get; set; }
        public string Profesores { get; set; }
    }
}
