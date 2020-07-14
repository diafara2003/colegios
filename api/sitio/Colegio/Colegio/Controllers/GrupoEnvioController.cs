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
    public class GrupoEnvioController : ApiController
    {

        public IEnumerable<GruposEnvioColores> Get()
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            var _empresa = new Persona.Servicios.PersonasBI().Get(id: identity);
            return new Mensaje.Servicios.GruposBL().GetEnvioColores(_empresa.FirstOrDefault().PerIdEmpresa);
        }
    }
}
