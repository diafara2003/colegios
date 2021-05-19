using Colegio.Models;
using Mensaje.Modelos;
using Mensaje.Servicios;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
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
        public VerMensajeDTO Get(int id, int Bandeja)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            new BandejaEntradaBI().MarcarLeido(new LeidoDTO()
            {
                IdMensaje = id,
                OkRecibido = 0,
                IdBandeja = Bandeja

            }, identity);
            return new Mensaje.Servicios.MensajesBI().Get(id);
        }

        [Route("destinatarios")]
        [HttpGet]
        public IEnumerable<AcEnvioCorreoPersonas> Getdestinatarios(int idusuario, string filter = "")
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
        public ResponseDTO Post(CrearMensajeCustom data)
        {
            var _response = new Mensaje.Servicios.MensajesBI().Save(data);


            var _notificaciones = new Mensaje.Servicios.MensajesBI().EnviarNotificacionNuevoMensaje(data.destinatarios, data.mensaje.MenId);



            var _data = new MessageNotificacionPhone();

            var json = JsonConvert.SerializeObject(_data);


            var client = new RestClient("https://fcm.googleapis.com/fcm/send");
            var request = new RestRequest(Method.POST);
            request.AddHeader("authorization", "key=AAAA2ylY_P4:APA91bEI8fnGtvurVbN__wrUeq2FAsSV7NBhb2pM935h26O1jS4ZwKULbUAaDvlxHNmI6QGuEhPJyEVGJbHYfZFQRozxU4rF0inDw9wJ74HckH5Yov4t0owzdPfEnSCMp_vwdCtY1lnd");
            request.AddParameter("undefined", json);

            client.Execute(request);

            return _response;
        }


        [Route("borrador")]
        [HttpPost]
        public CrearMensajeCustom SaveBorrador(CrearMensajeCustom request)
        {
            return new Mensaje.Servicios.MensajesBI().SaveBorrador(request);
        }

        // PUT: api/Mensajes/5
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE: api/Mensajes/5
        public void Delete(int id)
        {
        }
    }
}
