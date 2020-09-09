using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mensaje.Modelos
{
    public class VerMensajeDTO
    {
        public Mensaje_Custom _mensaje { get; set; }
        public VerMensajeDTO replicas { get; set; }
    }
}
