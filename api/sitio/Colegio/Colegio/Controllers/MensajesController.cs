﻿using Mensaje.Modelos;
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
        public IEnumerable<AcEnvioCorreoPersonas> Getdestinatarios(int idusuario, string filter, string temporada, string empresa)
        {
            if (filter == null)
            {
                filter = string.Empty;
            }

            return new MensajesBI().GetAcEnvioCorreoPersonas(idusuario, filter, temporada, empresa);
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
