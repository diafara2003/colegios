using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace Colegio.Controllers
{
    [RoutePrefix("adjunto")]
    public class AdjuntosController : ApiController
    {

        [HttpGet]
        public IEnumerable<Trasversales.Modelo.Adjuntos> Get(int adjunto = 0, int usuario = 0)
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
            return new Adjuntos.Servicios.AdjuntosBL().Delete(id.id);
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
