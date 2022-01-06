using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Web.Http;
using Persona.Modelos;
using Persona.Servicios;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    public class ProfesorController : ApiController
    {
        [HttpGet]
        // GET: api/Profesor
        public IEnumerable<ConsultaProfesorDTO> Get()
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            var _result = new ProfesoresBL<Profesores>().Get(_empresa.PerIdEmpresa, temporada);

            return _result;
        }

        [HttpGet]
        // GET: api/Profesor/5
        public ConsultaProfesorDTO Get(int id)
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();

            return new ProfesoresBL<Profesores>().Get(_empresa.PerIdEmpresa, temporada, id);
        }

        // POST: api/Profesor
        [HttpPost]
        public ResponseDTO Post(ConsultaProfesorDTO value)
        {
            var temporada = new Temporadas.Servicios.TemporadaBI().Get().Where(c => c.TempEstado == 1).FirstOrDefault().TempId;
            var usuario = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            var _empresa = new Persona.Servicios.PersonasBI().Get(id: usuario).FirstOrDefault();




            if (value.id > 0)
            {


                //se valida que el correo no exista en el sistema
                if (new PersonasBI().ExisteCorreo(_empresa.PerIdEmpresa, value.email,value.id))
                {
                    return new ResponseDTO()
                    {
                        codigo = -1,
                        respuesta = "El correo ya existe en el sistema"
                    };
                }

                var _persona = new ProfesoresBL<Personas>().SelectById(value.id);

                _persona.PerNombres = value.nombre;
                _persona.PerApellidos = value.apellido;
                _persona.PerEmail = value.email;
                _persona.PerTelefono = value.celular;
                _persona.PerDocumento = value.email;

                new ProfesoresBL<Personas>().Update(_persona);
            }

            else
            {
                ProfesoresBL<Personas> objPErsona = new ProfesoresBL<Personas>();


                if (new PersonasBI().ExisteCorreo(_empresa.PerIdEmpresa,value.email))
                {
                    return new ResponseDTO()
                    {
                        codigo = -1,
                        respuesta = "El correo ya existe en el sistema"
                    };
                }

                Personas obj = new Personas();

                obj.PerId = 0;
                obj.PerNombres = value.nombre;
                obj.PerApellidos = value.apellido;
                obj.PerDocumento = value.email;
                obj.PerTIpoDoc = value.email;
                obj.PerEmail = value.email;
                obj.PerTelefono = value.celular;
                obj.PerIdEmpresa = _empresa.PerIdEmpresa;
                obj.PerEstado = true;
                obj.PerTipoPerfil = 1;
                obj.PerClave = Utilidades.Servicios.Utilidad.GenerarclaveRandom();
                obj.PerUsuario = obj.PerEmail;
                obj.PerIngreso = false;

                objPErsona.Add(obj);

                value.id = obj.PerId;

            }

            new ProfesoresBL<Personas>().Insert(value.grupos.ToList(), value.id);


            return new ResponseDTO()
            {
                codigo = value.id,
                respuesta = ""
            };
        }


        // DELETE: api/Profesor/5
        [HttpDelete]
        public ResponseDTO Delete(int id)
        {
            new ProfesoresBL<Personas>().DeleteGrupo(id);

            new ProfesoresBL<Personas>().Delete(id);

            return new ResponseDTO()
            {
                codigo = 1,
                respuesta = ""
            };
        }
    }
}
