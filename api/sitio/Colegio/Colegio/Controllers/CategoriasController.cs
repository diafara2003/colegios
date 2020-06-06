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
    public class CategoriasController : ApiController
    {
        // GET: api/Categorias
        public IEnumerable<Categorias> Get()
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            return new Mensaje.Servicios.CategoriasBL().Get(identity);
        }


    }
}
