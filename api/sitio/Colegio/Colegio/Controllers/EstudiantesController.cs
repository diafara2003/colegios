using Persona.Modelos;
using Persona.Servicios;
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
    public class EstudiantesController : ApiController
    {


        [HttpGet]
        public AgregarEstudianteDTO Get(int id)
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            var _result = new EstudiantesBL<Estudiantes>().GetEspecific(_empresa.PerIdEmpresa, temporada, id);

            return _result;
        }

        [HttpGet]
        public IEnumerable<ConsultaEstudiantesDTO> Get()
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            var _result = new EstudiantesBL<Estudiantes>().Get(_empresa.PerIdEmpresa, temporada);

            return _result;
        }

        [HttpPost]
        public AgregarEstudianteDTO Post(AgregarEstudianteDTO request)
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            return new EstudiantesBL<Estudiantes>().Save(request, _empresa.PerIdEmpresa);

        }
    }
}
