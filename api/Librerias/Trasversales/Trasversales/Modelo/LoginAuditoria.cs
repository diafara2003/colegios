using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("LoginAuditoria")]
    public class LoginAuditoria
    {
        [Key]
        public int LogId { get; set; }
        public int LogPersonaId { get; set; }
        public DateTime LogFecha { get; set; }
    }
}
