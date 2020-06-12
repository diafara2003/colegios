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
    [RoutePrefix("BandejaEntrada/mensajes")]
    public class BandejaEntradaController : ApiController
    {
        // GET: api/BandejaEntrada
        public IEnumerable<BandejaEntradaDTO> Get(int tipo = 0)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            return new Mensaje.Servicios.BandejaEntradaBI().Get(identity, tipo);
        }

        [Route("recibido")]
        [HttpPost]
        public ResponseDTO PostRecibido(RecibidoDTO request)
        {

            return new BandejaEntradaBI().Recibido(request.id);
        }

        [Route("NoLeidoCount")]
        [HttpGet]
        public int GetCountNoLeido()
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            return new Mensaje.Servicios.BandejaEntradaBI().GetCountMensaje(identity);
        }

        [Route("Marcarleido")]
        [HttpPost]
        public ResponseDTO MarcarLeido(LeidoDTO request)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            return new Mensaje.Servicios.BandejaEntradaBI().MarcarLeido(request, identity);
        }
    }
}
