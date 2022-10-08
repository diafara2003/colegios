
namespace Documentacion.Modelos
{
    public class DocumentacionDTO
    {
        public int id { get; set; }
        public string nombre { get; set; }
    }

    public class AddDocumentacionDTO
    {
        public string nombre { get; set; }
    }

    public class DeleteDocumentacionDTO
    {
        public int id { get; set; }
    }
}
