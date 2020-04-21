using Menu.Servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    public class MenuController : ApiController
    {
        [HttpGet]
        public IHttpActionResult GetMenu()
        {
            try
            {
                return Ok(new MenuBI().Get());
            }
            catch (Exception e)
            {

                return InternalServerError(e);
            }

        }
    }
}
