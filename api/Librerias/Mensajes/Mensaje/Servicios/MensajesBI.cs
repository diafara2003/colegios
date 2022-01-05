using BaseDatos.Contexto;
using Mensaje.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using BaseDatos.Modelos;
using Trasversales.Modelo;
using System.Data;
using Utilidades.Servicios;
using System.Data;
using System.Linq;
namespace Mensaje.Servicios
{
    public class MensajesBI
    {

        public IEnumerable<Mensaje_Custom> GetChat(int id, int bandeja)
        {
            List<Mensaje_Custom> obj = new List<Mensaje_Custom>();
            ColegioContext objCnn = new ColegioContext();
            BaseDatos.Modelos.ProcedureDTO ProcedureDTO = new BaseDatos.Modelos.ProcedureDTO();

            ProcedureDTO.commandText = "msn.ConsultarMensajesChat";
            ProcedureDTO.parametros.Add("id", id);
            ProcedureDTO.parametros.Add("bandeja", bandeja);

            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);

            return (from query in result.AsEnumerable()
                    select new Mensaje_Custom()
                    {
                        MenAsunto = (string)query["MenAsunto"],
                        MenBloquearRespuesta = (byte)query["MenBloquearRespuesta"],
                        MenCategoriaId = (int)query["MenCategoriaId"],
                        MenClase = (int)query["MenClase"],
                        MenEstado = (int)query["MenEstado"],
                        MenFecha = (DateTime)query["MenFecha"],
                        MenFechaMaxima = (DateTime)query["MenFecha"],
                        MenMensaje = (string)query["MenMensaje"],
                        MenId = (int)query["MenId"],
                        MenOkRecibido = (byte)query["MenOkRecibido"],
                        MenSendTo = (string)query["MenSendTo"],
                        MenUsuario = (int)query["MenUsuario"],
                        Estudiante = (int)query["BanEstudianteId"],
                        bandeja = (int)query["BanId"],
                        usuario = new Personas()
                        {
                            PerApellidos = (string)query["PerApellidos"],
                            PerNombres = (string)query["PerNombres"],
                            PerDocumento = (string)query["PerDocumento"],
                            PerEmail = (string)query["PerEmail"],
                        },
                        adjuntos = GetAdjuntos((int)query["MenId"]),
                        EstApellidos = (string)query["EstApellidos"],
                        EstNombres = (string)query["EstNombres"],
                    }); ;






        }


        public IEnumerable<Adjuntos> GetAdjuntos(int msn)
        {
            ColegioContext objCnn = new ColegioContext();
            return (from a in objCnn.adjuntos
                    join adjmsj in objCnn.adjuntos_mensajes on a.AjdId equals adjmsj.AdjMenAdjuntoId
                    where adjmsj.AdjMsnMensajeId == msn
                    select a
                                     );
        }

        public CrearMensajeCustom SaveBorrador(CrearMensajeCustom request)
        {

            ColegioContext objCnn = new ColegioContext();
            int empresa = objCnn.personas.Where(c => c.PerId == request.mensaje.MenUsuario).FirstOrDefault().PerIdEmpresa;

            request.mensaje.MenFecha = DateTime.Now;
            request.mensaje.MenEstado = -1;

            if (request.mensaje.MenId > 0)
            {
                objCnn.Entry(request.mensaje).State = System.Data.Entity.EntityState.Modified;

            }
            else
            {
                objCnn.mensajes.Add(request.mensaje);

            }
            objCnn.SaveChanges();

            objCnn.adjuntos_mensajes
                .Where(c => c.AdjMsnMensajeId == request.mensaje.MenId).ToList()
                .ForEach(i =>
            {
                objCnn = new ColegioContext();

                objCnn.Entry(i).State = System.Data.Entity.EntityState.Deleted;
                objCnn.SaveChanges();
            });



            //adjuntos al mensaje
            if (request.adjuntos != null)
            {
                objCnn = new ColegioContext();
                request.adjuntos.ForEach(a =>
                {
                    objCnn.adjuntos_mensajes.Add(new AdjuntosMensaje()
                    {
                        AdjMenAdjuntoId = a,
                        AdjMsnMensajeId = request.mensaje.MenId
                    });
                });
                objCnn.SaveChanges();
            }


            return request;
        }


        public ResponseCrearMensaje Save(CrearMensajeCustom request)
        {
            ColegioContext objCnn = new ColegioContext();
            ResponseCrearMensaje _response = new ResponseCrearMensaje();
            ResponseDTO objResultado = new ResponseDTO();
            try
            {
                request.mensaje.MenFecha = DateTime.Now.AddHours(1);
                if (request.mensaje.MenReplicaIdMsn != 0)
                {
                    request.mensaje.MenBloquearRespuesta = 0;
                    var mensaje_original = objCnn.mensajes.Find(request.mensaje.MenReplicaIdMsn);


                    request.mensaje.MenClase = mensaje_original.MenClase;
                    request.mensaje.MenAsunto = "RV-" + mensaje_original.MenAsunto;


                    if (request.mensaje.MenFecha > mensaje_original.MenFechaMaxima)
                    {
                        objResultado.codigo = -1;
                        objResultado.respuesta = "No se puede responder el mensaje porque se venció la fecha limite establecida.";
                        _response.resultado = objResultado;
                        return _response;
                    }
                }



                int empresa = objCnn.personas.Where(c => c.PerId == request.mensaje.MenUsuario).FirstOrDefault().PerIdEmpresa;
                if (request.mensaje.MenId > 0)
                {
                    request.mensaje.MenEstado = 0;
                    objCnn.Entry(request.mensaje).State = System.Data.Entity.EntityState.Modified;
                }
                else
                {
                    request.mensaje.MenFecha = DateTime.Now.AddHours(1); ;
                    objCnn.mensajes.Add(request.mensaje);
                }


                objCnn.SaveChanges();

                //adjuntos al mensaje
                if (request.adjuntos != null)
                {
                    objCnn = new ColegioContext();
                    request.adjuntos.ForEach(a =>
                    {
                        objCnn.adjuntos_mensajes.Add(new AdjuntosMensaje()
                        {
                            AdjMenAdjuntoId = a,
                            AdjMsnMensajeId = request.mensaje.MenId
                        });
                    });
                    objCnn.SaveChanges();
                }



                string _xml_destinatarios = Utilidad.ObjectToXMLGeneric<List<Destinarario>>(request.destinatarios);

                objCnn = new ColegioContext();
                ProcedureDTO ProcedureDTO = new ProcedureDTO();
                IEnumerable<AcEnvioCorreoPersonas> objlstResultado = new List<AcEnvioCorreoPersonas>();


                ProcedureDTO.commandText = "MSN.CrearMensaje_Bandeja_Entrada";
                ProcedureDTO.parametros.Add("idMensaje", request.mensaje.MenId);
                ProcedureDTO.parametros.Add("empresa", empresa);
                ProcedureDTO.parametros.Add("destinatarios", _xml_destinatarios);

                DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);
                //por cada destinatario se inserta en la tabla bandeja de entrada

                objResultado.codigo = 1;
                objResultado.respuesta = _xml_destinatarios;

                _response.notificaciones = (from data in result.AsEnumerable()
                                            select new LoginPhone()
                                            {
                                                LgId = (int)data["LgId"],
                                                UsuarioId = (int)data["UsuarioId"],
                                                TokenFCM = (string)data["TokenFCM"],
                                            }).ToList();
            }
            catch (Exception e)
            {
                objResultado.codigo = -1;
                objResultado.respuesta = e.InnerException.Message;
            }

            _response.resultado = objResultado;
            return _response;

        }

        public List<LoginPhone> EnviarNotificacionNuevoMensaje(List<Destinarario> destinatarios, int IdMensaje)
        {

            //se obtiene los token de los usuario del mensaje
            ColegioContext objCnn = new ColegioContext();
            List<LoginPhone> _notificationUser = new List<LoginPhone>();

            destinatarios.ForEach(c =>
            {
                var _token = objCnn.loginPhone.Where(x => x.UsuarioId == c.id);

                if (_token != null && _token.Count() > 0) _token.ToList().ForEach(t => _notificationUser.Add(t));

            });
            return _notificationUser;


        }


        public IEnumerable<ObtenerAcudientesgrupos> GetObtenerAcudientesgrupos(int id, int empresa)
        {

            ColegioContext objCnn = new ColegioContext();
            ProcedureDTO ProcedureDTO = new ProcedureDTO();

            ProcedureDTO.commandText = "msn.ObtenerAcudientesgrupos";
            ProcedureDTO.parametros.Add("id", id);
            ProcedureDTO.parametros.Add("empresa", empresa);


            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);

            return (from data in result.AsEnumerable()
                    select new ObtenerAcudientesgrupos()
                    {
                        PerIdA1 = (int)data["PerIdA1"],
                        PerNombresA1 = (string)data["PerNombresA1"],
                        PerApellidosA1 = (string)data["PerApellidosA1"],
                        TipoA1 = (string)data["TipoA1"],


                        PerIdA2 = data["PerIdA2"] is DBNull ? 0 : (int)data["PerIdA2"],
                        PerNombresA2 = data["PerNombresA2"] is DBNull ? "" : (string)data["PerNombresA2"],
                        PerApellidosA2 = data["PerApellidosA2"] is DBNull ? "" : (string)data["PerApellidosA2"],
                        TipoA2 = data["TipoA2"] is DBNull ? "" : (string)data["TipoA2"],


                        color = (string)data["color"],


                        EstId = (int)data["EstId"],
                        EstNombres = (string)data["EstNombres"],
                        EstApellidos = data["EstApellidos"] is DBNull ? "" : (string)data["EstApellidos"],

                    });

        }


        public IEnumerable<AcEnvioCorreoPersonas> GetAcEnvioCorreoPersonas(int idusuario, string filter, string temporada, string empresa)
        {

            ColegioContext objCnn = new ColegioContext();
            ProcedureDTO ProcedureDTO = new ProcedureDTO();
            IEnumerable<AcEnvioCorreoPersonas> objlstResultado = new List<AcEnvioCorreoPersonas>();

            ProcedureDTO.commandText = "msn.AcEnvioCorreoPersonas";
            ProcedureDTO.parametros.Add("filter", filter);
            ProcedureDTO.parametros.Add("idusuario", idusuario);
            ProcedureDTO.parametros.Add("temporada", temporada);
            ProcedureDTO.parametros.Add("emp", empresa);

            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);

            objlstResultado = (from data in result.AsEnumerable()
                               select new AcEnvioCorreoPersonas()
                               {
                                   PerId = (int)data["PerId"],
                                   CurDescripcion = data["CurDescripcion"] is DBNull ? string.Empty : (string)data["CurDescripcion"],
                                   GraDescripcion = (string)data["GraDescripcion"],
                                   PerApellidos = (string)data["PerApellidos"],
                                   PerNombres = (string)data["PerNombres"],
                                   tipo = (int)data["tipo"],
                                   GrEnColorRGB = (string)data["GrEnColorRGB"],
                                   GrEnColorBurbuja = (string)data["GrEnColorBurbuja"],
                                   GrEnColorObs = (string)data["GrEnColorObs"],
                                   idEst = (int)data["idEst"],
                               });
            return objlstResultado;
        }

        public IEnumerable<TipoBandejaDTO> GetXUsuario(int usuario)
        {
            IEnumerable<TipoBandejaDTO> objResultado = new List<TipoBandejaDTO>();
            ColegioContext objCnn = new ColegioContext();
            BaseDatos.Modelos.ProcedureDTO ProcedureDTO = new BaseDatos.Modelos.ProcedureDTO();

            ProcedureDTO.commandText = "msn.BandejaClases";
            ProcedureDTO.parametros.Add("usuario", usuario);

            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);

            objResultado = (from query in result.AsEnumerable()
                            select new TipoBandejaDTO()
                            {
                                id = (int)query["BanClaseId"],
                                Count = (int)query["CtaNoLeido"],
                                Descripcion = (string)query["MatDescripcion"]
                            });

            return objResultado;
        }
    }
}

