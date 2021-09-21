using Colegio.Autenticacion;
using Colegio.Models;
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

    [RoutePrefix("login")]
    public class TokenController : ApiController
    {
        [HttpGet]

        public IHttpActionResult EchoUser()
        {
            var identity = Thread.CurrentPrincipal.Identity;
            return Ok($" IPrincipal-user: {identity.Name} - IsAuthenticated: {identity.IsAuthenticated}");
        }


        [AllowAnonymous]
        [HttpPost]
        [Route("validacion")]
        public AutenticacionDTO GetLogin(LoginDTO request)
        {
            AutenticacionDTO objresponse = new AutenticacionDTO();

            objresponse.usuario = CheckUser(request.username, request.password);

            if (objresponse.usuario != null)
            {
                objresponse.token = JwtManager.GenerateToken(objresponse.usuario);
            }
            else
            {
                objresponse = null;
            }

            return objresponse;
        }


        [HttpPost]
        [Route("tokenFCM")]
        public ResponseDTO PostTokenPhone(LoginPhone request)
        {

            ResponseDTO objresponse = new ResponseDTO();
            new Persona.Servicios.PersonasBI().CreartokenPhone(request);

            return objresponse;
        }


        public Personas CheckUser(string username, string password)
        {
            var persona = new Persona.Servicios.PersonasBI().GetUser(username, password);

            if (persona.PerApellidos == null) persona.PerApellidos = "";

            return persona;
        }
    }
}
