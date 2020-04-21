using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Trasversales.Modelo
{
    [Table("Profesores", Schema = "DP")]
  public  class Profesores
    {
        [Key]
        public int ProfId { get; set; }
        public int ProfIdPersona { get; set; }
        public string ProfProfesion { get; set; }
    }
}
