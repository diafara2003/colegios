using Mensaje.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    public class MensajesController : ApiController
    {


        // GET: api/Mensajes/5
        public Mensajes Get(int id)
        {
            return new Mensaje.Servicios.MensajesBI().Get(id);
        }

        // POST: api/Mensajes
        public Mensajes Post(CrearMensajeCustom request)
        {
            return new Mensaje.Servicios.MensajesBI().Save(request);
        }

        // PUT: api/Mensajes/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Mensajes/5
        public void Delete(int id)
        {
        }
    }
}
