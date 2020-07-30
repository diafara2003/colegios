
using Persona.Modelos;
using Persona.Servicios;
using System.Collections.Generic;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    [RoutePrefix("Persona")]
    public class PersonasController : ApiController
    {

        [HttpGet]
        [Route("perfiles")]
        public IEnumerable<UsuarioPerfil> GetUsuariosPerfiles()
        {

            return new PersonasBI().GetPerfi();
        }

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
            if (request.PerId <= 0)
            {
                if (string.IsNullOrEmpty(request.PerClave))
                {
                    request.PerClave = request.PerNombres.ToLower().Substring(0, 2) +
                        request.PerApellidos.ToLower().Substring(0, 2) +
                        request.PerDocumento.ToLower().Substring(0, 4)
                        ;
                }
                return new PersonasBI().Save(request);
            }
            else
            {
                new PersonasBI().UpdateEnvio<Personas>(request);
                return request;
            }

        }

        // PUT: api/Personas/5
        public ResponseDTO Put(Personas request)
        {
            return new PersonasBI().UpdateEnvio<Personas>(request);
        }

        // DELETE: api/Personas/5
        public ResponseDTO Delete(int id)
        {
            return new PersonasBI().Remove(id);
        }


        [Route("grado/estudiantes")]
        [HttpGet]
        public IEnumerable<GradoEstudianteDTO> GetCursosEstudiante(int grado=-1)
        {
            return new PersonasBI().GetCursosEstudiante(grado);
        }

        [Route("estudiante")]
        [HttpGet]
        public Estudiantes SaveEstudiante(int id)
        {
            return new PersonasBI().GetdatoEstudiante(id);
        }

        [Route("profesor")]
        [HttpGet]
        public Profesores SaveProfesor(int id)
        {
            return new PersonasBI().GetdatoProfesor(id);

        }




        [Route("profesor")]
        [HttpPost]
        public Profesores SaveProfesor(Profesores request)
        {
            if (request.ProfId == 0)
            {
                request.ProfId = -1;
            }

            if (request.ProfId == -1)
            {
                return new PersonasBI().Save(request);
            }
            else
            {
                new PersonasBI().UpdateEnvio(request);
                return request;
            }
        }


        [Route("estudiante")]
        [HttpPost]
        public Estudiantes SaveEstudiante(Estudiantes request)
        {
            if (request.EstId == 0)
            {
                request.EstId = -1;
            }

            if (request.EstId == -1)
            {
                return new PersonasBI().Save(request);
            }
            else
            {
                new PersonasBI().UpdateEnvio(request);
                return request;
            }
        }

    }
}
