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

        public Mensaje_Custom Get(int id)
        {
            ColegioContext objCnn = new ColegioContext();
            Mensaje_Custom obj_response = new Mensaje_Custom();

            obj_response = (from mensaje in objCnn.mensajes
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
                                MenEstado = mensaje.MenEstado
                            }).FirstOrDefault();

            obj_response.adjuntos = (from a in objCnn.adjuntos
                                     join adjmsj in objCnn.adjuntos_mensajes on a.AjdId equals adjmsj.AdjMenAdjuntoId
                                     where adjmsj.AdjMsnMensajeId == obj_response.MenId
                                     select a
                                     );

            return obj_response;
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


        public Mensajes Save(CrearMensajeCustom request)
        {
            ColegioContext objCnn = new ColegioContext();

            try
            {
                request.mensaje.MenFecha = DateTime.Now;
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


            }
            catch (Exception e)
            {
            }
            return request.mensaje;

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
