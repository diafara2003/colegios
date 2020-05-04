

using Trasversales.Modelo;

namespace Clase.Modelos
{
   public class AisgnarMateriaClaseCustom
    {
        public AisgnarMateriaClaseCustom()
        {
            this.clases = new AsignarClases();
            this.response = new ResponseDTO();
        }
        public ResponseDTO response { get; set; }
        public AsignarClases clases { get; set; }
    }
}
