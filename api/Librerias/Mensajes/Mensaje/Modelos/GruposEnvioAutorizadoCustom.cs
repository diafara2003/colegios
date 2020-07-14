using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mensaje.Modelos
{
    public class GruposEnvioAutorizadoCustom
    {
        public string Descripcion { get; set; }
        public int id { get; set; }
        public int idPersona { get; set; }
        public int idtipo { get; set; }
        public string Nombres { get; set; }
        public string Apellidos { get; set; }
    }
}
