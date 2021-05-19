using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Colegio.Models
{
    public class MessageNotificacionPhone
    {
        public string priority { get; set; }
        public DataMessage data { get; set; }
        public Notificacions notification { get; set; }
        public List<string> to { get; set; }
    }

    public class DataMessage {
        public int mensaje { get; set; }
    }

    public class Notificacions {
        public string title { get; set; }
        public string body { get; set; }

    }
}

