using Mensaje.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;

namespace Colegio.Controllers
{
    public class BandejaEntradaController : ApiController
    {
        // GET: api/BandejaEntrada
        public IEnumerable<BandejaEntradaDTO> Get()
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _usuario = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
            int usuario = _usuario.PerId;
            return new Mensaje.Servicios.BandejaEntrada().Get(usuario);
        }

        // GET: api/BandejaEntrada/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/BandejaEntrada
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/BandejaEntrada/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/BandejaEntrada/5
        public void Delete(int id)
        {
        }
    }
}
