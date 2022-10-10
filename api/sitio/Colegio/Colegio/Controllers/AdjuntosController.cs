using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
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
            httpResponseMessage.Content.Headers.ContentDisposition.FileName = _adjunto.AdjNombre + _adjunto.AjdExtension;
            httpResponseMessage.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/octet-stream");

            return httpResponseMessage;
        }

        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage Get(int id)
        {

            Trasversales.Modelo.Adjuntos _adjunto = new Adjuntos.Servicios.AdjuntosBL().Get(id: id).FirstOrDefault();
            //converting Pdf file into bytes array  
            var dataBytes = File.ReadAllBytes(_adjunto.AdjIdRuta);
            //adding bytes to memory stream   
            var memoryStream = new MemoryStream(dataBytes);


            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new StreamContent(memoryStream);

            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("image/png");
            return response;
        }

        [AllowAnonymous]
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
            var _empresa_desc = new Menu.Servicios.MenuBI().GetEmpresa(_empresa).EmpNombre;

            if (HttpContext.Current.Request.Form["nuevaEmpresa"] != null)
            {
                _empresa = Convert.ToInt32(HttpContext.Current.Request.Form["idEmpresa"].ToString());
                _empresa_desc = HttpContext.Current.Request.Form["nombreEmpresa"].ToString();
            }


            AdjuntoDTO _rutas = new Colegio.Helper.Adjuntos().save_file(_empresa_desc).FirstOrDefault();

            return new Adjuntos.Servicios.AdjuntosBL().Save(new Trasversales.Modelo.Adjuntos()
            {
                AdjIdUsuario = identity,
                AdjIdEmpresa = _empresa,
                AdjIdRuta = _rutas.ruta,
                AdjNombre = _rutas.nombre.Split('.')[0],
                AjdExtension = Path.GetExtension(_rutas.ruta),

            });
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



        Image DrawText(String text, Font font, Color textColor, Color backColor)
        {
            //first, create a dummy bitmap just to get a graphics object  
            Image img = new Bitmap(1, 1);
            Graphics drawing = Graphics.FromImage(img);

            //measure the string to see how big the image needs to be  
            SizeF textSize = drawing.MeasureString(text, font);

            //free up the dummy image and old graphics object  
            img.Dispose();
            drawing.Dispose();

            //create a new image of the right size  
            img = new Bitmap((int)textSize.Width, (int)textSize.Height);

            drawing = Graphics.FromImage(img);

            //paint the background  
            drawing.Clear(backColor);

            //create a brush for the text  
            Brush textBrush = new SolidBrush(textColor);

            drawing.DrawString(text, font, textBrush, 0, 0);

            drawing.Save();

            textBrush.Dispose();
            drawing.Dispose();

            return img;

        }
        byte[] ImageToByteArray(System.Drawing.Image imageIn)
        {
            MemoryStream ms = new MemoryStream();
            imageIn.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
            return ms.ToArray();
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
