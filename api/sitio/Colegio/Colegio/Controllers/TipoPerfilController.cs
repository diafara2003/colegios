using Persona.Servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    public class TipoPerfilController : ApiController
    {
        [HttpGet]
        public IEnumerable<UsuarioPerfil> GerPerfiles()
        {

            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();

            return new TipoPersona().Get(_empresa.PerIdEmpresa);
        }

        [HttpPost]
        public IEnumerable<UsuarioPerfil> AddPerfil(UsuarioPerfil request)
        {
            
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();


            if (request.UsuEmpId < 0)
            {
                request.UsuEmpId = _empresa.PerIdEmpresa;
            }

            new TipoPersona().Add<UsuarioPerfil>(request);


            return new TipoPersona().Get(_empresa.PerIdEmpresa);
        }


        [HttpPut]
        public ResponseDTO UpdatePerfil(UsuarioPerfil request)
        {
            ResponseDTO obj = new ResponseDTO();
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();


            if (request.UsuEmpId < 0)
            {
                request.UsuEmpId = _empresa.PerIdEmpresa;
            }



            obj = new TipoPersona().UpdateEnvio(request);


            return obj;
        }


        [HttpDelete]
        public ResponseDTO DeletePerfil(int id)
        {
            return new TipoPersona().DeleteAutorizado(id);
        }
    }
}
