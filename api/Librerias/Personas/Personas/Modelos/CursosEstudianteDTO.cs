using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Persona.Modelos
{
   public class GradoEstudianteDTO
    {
        public Personas estudiante { get; set; }
        public Grados grado { get; set; }
        public Cursos curso { get; set; }
    }
}
