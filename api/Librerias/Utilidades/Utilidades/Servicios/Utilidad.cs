using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Xml;
using System.Xml.Serialization;

namespace Utilidades.Servicios
{
    public class Utilidad
    {
        public static String ObjectToXMLGeneric<T>(T filter)
        {

            string xml = null;
            using (StringWriter sw = new StringWriter())
            {

                XmlSerializer xs = new XmlSerializer(typeof(T));
                xs.Serialize(sw, filter);
                try
                {
                    xml = sw.ToString();

                }
                catch (Exception e)
                {
                    throw e;
                }
            }
            return xml;
        }

        public static string EnviarMensajeCorreo() {
            //Creando objeto MailMessage
            MailMessage email = new MailMessage();
            email.To.Add(new MailAddress("diafara2003@gmail.com"));
            email.To.Add(new MailAddress("cachar@gmail.com"));
            email.From = new MailAddress("Notificaciones@comunicatecolegios.com");
            email.Subject = "Registro de padre";
            email.Body = "Cualquier contenido en <b>HTML</b> para enviarlo por correo electrónico.";
            email.IsBodyHtml = true;
            email.Priority = MailPriority.Normal;

            //Definir objeto SmtpClient
            SmtpClient smtp = new SmtpClient();
            smtp.Host = "mail.comunicatecolegios.com";
            //smtp.Port = 2525;
            smtp.EnableSsl = false;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential("Notificaciones@comunicatecolegios.com", "Notifica1_");

            string output = null;


           // Enviar correo electronico
            try
            {
                smtp.Send(email);
                email.Dispose();
                output = "Corre electrónico fue enviado satisfactoriamente.";
            }
            catch (Exception ex)
            {
                output = "Error enviando correo electrónico: " + ex.Message;
            }
            return output;
        }

        public static T XMLToObject<T>(string xml)
        {

            var serializer = new XmlSerializer(typeof(T));

            using (var textReader = new StringReader(xml))
            {
                using (var xmlReader = XmlReader.Create(textReader))
                {
                    return (T)serializer.Deserialize(xmlReader);
                }
            }
        }
    }
}
