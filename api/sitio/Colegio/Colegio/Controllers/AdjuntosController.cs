using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Colegio.Controllers
{
    [RoutePrefix("adjunto")]
    public class AdjuntosController : ApiController
    {
        [AllowAnonymous]
        [HttpGet]
        [Route("descargar")]
        public HttpResponseMessage DescargarAdjunto(int id)
        {

            Trasversales.Modelo.Adjuntos _adjunto = new Adjuntos.Servicios.AdjuntosBL().Get(id: id).FirstOrDefault();


            //converting Pdf file into bytes array  
            var dataBytes = File.ReadAllBytes(_adjunto.AdjIdRuta);
            //adding bytes to memory stream   
            var dataStream = new MemoryStream(dataBytes);

            HttpResponseMessage httpResponseMessage = Request.CreateResponse(HttpStatusCode.OK);
            httpResponseMessage.Content = new StreamContent(dataStream);
            httpResponseMessage.Content.Headers.ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment");
            httpResponseMessage.Content.Headers.ContentDisposition.FileName = _adjunto.AdjNombre+_adjunto.AjdExtension;
            httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

            return httpResponseMessage;
        }


        [HttpGet]
        public IEnumerable<Trasversales.Modelo.Adjuntos> Get([FromUri] List<int> adjunto = null, int usuario = 0)
        {
            return new Adjuntos.Servicios.AdjuntosBL().Get(id_adjunto: adjunto, id_usuario: usuario);
        }

        [HttpPost]
        public Trasversales.Modelo.Adjuntos Post()
        {
            int identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            int _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault().PerIdEmpresa;
            var _empresa_desc = new Menu.Servicios.MenuBI().GetEmpresa(_empresa);


            AdjuntoDTO _rutas = save_file(_empresa_desc.EmpNombre).FirstOrDefault();


            return new Adjuntos.Servicios.AdjuntosBL().Save(new Trasversales.Modelo.Adjuntos()
            {
                AdjIdUsuario = identity,
                AdjIdEmpresa = _empresa,
                AdjIdRuta = _rutas.ruta,
                AdjNombre = _rutas.nombre.Split('.')[0],
                AjdExtension = Path.GetExtension(_rutas.ruta),

            });



        }

        private List<AdjuntoDTO> save_file(string nombre_empresa)
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            List<AdjuntoDTO> savedFilePath = new List<AdjuntoDTO>();

            string rootPath = HttpContext.Current.Server.MapPath("~/UploadedFiles/" + nombre_empresa + "/");

            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }

            if (httpRequest.Files.Count > 0)
            {

                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    string newFileName = Guid.NewGuid() + Path.GetExtension(postedFile.FileName);
                    var filePath = rootPath + newFileName;
                    postedFile.SaveAs(filePath);
                    savedFilePath.Add(new AdjuntoDTO()
                    {
                        nombre = postedFile.FileName,
                        ruta = filePath
                    });
                }
            }


            return savedFilePath;
        }

        [Route("eliminar")]
        [HttpPost]
        public bool TrunkAdjunto(AdjuntoD id)
        {
            Trasversales.Modelo.Adjuntos _archivo = new Adjuntos.Servicios.AdjuntosBL().Get(id: id.id).FirstOrDefault();
            bool _id_deleted = new Adjuntos.Servicios.AdjuntosBL().Delete(id.id);

            if (_id_deleted)
            {

                File.Delete(_archivo.AdjIdRuta);
            }

            return true;
        }
    }

    public class AdjuntoDTO
    {
        public string nombre { get; set; }
        public string ruta { get; set; }
    }

    public class AdjuntoD
    {
        public int id { get; set; }
    }
}
