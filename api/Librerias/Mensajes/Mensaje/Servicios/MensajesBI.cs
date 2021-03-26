using BaseDatos.Contexto;
using Mensaje.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using BaseDatos.Modelos;
using Trasversales.Modelo;
using System.Data;
using Utilidades.Servicios;

namespace Mensaje.Servicios
{
    public class MensajesBI
    {

        public IEnumerable<Mensaje_Custom> GetChat(int id)
        {
            List<Mensaje_Custom> obj = new List<Mensaje_Custom>();
            ColegioContext objCnn = new ColegioContext();
            BaseDatos.Modelos.ProcedureDTO ProcedureDTO = new BaseDatos.Modelos.ProcedureDTO();

            ProcedureDTO.commandText = "msn.ConsultarMensajes";
            ProcedureDTO.parametros.Add("@id", id);

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
                        usuario = new Personas()
                        {
                            PerApellidos = (string)query["PerApellidos"],
                            PerNombres = (string)query["PerNombres"],
                            PerDocumento = (string)query["PerDocumento"],
                            PerEmail = (string)query["PerEmail"],
                        }
                    });






        }

        public VerMensajeDTO Get(int id)
        {
            VerMensajeDTO objResultado = new VerMensajeDTO();
            ColegioContext objCnn = new ColegioContext();
            Mensaje_Custom obj_response = new Mensaje_Custom();

            objResultado._mensaje = (from mensaje in objCnn.mensajes
                                     join _usuario in objCnn.personas on mensaje.MenUsuario equals _usuario.PerId
                                     where mensaje.MenId == id
                                     select new Mensaje_Custom
                                     {
                                         MenAsunto = mensaje.MenAsunto,
                                         MenBloquearRespuesta = mensaje.MenBloquearRespuesta,
                                         MenUsuario = mensaje.MenUsuario,
                                         MenClase = mensaje.MenClase,
                                         MenEmpId = mensaje.MenEmpId,
                                         MenFecha = mensaje.MenFecha,
                                         MenId = mensaje.MenId,
                                         MenMensaje = mensaje.MenMensaje,
                                         MenOkRecibido = mensaje.MenOkRecibido,
                                         MenReplicaIdMsn = mensaje.MenReplicaIdMsn,
                                         MenSendTo = mensaje.MenSendTo,
                                         MenTipoMsn = mensaje.MenTipoMsn,
                                         usuario = _usuario,
                                         MenCategoriaId = mensaje.MenCategoriaId,
                                         MenEstado = mensaje.MenEstado,
                                         MenFechaMaxima = mensaje.MenFechaMaxima
                                     }).FirstOrDefault();

            objResultado._mensaje.adjuntos = (from a in objCnn.adjuntos
                                              join adjmsj in objCnn.adjuntos_mensajes on a.AjdId equals adjmsj.AdjMenAdjuntoId
                                              where adjmsj.AdjMsnMensajeId == obj_response.MenId
                                              select a
                                     );


            if (objResultado._mensaje.MenReplicaIdMsn > 0)
            {
                objResultado.replicas = Get(objResultado._mensaje.MenReplicaIdMsn);
            }

            return objResultado;
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


        public ResponseDTO Save(CrearMensajeCustom request)
        {
            ColegioContext objCnn = new ColegioContext();
            ResponseDTO objResultado = new ResponseDTO();
            try
            {
                request.mensaje.MenFecha = DateTime.Now;
                if (request.mensaje.MenReplicaIdMsn != 0)
                {
                    request.mensaje.MenBloquearRespuesta = 0;
                    var mensaje_original = objCnn.mensajes.Find(request.mensaje.MenReplicaIdMsn);


                    request.mensaje.MenClase = mensaje_original.MenClase;


                    if (request.mensaje.MenFecha > mensaje_original.MenFechaMaxima)
                    {
                        objResultado.codigo = -1;
                        objResultado.respuesta = "No se puede responder el mensaje porque se venció la fecha limite establecida.";
                        return objResultado;
                    }
                }
                else
                {

                    //se obtiene la clase de acuerdo al tipo de usuario
                    var tipo = objCnn.personas.Find(request.mensaje.MenUsuario);


                    if (tipo.PerTipoPerfil == 1)
                    {
                        //docente
                    }
                    else
                    {
                        //estudiante
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
                    request.mensaje.MenFecha = DateTime.Now;
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
                objResultado.respuesta = "mensaje creado correctamente";
            }
            catch (Exception e)
            {
                objResultado.codigo = -1;
                objResultado.respuesta = e.Message;
            }
            return objResultado;

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
                                   CurDescripcion = (string)data["CurDescripcion"],
                                   GraDescripcion = (string)data["GraDescripcion"],
                                   PerApellidos = (string)data["PerApellidos"],
                                   PerNombres = (string)data["PerNombres"],
                                   tipo = (int)data["tipo"],
                                   GrEnColorRGB = (string)data["GrEnColorRGB"],
                                   GrEnColorBurbuja = (string)data["GrEnColorBurbuja"],
                                   GrEnColorObs = (string)data["GrEnColorObs"],
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
