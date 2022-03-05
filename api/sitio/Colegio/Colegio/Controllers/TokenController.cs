using Colegio.Autenticacion;
using Colegio.Models;
using Persona.Servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web;
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
        [HttpGet]
        [Route("enviarclave")]
        public IHttpActionResult GetClave(string id, int empresa)
        {
            var usuario = new Persona.Servicios.PersonasBI().RecuperarUsuario(id,empresa);

            if (usuario != null)
            {

                string ruta = HttpContext.Current.Server.MapPath("~/TemplateMail/Education.html");
                string ruta_icono = HttpContext.Current.Server.MapPath("~/img");

                var Datosempresa = new Empresa.Servicios.EmpresaBL().Get(empresa).Single();

                return Ok(new PersonasBI().EnviarCorreo(Datosempresa.empresa.EmpNombre,usuario.PerId, ruta, ruta_icono));
            }
            else
            {
                return Ok(new ResponseDTO()
                {
                    codigo = -1,
                    respuesta = "No se encontro el usuario"
                });
            }
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("validacion")]
        public IHttpActionResult GetLogin(LoginDTO request)
        {
            AutenticacionDTO objresponse = new AutenticacionDTO();

            try
            {

                objresponse.usuario = CheckUser(request.username, request.password);

                if (objresponse.usuario != null)
                {
                    objresponse.token = JwtManager.GenerateToken(objresponse.usuario);
                }
                else
                {
                    objresponse = null;
                }

                return Ok(objresponse);
            }
            catch (Exception x)
            {

                return InternalServerError(x);
            }

        }

        [AllowAnonymous]
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
