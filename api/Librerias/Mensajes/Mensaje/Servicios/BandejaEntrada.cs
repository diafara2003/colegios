using BaseDatos.Contexto;
using System.Collections.Generic;
using BaseDatos.Modelos;
using System.Data;
using Mensaje.Modelos;
using System;
using Trasversales.Modelo;
using System.Linq;

namespace Mensaje.Servicios
{
    public class BandejaEntradaBI
    {

        public IEnumerable<BandejaEntradaDTO> Get(int usuario, int tipo = 0)
        {

            ColegioContext objCnn = new ColegioContext();
            ProcedureDTO ProcedureDTO = new ProcedureDTO();
            IEnumerable<BandejaEntradaDTO> objlstResultado = new List<BandejaEntradaDTO>();

            ProcedureDTO.commandText = "MSN.[ConsultarMensaje]";
            ProcedureDTO.parametros.Add("usuario", usuario);
            ProcedureDTO.parametros.Add("tipo", tipo);

            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);

            objlstResultado = (from data in result.AsEnumerable()
                               select new BandejaEntradaDTO()
                               {
                                   MenId = (int)data["MenId"],
                                   MenAsunto = (string)data["MenAsunto"],
                                   MenBloquearRespuesta = (byte)data["MenBloquearRespuesta"],
                                   MenFecha = (string)data["MenFecha"],
                                   MenMensaje = (string)data["MenMensaje"],
                                   MenOkRecibido = (byte)data["MenOkRecibido"],
                                   PerApellidos = (string)data["PerApellidos"],
                                   PerNombres = (string)data["PerNombres"],
                                   MenColor = (string)data["MenColor"],
                                   BanHoraLeido = data["BanHoraLeido"] is DBNull ? new Nullable<DateTime>() :(DateTime)data["BanHoraLeido"],
                               });

            return objlstResultado;
        }

        public int GetCountMensaje(int usuario) {
            ColegioContext objCnn = new ColegioContext();

            return objCnn.bandeja_entrada.Where(c => c.BanUsuario == usuario && c.BanHoraLeido == null).Count();

        }

        public ResponseDTO MarcarLeido(LeidoDTO mensaje,int usuario)
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            BandejaEntrada _mensaje = objCnn.bandeja_entrada.Where(c => c.BanMsnId == mensaje.IdMensaje && c.BanUsuario==usuario).FirstOrDefault();
            if (_mensaje!=null)
            {
                if (_mensaje.BanHoraLeido == null)
                {
                    _mensaje.BanHoraLeido = DateTime.Now;
                }
                if (_mensaje.BanOkRecibido == 0)
                {
                    _mensaje.BanOkRecibido = mensaje.OkRecibido;
                }
                objCnn.SaveChanges();
            }
           

           
            return objresponse;
        }

    }
}
