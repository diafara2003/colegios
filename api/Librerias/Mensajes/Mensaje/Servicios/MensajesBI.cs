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


            return (from mensaje in objCnn.mensajes
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
                        usuario = _usuario

                    }).FirstOrDefault();
        }

        public Mensajes Save(CrearMensajeCustom request)
        {
            ColegioContext objCnn = new ColegioContext();

            try
            {
                int empresa = objCnn.personas.Where(c => c.PerId == request.mensaje.MenUsuario).FirstOrDefault().PerIdEmpresa;
                request.mensaje.MenFecha = DateTime.Now;
                objCnn.mensajes.Add(request.mensaje);
                objCnn.SaveChanges();

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
                                id=(int)query["BanClaseId"],
                                Count = (int)query["CtaNoLeido"],
                                Descripcion = (string)query["MatDescripcion"]
                            });

            return objResultado;
        }
    }
}
