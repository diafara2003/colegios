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
        public int MenCategoriaId { get; set; }
        public int MenClase { get; set; }
        [MaxLength(2)]
        public string MenTipoMsn { get; set; }
        [MaxLength(100)]
        public string MenAsunto { get; set; }
        [MaxLength(8000)]
        public string MenMensaje { get; set; }
        public DateTime MenFecha { get; set; }
        public int MenReplicaIdMsn { get; set; }
        public byte MenOkRecibido { get; set; }
        public byte MenBloquearRespuesta { get; set; }
        public string MenSendTo { get; set; }
        public int MenEstado { get; set; }
        public DateTime? MenFechaMaxima { get; set; }
    }
}
