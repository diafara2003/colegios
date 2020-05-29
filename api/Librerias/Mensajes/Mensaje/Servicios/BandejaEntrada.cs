using BaseDatos.Contexto;
using System.Collections.Generic;
using BaseDatos.Modelos;
using System.Data;
using Mensaje.Modelos;
using System;

namespace Mensaje.Servicios
{
    public class BandejaEntrada
    {

        public IEnumerable<BandejaEntradaDTO> Get(int usuario)
        {

            ColegioContext objCnn = new ColegioContext();
            ProcedureDTO ProcedureDTO = new ProcedureDTO();
            IEnumerable<BandejaEntradaDTO> objlstResultado = new List<BandejaEntradaDTO>();

            ProcedureDTO.commandText = "MSN.[ConsultarMensaje]";
            ProcedureDTO.parametros.Add("usuario", usuario);

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
                               });

            return objlstResultado;
        }

    }
}
