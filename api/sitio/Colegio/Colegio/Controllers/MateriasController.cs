
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    [RoutePrefix("materia")]
    public class MateriasController : ApiController
    {
        // GET: api/Materias
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Materias/5
        public string Get(int id)
        {
            return "value";
        }

        [Route("areasmaterias")]
        [HttpGet]
        public IEnumerable<AreasMaterias> GetAreaMAteria()
        {
            return new Materia.Servicios.AreaMateria().Get();
        }


        // POST: api/Materias
        public void Post([FromBody]string value)
        {
        }


        [Route("areasmaterias")]
        [HttpPost]
        public AreasMaterias PostAreaMAteria(AreasMaterias request)
        {
             return new Materia.Servicios.AreaMateria().Save(request);
        }





        // PUT: api/Materias/5
        public void Put(int id, [FromBody]string value)
        {
        }



        [Route("areasmaterias")]
        [HttpPut]
        public ResponseDTO PutAreaMAteria(AreasMaterias request)
        {
            return new Materia.Servicios.AreaMateria().Update(request);
        }


      


        // DELETE: api/Materias/5
        public void Delete(int id)
        {
        }


        [Route("areasmaterias")]
        [HttpDelete]
        public ResponseDTO DeleteAreaMAteria(int id)
        {
            return new Materia.Servicios.AreaMateria().Remove(id);
        }

    }
}
