using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Persona.Modelos
{
   public class AgregarEstudianteDTO
    {
        public IList<Trasversales.Modelo.Personas> acudientes { get; set; }
        public Trasversales.Modelo.EstudianteJardin estudiante { get; set; }
        public CustomGrupo grupo { get; set; }



    }


    public class BuscarAcudienteCorreoDTO {
        public string email { get; set; }
    }

    public class ResponseAgregarEstudianteDTO {
        public AgregarEstudianteDTO modelo { get; set; }
        public ResponseDTO resultado { get; set; }
    }
    public class ActualizarGrupoEstudianteDTO {

        public int id { get; set; }
        public int idgrupo { get; set; }
        public bool estado { get; set; }
    }
}
