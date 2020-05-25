
using Persona.Servicios;
using System.Collections.Generic;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    [RoutePrefix("Persona")]
    public class PersonasController : ApiController
    {
        // GET: api/Personas
        public IEnumerable<Personas> Get(int id = 0, string filter = "", int tipo = 0)
        {
            if (tipo != 0)
            {
                return new PersonasBI().Get(filter, tipo);
            }
            return new PersonasBI().Get(id);
        }

        [Route("estudiantes/sinasignar")]
        public IEnumerable<Personas> Get(int curso = 0)
        {

            return new PersonasBI().GetEstudiantesSinAsignar(curso);
        }

        
        [Route("Tipos")]
        public IEnumerable<UsuarioPerfil> GetTipoPersona(int id = 0)
        {
            return new TipoPersona().Get(id);
        }

        // POST: api/Personas
        public Personas Post(Personas request)
        {
            return new PersonasBI().Save(request);
        }

        // PUT: api/Personas/5
        public ResponseDTO Put(Personas request)
        {
            return new PersonasBI().Update(request);
        }

        // DELETE: api/Personas/5
        public ResponseDTO Delete(int id)
        {
            return new PersonasBI().Remove(id);
        }
    }
}
