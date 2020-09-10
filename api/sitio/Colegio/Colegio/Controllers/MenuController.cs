using Menu.Servicios;
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
    public class MenuController : ApiController
    {
        [HttpGet]
        public IHttpActionResult GetMenu()
        {
            try
            {
                var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
                var _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
                return Ok(new MenuBI().Get(_empresa.PerIdEmpresa,_empresa.PerId,_empresa.PerTipoPerfil));
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }

        }
    }
}
