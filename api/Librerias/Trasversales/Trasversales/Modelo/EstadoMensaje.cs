using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Trasversales.Modelo
{
    [Table("EstadoMensaje",Schema ="msn")]
    public  class EstadoMensaje
    {
        [Key]
        public int EstMenId { get; set; }
        [StringLength(50)]
        public string EstMenDescripcion { get; set; }
        public byte EstMenEstado { get; set; }
    }
}

