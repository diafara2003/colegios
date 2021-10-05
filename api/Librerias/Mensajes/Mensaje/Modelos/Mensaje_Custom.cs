using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Mensaje.Modelos
{
    public class Mensaje_Custom : Mensajes
    {
        public Personas usuario { get; set; }
        public IEnumerable<Adjuntos> adjuntos { get; set; }
        public int Estudiante { get; set; }
        public int bandeja { get; set; }

        public string EstNombres { get; set; }
        public string EstApellidos { get; set; }
    }
}
