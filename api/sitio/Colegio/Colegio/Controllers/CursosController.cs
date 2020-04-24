using Curso.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    public class CursosController : ApiController
    {
        // GET: api/Cursos
        public IEnumerable<CursosCustom> Get()
        {
            return new Curso.Servicios.CursosBI().Get();
        }

        // POST: api/Cursos
        public CursosCustom Post(Cursos value)
        {
            return new Curso.Servicios.CursosBI().Save(value);
        }

        // PUT: api/Cursos/5
        public ResponseDTO Put(Cursos value)
        {
            return new Curso.Servicios.CursosBI().Update(value);
        }

        // DELETE: api/Cursos/5
        public ResponseDTO Delete(int id)
        {
            return new Curso.Servicios.CursosBI().Remove(id);
        }
    }
}
