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
        public IEnumerable<UsuarioPerfil> Get(int empresa, int id = 0)
        {
            IEnumerable<UsuarioPerfil> objSeccion = new List<UsuarioPerfil>();
            ColegioContext objCnn = new ColegioContext();


            if (id == 0)
            {
                objSeccion = (from data in objCnn.usuario_perfi where (data.UsuEmpId == null ? empresa : data.UsuEmpId) == empresa select data);
            }
            else
            {
                objSeccion = (from data in objCnn.usuario_perfi where data.UsuPerId == id select data);
            }

            return objSeccion;
        }


        public ResponseDTO UpdateEnvio(UsuarioPerfil modelo)
        {
            ColegioContext objCnn = new ColegioContext();
            ResponseDTO objresponse = new ResponseDTO();

            int categorias = objCnn.categorias_perfil.Count(c => c.CatPerPerfil == modelo.UsuPerId);
            if (categorias > 0 && !modelo.UsuPerEstado)
            {
                objresponse.codigo = -1;
                objresponse.respuesta = string.Format("No se puede cambiar el estado porque tiene asigando {0} categorías de envío.", categorias);
                return objresponse;
            }

            objCnn.Entry(modelo).State = EntityState.Modified;

            objCnn.SaveChanges();


            objresponse.codigo = 1;
            objresponse.respuesta = "";
            return objresponse;
        }

        public T Add<T>(T modelo) where T : class
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(modelo).State = EntityState.Added;

            objCnn.SaveChanges();
            return modelo;
        }

        public ResponseDTO DeleteTipoPerfil(int id)
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            Trasversales.Modelo.UsuarioPerfil modelo = objCnn.usuario_perfi.Find(id);

            int categorias = objCnn.categorias_perfil.Count(c => c.CatPerPerfil == id);

            if (categorias > 0)
            {
                objresponse.codigo = -1;
                objresponse.respuesta = string.Format("No se puede eliminar el perfil de usuario porque tiene asigando {0} categorías de envío.", categorias);
                return objresponse;
            }


            int usuarios_perfil = objCnn.personas.Count(c => c.PerTipoPerfil == id);

            if (usuarios_perfil > 0)
            {
                objresponse.codigo = -1;
                objresponse.respuesta = string.Format("No se puede eliminar el perfil de usuario porque tiene asigando {0} usuarios.", categorias);
                return objresponse;
            }

            objCnn.Entry(modelo).State = EntityState.Deleted;

            objCnn.SaveChanges();

            objresponse.codigo = 1;
            objresponse.respuesta = "";
            return objresponse;
        }


    }
}
