
using Persona.Modelos;
using Persona.Servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
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


        [HttpGet]
        [Route("all")]
        public IEnumerable<CustomPersonasDTO> GetAllUser(int tipo = 0)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            var _persona = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
            return new PersonasBI().GetAll(_persona.PerIdEmpresa, tipo);
        }

        // GET: api/Personas
        public IEnumerable<Personas> Get(int id = 0, string filter = "", int tipo = 0)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            var _persona = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
            if (tipo != 0)
            {
                return new PersonasBI().Get(_persona.PerIdEmpresa, filter, tipo);
            }
            return new PersonasBI().Get(empresa: _persona.PerIdEmpresa, id:id);
        }

        [Route("estudiantes/sinasignar")]
        public IEnumerable<Personas> Get(int curso = 0)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            var _persona = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
            return new PersonasBI().GetEstudiantesSinAsignar(curso, _persona.PerIdEmpresa);
        }


        [Route("Tipos")]
        public IEnumerable<UsuarioPerfil> GetTipoPersona(int id = 0)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            var _persona = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
            return new TipoPersona().Get(_persona.PerIdEmpresa, id: id);
        }

        // POST: api/Personas
        public ResponseDTO Post(Personas request)
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
                return new PersonasBI().SavePersona(request);
            }
            else
            {
                new PersonasBI().UpdateEnvio<Personas>(request);
                return new ResponseDTO() { codigo = 1, respuesta = "" };
            }

        }

        // PUT: api/Personas/5
        public ResponseDTO Put(Personas request)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            var _persona = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();

            request.PerIdEmpresa = _persona.PerIdEmpresa;

            return new PersonasBI().UpdateEnvio<Personas>(request);
        }

        // DELETE: api/Personas/5
        public ResponseDTO Delete(int id)
        {
            return new PersonasBI().Remove(id);
        }


        [Route("grado/estudiantes")]
        [HttpGet]
        public IEnumerable<GradoEstudianteDTO> GetCursosEstudiante(int grado = -1)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            var _persona = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
            return new PersonasBI().GetCursosEstudiante(grado,_persona.PerIdEmpresa);
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
