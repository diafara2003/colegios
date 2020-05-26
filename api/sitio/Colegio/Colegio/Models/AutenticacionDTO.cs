using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Trasversales.Modelo;

namespace Colegio.Models
{
    public class AutenticacionDTO
    {
        public Personas usuario { get; set; }
        public string token { get; set; }
    }
}