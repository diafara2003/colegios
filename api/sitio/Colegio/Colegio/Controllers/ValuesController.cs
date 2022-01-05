using Colegio.Models;
using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace Colegio.Controllers
{
    public class ValuesController : ApiController
    {
        [AllowAnonymous]
        // GET api/values
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/values/5
        [AllowAnonymous]
        public string Get(int id)
        {
            MessageNotificacionPhone _data = new MessageNotificacionPhone();
            _data.data = new DataMessage();
            _data.data.mensaje = 5;
            _data.notification = new Notificacions();
            _data.notification.title = "Nuevo mensaje";
            _data.notification.body ="Pruba desde el servidor";
            _data.priority = "high";
            _data.notification.sound = "default";

            _data.to = "cHLGNWNvGk-xgdq6aIj-co:APA91bH8Hbl3xo89NMIbSSuQwZHegJsf_VrApx_5Z0oHlPjT4hP8b4d2Dhq-8UrEjecDvf3m-hT5Aqye08L1ynJxmivxxOGKKmHsynMBATM1ZOtQqYFKpMiUjYuWtMq1WUUszH6HsWN5";

            var json = JsonConvert.SerializeObject(_data);

            var client = new RestClient("https://fcm.googleapis.com/fcm/send");
            var request = new RestRequest(Method.POST);
            request.AddHeader("postman-token", "eb7f9bd7-7cc5-1d7e-e366-5cc07f982bd8");
            request.AddHeader("cache-control", "no-cache");
            request.AddHeader("authorization", "key=AAAALy133Po:APA91bFoGuTSYeaDpPZMFJr6hhulkKkAqqouGiJ2QzcI13qt37HQBLd36W87FokHYSPxotxPropHQBAKdY6p1zoUXIOcfI7nsqmz_xe8DYcAhHqN7bqGzxlg3OEjSsgqq26zoJsKEY_K");
            request.AddHeader("content-type", "application/json");
            request.AddParameter("application/json", json, ParameterType.RequestBody);

            IRestResponse response = client.Execute(request);

            
            return  response.ErrorMessage;
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }
    }
}
