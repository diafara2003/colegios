using Adjuntos.Modelos;
using BaseDatos.Contexto;
using System.Collections.Generic;
using System.Linq;
using BaseDatos.Modelos;
using System.Data;
using System.IO;

namespace Adjuntos.Servicios
{
    public class AdjuntosEstudianteBL
    {


        public void SaveDocEstudiante(int idAjunto, int idDocReq, int empresa, int idEstudiante)
        {
            ColegioContext objCnn = new ColegioContext();

            var doc = objCnn.documentacion_estudiante.Where(c => c.DocEstIdPersona == idEstudiante
           && c.DocEstIdDoc == idDocReq
            ).FirstOrDefault();

            /*si ya existe un documento asociado al requerido se eliminar y se deja el nuevo*/
            if (doc != null)
            {
                objCnn.Entry(doc).State = System.Data.Entity.EntityState.Deleted;

                var adj = objCnn.adjuntos.Find(doc.DocEstIdAdj);

                if (adj != null)
                {
                    try
                    {
                        if (File.Exists(adj.AdjIdRuta))
                            File.Delete(adj.AdjIdRuta);
                    }
                    catch (System.Exception)
                    {
                    }
                }

            }


            objCnn.documentacion_estudiante.Add(new Trasversales.Modelo.DocumentosEstudiante()
            {
                DocEstId = 0,
                DocEstIdAdj = idAjunto,
                DocEstIdDoc = idDocReq,
                DocEstIdEmpresa = empresa,
                DocEstIdPersona = idEstudiante
            });


            objCnn.SaveChanges();
        }

        public List<DocumentosEstudianteDTO> GetDocumentosEstudiante(int idEstudiante, int empresa)
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
                        id = (int)r["AjdId"],
                        extension = (string)r["AjdExtension"],
                        nombreAdj = (string)r["AdjNombre"],
                        nombreDocReq = (string)r["DocTexto"],
                        idDocReq = (int)r["DocId"],
                    }).ToList();

        }
    }
}
