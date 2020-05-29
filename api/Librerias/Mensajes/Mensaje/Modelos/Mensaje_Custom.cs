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
    }
}
