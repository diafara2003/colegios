
using Clase.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
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


        public AisgnarMateriaClaseCustom Post(Trasversales.Modelo.Clases request)
        {

            return new Clases.Servicios.ClasesBI().Save(request);
        }

        [Route("materias")]
        [HttpGet]
        public IEnumerable<AsignarClases> GetMateriasGrado(int empresa, int curso = 0)
        {
            if (empresa<0)
            {
                var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
                var _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();

                empresa = _empresa.PerIdEmpresa;

            }

            return new Clases.Servicios.ClasesBI().GetMateriasGrado(empresa, curso);
        }


    }
}
