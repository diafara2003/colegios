using BaseDatos.Contexto;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;
namespace Persona.Servicios
{
    public class TipoPersona
    {
        public IEnumerable<UsuarioPerfil> Get(int id = 0)
        {
            IEnumerable<UsuarioPerfil> objSeccion = new List<UsuarioPerfil>();
            ColegioContext objCnn = new ColegioContext();


            if (id == 0)
            {
                objSeccion = (from data in objCnn.usuario_perfi select data);
            }
            else
            {
                objSeccion = (from data in objCnn.usuario_perfi where data.UsuPerId == id select data);
            }

            return objSeccion;
        }
    }
}
