using System;
namespace Mensaje.Modelos
{
    public class BandejaEntradaDTO

    {
        public int MenId { get; set; }
        public string MenAsunto { get; set; }
        public string MenMensaje { get; set; }
        public string MenFecha { get; set; }
        public byte MenOkRecibido { get; set; }
        public byte MenBloquearRespuesta { get; set; }
        public string PerNombres { get; set; }
        public string PerApellidos { get; set; }
    }
}
