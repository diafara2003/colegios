using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Materia.Modelos
{
   public class ResponseMateriaCustom
    {
        public ResponseMateriaCustom()
        {
            this.materia = new MateriasCustom();
            this.resultado = new ResponseDTO();
        }

        public MateriasCustom materia { get; set; }
        public ResponseDTO resultado { get; set; }

    }
}
