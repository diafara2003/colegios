
using BaseDatos.Contexto;
using Clases.Modelos;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using BaseDatos.Modelos;
namespace Clases.Servicios
{
    public class ClasesBI
    {

        public IEnumerable<AsignarClases> GetAsignarClases(int empresa,int grado=0)
        {
            IEnumerable<AsignarClases> objlst = new List<AsignarClases>();
            ColegioContext objCnn = new ColegioContext();
            ProcedureDTO ProcedureDTO = new ProcedureDTO();

            ProcedureDTO.commandText = "AsignarClases";
            ProcedureDTO.parametros.Add("empresa", empresa);
            ProcedureDTO.parametros.Add("gradoId", grado);

            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);


            objlst = (from data in result.AsEnumerable()
                      select new AsignarClases()
                      {

                      });

            return objlst;
        }
    }
}
