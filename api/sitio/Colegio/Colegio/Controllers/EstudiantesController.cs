using Adjuntos.Modelos;
using Documentacion.Servicios;
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
    [RoutePrefix("Estudiantes/acudiente")]
    public class EstudiantesController : ApiController
    {
        [Route("validarcorreo")]
        [HttpPost]
        public Personas GetAcudienteCorreo(BuscarAcudienteCorreoDTO request)
        {

            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            return new EstudiantesBL<Estudiantes>().GetAcudienteCorreo(request.email, _empresa.PerIdEmpresa);
        }

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

        [HttpGet]
        [Route("hijos")]
        public IEnumerable<DocumentosPendientesEstudianteDTO> GetHijos()
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            var _result = new DocumentacionBL().GetDocumentosHijos(_empresa.PerIdEmpresa,  _empresa.PerId);

            return _result;
        }

        [HttpPost]
        public ResponseAgregarEstudianteDTO Post(AgregarEstudianteDTO request)
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            return new EstudiantesBL<Estudiantes>().Save(request, _empresa.PerIdEmpresa);

        }

        [HttpPut]
        public ResponseDTO Update(ActualizarGrupoEstudianteDTO request)
        {
            return new EstudiantesBL<Estudiantes>().Update(request);

        }

        [HttpDelete]
        public ResponseDTO Eliminar(int id)
        {
            new EstudiantesBL<Estudiantes>().DeleteEstudiante(id);

            return new ResponseDTO();
        }
    }
}
