using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    public class TemporadaController : ApiController
    {
        // GET: api/Temporada
        public IEnumerable<Temporada> Get()
        {
            return new Temporadas.Servicios.TemporadaBI().Get();
        }

        // GET: api/Temporada/5
        //public string Get(int id)
        //{

        //}

        // POST: api/Temporada
        public Temporada Post(Temporada value)
        {
            return new Temporadas.Servicios.TemporadaBI().Save(value);
        }

        // PUT: api/Temporada/5
        public ResponseDTO Put(Temporada value)
        {
            return new Temporadas.Servicios.TemporadaBI().Update(value);
        }

        // DELETE: api/Temporada/5
        public ResponseDTO Delete(int id)
        {
            return new Temporadas.Servicios.TemporadaBI().Remove(id);
        }
    }
}
