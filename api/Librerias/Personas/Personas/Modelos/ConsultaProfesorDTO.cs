using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persona.Modelos
{
    public class ConsultaProfesorDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
        public string apellido { get; set; }
        public string email { get; set; }
        public string celular { get; set; }
        public IEnumerable<CustomGrupo> grupos { get; set; }        

    }

    public class CustomGrupo {
        public int id { get; set; }
        public string nombre { get; set; }
    }
         
}
