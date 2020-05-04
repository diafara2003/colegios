
using Materia.Modelos;
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
        public IEnumerable<Materias> Get(int empresa, int grado)
        {
            return new Materia.Servicios.MateriaBL().Get(empresa, grado);
        }

        public ResponseMateriaCustom Post(Materias materias)
        {
            return new Materia.Servicios.MateriaBL().Save(materias);
        }

        public ResponseDTO Put(Materias materias)
        {
            return new Materia.Servicios.MateriaBL().Update(materias);
        }

        public ResponseDTO Delete(int id)
        {
            return new Materia.Servicios.MateriaBL().Remove(id);
        }

        [Route("areasmaterias")]
        [HttpGet]
        public IEnumerable<AreasMaterias> GetAreaMAteria()
        {
            return new Materia.Servicios.AreaMateria().Get();
        }


        [Route("areasmaterias")]
        [HttpPost]
        public AreasMaterias PostAreaMAteria(AreasMaterias request)
        {
            return new Materia.Servicios.AreaMateria().Save(request);
        }



        [Route("areasmaterias")]
        [HttpPut]
        public ResponseDTO PutAreaMAteria(AreasMaterias request)
        {
            return new Materia.Servicios.AreaMateria().Update(request);
        }



        [Route("areasmaterias/eliminar")]
        [HttpGet]
        public ResponseDTO GetEliminarAreaMAteria(int id)
        {
            return new Materia.Servicios.AreaMateria().Remove(id);
        }

    }
}
