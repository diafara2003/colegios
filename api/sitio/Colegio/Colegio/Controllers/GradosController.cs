using Grado.Servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    public class GradosController : ApiController
    {
        // GET: api/Grados
        public IEnumerable<Grados> Get()
        {
            return new GradosBI().Get();
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
