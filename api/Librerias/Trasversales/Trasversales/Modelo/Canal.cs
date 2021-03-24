using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Trasversales.Modelo
{
    [Table("Canal", Schema = "msn")]
    public class Canal
    {
        [Key]
        public int CnlId { get; set; }
        public int CnlPerIDenvia { get; set; }
        public int CnlPerIdRecibe { get; set; }
        public string CnlMensaje { get; set; }
        public DateTime CnlFecha { get; set; }
        public DateTime CnlLeido { get; set; }
        public bool CnlIsLiked { get; set; }

    }
}
