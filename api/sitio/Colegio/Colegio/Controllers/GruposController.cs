﻿using Grupo.Servicios;
using GruposGarden.Modelos;
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
    public class GruposController : ApiController
    {
        // GET: api/Grupos
        public IEnumerable<ConsultaGruposDTO> Get()
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            return new GruposGardenBL<Trasversales.Modelo.Grupos>().Get(_empresa.PerIdEmpresa, temporada);
        }

        // GET: api/Grupos/5
        public ConsultaGruposDTO Get(string id)
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            return new GruposGardenBL<Trasversales.Modelo.Grupos>().Get(_empresa.PerIdEmpresa, temporada, id: id).FirstOrDefault();
        }

        // POST: api/Grupos
        public ResponseDTO Post(Trasversales.Modelo.Grupos value)
        {

            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();


            value.GrTemporada = temporada;
            value.GrEmpresa = _empresa.PerIdEmpresa;
            value.GrId = 0;

            new GruposGardenBL<Trasversales.Modelo.Grupos>().Add(value);

            return new ResponseDTO() { codigo = 1, respuesta = "" };
        }

        // PUT: api/Grupos/5
        public ResponseDTO Put(Trasversales.Modelo.Grupos value)
        {

            new GruposGardenBL<Trasversales.Modelo.Grupos>().Update(value);
            return new ResponseDTO() { codigo = 1, respuesta = "" };
        }

        // DELETE: api/Grupos/5
        public ResponseDTO Delete(int id)
        {

            var data = new GruposGardenBL<Trasversales.Modelo.Grupos>().SelectById(id);

            new GruposGardenBL<Trasversales.Modelo.Grupos>().Delete(data);

            return new ResponseDTO() { codigo = 1, respuesta = "" };
        }
    }
}
