using Adjuntos.Modelos;
using Adjuntos.Servicios;
using Documentacion.Modelos;
using Documentacion.Servicios;
using Grupo.Servicios;
using GruposGarden.Modelos;
using Mensaje.Servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using Trasversales.Modelo;
using Utilidades.Servicios;


namespace Colegio.Controllers
{
    [RoutePrefix("documentoscolegio")]
    public class DocumentosController : ApiController
    {
        // GET: api/Grupos
        [Route("consultar")]
        public IEnumerable<DocumentacionDTO> Get()
        {

            // Utilidad.EnviarMensajeCorreo();
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            try
            {
                return new DocumentacionBL().GetDocumentacion(_empresa.PerIdEmpresa);
            }
            catch (Exception e)
            {

                return new List<DocumentacionDTO>();
            }

        }


        [HttpGet]
        [Route("estudiantes/validacion")]
        public List<DocumentosPendientesEstudianteDTO> GetDocumentosSubidos()
        {
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();
            try
            {
                return new DocumentacionBL().GetDocumentosEstudiantes(_empresa.PerIdEmpresa);

            }
            catch (Exception)
            {

                return new List<DocumentosPendientesEstudianteDTO>();
            }

        }


        [HttpGet]
        [Route("estudiante")]
        public List<DocumentosEstudianteDTO> GetDocumentosEstudiante(int idestudiante)
        {
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            
            return new AdjuntosEstudianteBL().GetDocumentosEstudiante(idestudiante, _empresa.PerIdEmpresa);

        }

        [Route("nuevo")]
        // POST: api/Grupos
        public DocumentacionDTO Post(AddDocumentacionDTO value)
        {

            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();


            return new DocumentacionBL().AddDocumentacionColegio(_empresa.PerIdEmpresa, value.nombre);


        }

        [Route("eliminar")]
        [HttpPost]
        // DELETE: api/Grupos/5
        public ResponseDTO EliminarDocumentacion(DeleteDocumentacionDTO value)
        {

            new DocumentacionBL().EliminarDocumentacion(value.id);

            return new ResponseDTO() { codigo = 1, respuesta = "" };
        }
    }
}
