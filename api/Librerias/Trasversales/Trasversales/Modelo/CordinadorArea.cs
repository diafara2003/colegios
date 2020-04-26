using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Trasversales.Modelo
{
   public  class CordinadorArea
    {
        [Key]
        public int CorAreaID { get; set; }
        public int CorAreaTempId { get; set; }
        public int CorAreaMateria { get; set; }
        public int CorAreaCordinador { get; set; }
    }
}
