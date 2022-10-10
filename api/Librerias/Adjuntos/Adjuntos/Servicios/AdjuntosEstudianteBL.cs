using Adjuntos.Modelos;
using BaseDatos.Contexto;
using System.Collections.Generic;
using System.Linq;
using BaseDatos.Modelos;
using System.Data;

namespace Adjuntos.Servicios
{
    public class AdjuntosEstudianteBL
    {
        public List<DocumentosEstudianteDTO> GetDocumentosEstudiante(int idEstudiante,int empresa)
        {
            ColegioContext objCnn = new ColegioContext();
            List<DocumentosPendientesEstudianteDTO> objResponse = new List<DocumentosPendientesEstudianteDTO>();


            ProcedureDTO ProcedureDTO = new ProcedureDTO();

            ProcedureDTO.commandText = "DocReqEstudiante";
            ProcedureDTO.parametros.Add("idest", idEstudiante);
            ProcedureDTO.parametros.Add("emp", empresa);


            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);

            return (from r in result.AsEnumerable()
                    select new DocumentosEstudianteDTO
                    {
                        id=(int)r["AjdId"],
                        extension= (string)r["AjdExtension"],
                        nombreAdj = (string)r["AdjNombre"],
                        nombreDocReq= (string)r["DocTexto"],
                    }).ToList();

        }
    }
}
