using Adjuntos.Modelos;
using Adjuntos.Servicios;
using Documentacion.Modelos;
using Documentacion.Servicios;
using Grupo.Servicios;
using GruposGarden.Modelos;
using Mensaje.Servicios;
using Persona.Servicios;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web;
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


        [HttpPost]
        [Route("estudiante/subir")]
        public Trasversales.Modelo.Adjuntos SubirDocumento()
        {
            int identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _infoEmpresa = new PersonasBI().Get(id: identity).FirstOrDefault();
            int _empresa = _infoEmpresa.PerIdEmpresa;
            int idEstudiante = Convert.ToInt32(HttpContext.Current.Request.Form["idestudiante"].ToString());
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempAno;

            var _empresa_desc = new Menu.Servicios.MenuBI().GetEmpresa(_empresa).EmpNombre;

            var _estudiante = new EstudiantesBL<EstudianteJardin>().GetEspecific(_empresa, 0, idEstudiante);

            if (_estudiante.estudiante.EstApellidos == null) _estudiante.estudiante.EstApellidos = "";
            else _estudiante.estudiante.EstApellidos = $"-{_estudiante.estudiante.EstApellidos}";


            AdjuntoDTO _rutas = new Helper.Adjuntos()
                .save_file($"{_empresa_desc}/temporada_${temporada}/{_estudiante.estudiante.EstNombres}{_estudiante.estudiante.EstApellidos}")
                .FirstOrDefault();


            var adjunto = new AdjuntosBL().Save(new Trasversales.Modelo.Adjuntos()
            {
                AdjIdUsuario = identity,
                AdjIdEmpresa = _empresa,
                AdjIdRuta = _rutas.ruta,
                AdjNombre = _rutas.nombre.Split('.')[0],
                AjdExtension = Path.GetExtension(_rutas.ruta),

            });

            int docreq = Convert.ToInt32(HttpContext.Current.Request.Form["iddocreq"].ToString());

            new AdjuntosEstudianteBL().SaveDocEstudiante(adjunto.AjdId, docreq, _empresa, idEstudiante);

            return adjunto;

        }
    }
}
