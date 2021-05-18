using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{

    [Table("LoginPhone", Schema = "DP")]
    public class LoginPhone
    {
        [Key]
        public int LgId { get; set; }

        public int UsuarioId { get; set; }
        
        public string TokenFCM { get; set; }
    }
}
