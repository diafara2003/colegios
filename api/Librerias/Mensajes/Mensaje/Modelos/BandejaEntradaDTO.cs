﻿using System;
namespace Mensaje.Modelos
{
    public class BandejaEntradaDTO

    {
        public int MenId { get; set; }
        public int BanId { get; set; }
        public string MenAsunto { get; set; }
        public string MenMensaje { get; set; }
        public string MenFecha { get; set; }
        public byte MenOkRecibido { get; set; }
        public byte MenBloquearRespuesta { get; set; }
        public string PerNombres { get; set; }
        public string PerApellidos { get; set; }
        public string MenColor { get; set; }
        public DateTime? BanHoraLeido { get; set; }
        public byte BanOkRecibido { get; set; }
        public int BanClaseId { get; set; }
        public int BanDestacado { get; set; }
        public int MenCategoriaId { get; set; }
        public int TieneAdjuntos { get; set; }
        public string CatDescripcion { get; set; }

    }
}
