using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Mensaje.Modelos
{
    public class CrearMensajeCustom
    {
        public List<Destinarario> destinatarios { get; set; }
        public Mensajes mensaje { get; set; }
        public List<int> adjuntos { get; set; }

    }

    public class Destinarario {
        public int id { get; set; }
        public int tipo { get; set; }

        public int estudiante { get; set; }
    }

    public class RecibidoDTO {
        public int id { get; set; }
    }
}
