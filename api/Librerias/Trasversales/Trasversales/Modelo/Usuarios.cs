using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Usuarios")]
    public class Usuarios
    {
        [Key]
        public int IdUsuario { get; set; }
        public int UsuPersona { get; set; }
        public string UsuUsuario { get; set; }
        public string UsuClave { get; set; }
        public int UsuTipoPerfil { get; set; }
        public byte UsuEstado { get; set; }
    }
}
