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

    [RoutePrefix("salon")]
    public class SalonesController : ApiController
    {
        // GET: api/Salones
        public IEnumerable<Salones> Get()
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
            return new Salon.Servicios.SalonesBI().Get(_empresa.PerIdEmpresa);
        }
        [Route("filtro")]
        public IEnumerable<Salones> GetSalonesfiltro(string id,string filter = "")
        {

            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();

            return new Salon.Servicios.SalonesBI().Get(_empresa.PerIdEmpresa,filter);
        }

        public Salones Post(Salones value)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();

            value.SalEmpresaId = _empresa.PerIdEmpresa;


            return new Salon.Servicios.SalonesBI().Save(value);
        }

        // PUT: api/Salones/5
        public ResponseDTO Put(Salones value)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();

            value.SalEmpresaId = _empresa.PerIdEmpresa;

            return new Salon.Servicios.SalonesBI().Update(value);
        }

        // DELETE: api/Temporada/5
        public ResponseDTO Delete(int id)
        {
            return new Salon.Servicios.SalonesBI().Remove(id);
        }
    }
}
