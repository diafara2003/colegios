using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Curso.Modelos
{
  public  class ResponseCursoCustom
    {
        public ResponseCursoCustom()
        {
            this.curso = new CursosCustom();
            this.resultado = new ResponseDTO();
        }

        public CursosCustom curso { get; set; }
        public ResponseDTO   resultado { get; set; }

    }
}
