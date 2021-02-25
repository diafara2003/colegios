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
        public IEnumerable<ConsultaProfesorDTO> profesores { get; set; }
    }


    public class ConsultaProfesorDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string email { get; set; }
        public string celular { get; set; }
     

    }
}
