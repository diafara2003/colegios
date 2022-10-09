
using System.Collections.Generic;

namespace Adjuntos.Modelos
{
    public class DocumentosPendientesEstudianteDTO
    {
        public int codigo { get; set; }
        public string nombreGuupo { get; set; }
        public int totalDocumentos { get; set; }
        public int totalDocumentosSubidos { get; set; }
        public string nombreEstudiante { get; set; }
    }

    public class EstudiantesGruposDTO
    {

        public int codigo { get; set; }
        public string nombre { get; set; }


        public List<DocuemntosEstudianteDTO> documentos { get; set; }
    }

    public class DocuemntosEstudianteDTO
    {

        public int idDocReq { get; set; }
        public string nombreDocReq { get; set; }
        public string nombreAdjunto { get; set; }
        public string rutaAdjunto { get; set; }
    }
}
