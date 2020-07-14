using Grado.Servicios;
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
    [RoutePrefix("grado")]
    public class GradosController : ApiController
    {
        Personas _empresa = new Personas();


        public GradosController()
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
        }

        // GET: api/Grados
        public IEnumerable<Grados> Get()
        {
            return new GradosBI().Get(_empresa.PerIdEmpresa);
        }

        [Route("filtro")]
        public IEnumerable<Grados> GetGradoAC(string demo, string filter)
        {
            return new GradosBI().GetGradoAC(_empresa.PerIdEmpresa, filter: filter);
        }

        // POST: api/Grados
        public Grados Post(Grados value)
        {
            return new GradosBI().Save(value);
        }

        // PUT: api/Grados/5
        public ResponseDTO Put(Grados value)
        {


            return new GradosBI().Update(value);
        }

        // DELETE: api/Grados/5
        public ResponseDTO Delete(int id)
        {
            return new GradosBI().Remove(id);
        }
    }
}
