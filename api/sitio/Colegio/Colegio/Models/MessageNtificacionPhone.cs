using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Colegio.Models
{
    public class MessageNotificacionPhone
    {
        public string token { get; set; }
        public string data { get; set; }
        public Notificacions notification { get; set; }
    }

    public class Notificacions {
        public string title { get; set; }
        public string body { get; set; }

    }
}