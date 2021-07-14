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

        [Route("marcarleido")]
        [HttpGet]
        public ResponseDTO MarcarLeido(int id,int bandeja) {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            return new BandejaEntradaBI().MarcarLeido(new LeidoDTO()
            {
                IdMensaje = id,
                OkRecibido = 0,
                IdBandeja = bandeja

            }, identity);
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

            /*
 {
	"notificacion":{
		body:'texto de la notificacion',
		"title":"titulo"
	},
	"priority":"high".
	data:{
		"mensaje":10
	},
	to:""
}
 */

            var _data = new MessageNotificacionPhone();

            _data.data = new DataMessage();
            _data.data.mensaje = data.mensaje.MenId;
            _data.notification = new Notificacions();
            _data.notification.title = "Nuevo mensaje";
            _data.notification.body = data.mensaje.MenAsunto;
            _data.priority = "high";

            _notificaciones.ForEach(c =>            {

                _data.to = c.TokenFCM;

                var json = JsonConvert.SerializeObject(_data);

                var client = new RestClient("https://fcm.googleapis.com/fcm/send");
                var request = new RestRequest(Method.POST);
                request.AddHeader("postman-token", "eb7f9bd7-7cc5-1d7e-e366-5cc07f982bd8");
                request.AddHeader("cache-control", "no-cache");
                request.AddHeader("authorization", "key=AAAALy133Po:APA91bFoGuTSYeaDpPZMFJr6hhulkKkAqqouGiJ2QzcI13qt37HQBLd36W87FokHYSPxotxPropHQBAKdY6p1zoUXIOcfI7nsqmz_xe8DYcAhHqN7bqGzxlg3OEjSsgqq26zoJsKEY_K");
                request.AddHeader("content-type", "application/json");
                request.AddParameter("application/json", json, ParameterType.RequestBody);

                IRestResponse response = client.Execute(request);
            });

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
