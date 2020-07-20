
using Trasversales.Modelo;

namespace Mensaje.Modelos
{
  public  class CategoriaPerfilCustom
    {
        public int id { get; set; }
        public int idPerfil { get; set; }
        public string nombrePerfil { get; set; }
        public int enUso { get; set; }
    }

    public class EliminarPerfilCategoria {


        public int id_perfil { get; set; }
        public int id_categoria { get; set; }
    }
}
