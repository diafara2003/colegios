using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("UsuarioPerfil")]
    public class UsuarioPerfil
    {
        [Key]
        public int UsuPerId { get; set; }
        public int UsuEmpId { get; set; }
        [MaxLength(50)]
        public string UsuPerDescripcion { get; set; }

        public bool UsuPerEstado { get; set; }
    }
}
