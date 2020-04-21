using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Mensajes", Schema = "msn")]
    public    class Mensajes
    {
        [Key]
        public int MenId { get; set; }
        public int MenEmpId { get; set; }
        public int MenUsuario { get; set; }
        [MaxLength(2)]
        public string MenTipoMsn { get; set; }
        [MaxLength(100)]
        public string MenAsuto { get; set; }
        [MaxLength(8000)]
        public string MenMensaje { get; set; }
        public DateTime MenFecha { get; set; }
        public int MenReplicaIdMsn { get; set; }
        public byte MenOkRecibido { get; set; }
    }
}
