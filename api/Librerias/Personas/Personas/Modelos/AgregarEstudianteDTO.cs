﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Persona.Modelos
{
   public class AgregarEstudianteDTO
    {
        public Trasversales.Modelo.Personas persona { get; set; }
        public Trasversales.Modelo.Estudiantes estudiante { get; set; }
        public CustomGrupo grupo { get; set; }

    }
}
