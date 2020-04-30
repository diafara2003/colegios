
using Clases.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Colegio.Controllers
{
    [RoutePrefix("clase")]
    public class ClasesController : ApiController
    {
        // GET: api/Clases
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        [Route("materias")]
        [HttpGet]
        public IEnumerable<AsignarClases> GetAsignarClases(int empresa,int grado=0)
        {
            return new Clases.Servicios.ClasesBI().GetAsignarClases(empresa, grado);
        }

        // GET: api/Clases/5
        public string Get(int id)
        {
            return "value";
        }

        // POST: api/Clases
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Clases/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Clases/5
        public void Delete(int id)
        {
        }
    }
}
