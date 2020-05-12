using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("BandejaEntrada",Schema ="msn")]
    public class BandejaEntrada
    {
        [Key]
        public int BanId { get; set; }
        public int BanMsnId { get; set; }
        public int BanEstado { get; set; }
        public int BanUsuario { get; set; }
        public DateTime? BanHoraLeido { get; set; }
        public byte BanOkRecibido { get; set; }
        public DateTime? BanOkRecibidoFecha { get; set; }
    }
}
