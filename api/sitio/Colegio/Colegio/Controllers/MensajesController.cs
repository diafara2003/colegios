using Mensaje.Modelos;
using Mensaje.Servicios;
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
    [RoutePrefix("Mensajes")]
    public class MensajesController : ApiController
    {
        /*
         
    DECLARE @id int =3
    ;WITH _msn (id)
    AS
    (
    SELECT MenId from msn.Mensajes where MenId=@id
        UNION ALL
    SELECT  MenReplicaIdMsn from msn.Mensajes
            INNER JOIN _msn on _msn.id=MenId 
    )
    SELECT * FROM _MSN
         */

        [Route("Chat")]
        [HttpGet]
        public IEnumerable<Mensaje_Custom> GetChat(int id)
        {
           
            return new Mensaje.Servicios.MensajesBI().GetChat(id);
        }


        // GET: api/Mensajes/5
        public VerMensajeDTO Get(int id,int Bandeja)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            new BandejaEntradaBI().MarcarLeido(new LeidoDTO()
            {
                IdMensaje = id,
                OkRecibido = 0,
                IdBandeja=Bandeja

            }, identity);
            return new Mensaje.Servicios.MensajesBI().Get(id);
        }

        [Route("destinatarios")]
        [HttpGet]
        public IEnumerable<AcEnvioCorreoPersonas> Getdestinatarios(int idusuario, string filter="")
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            if (filter == null)
            {
                filter = string.Empty;
            }

            return new MensajesBI().GetAcEnvioCorreoPersonas(idusuario, filter, temporada.ToString(), _empresa.PerIdEmpresa.ToString());
        }

        // POST: api/Mensajes
        public ResponseDTO Post(CrearMensajeCustom request)
        {
            return new Mensaje.Servicios.MensajesBI().Save(request);
        }


        [Route("borrador")]
        [HttpPost]
        public CrearMensajeCustom SaveBorrador(CrearMensajeCustom request) {
            return new Mensaje.Servicios.MensajesBI().SaveBorrador(request);
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
