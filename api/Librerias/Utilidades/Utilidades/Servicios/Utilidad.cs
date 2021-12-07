using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Web;
using System.Xml;
using System.Xml.Serialization;

namespace Utilidades.Servicios
{

    public class MailDTO
    {

        public int MyProperty { get; set; }
    }

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


        public static string GenerarclaveRandom()
        {

            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var stringChars = new char[8];
            var random = new Random();
            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }
            var finalString = new String(stringChars);

            return finalString;
        }

        static string CreaeBody(string clave)
        {

            string body = string.Empty;

            using (StreamReader reader = new StreamReader(HttpContext.Current.Server.MapPath("~/TemplateMail/Education.html")))
            {
                body = reader.ReadToEnd();
            }
            body = body.Replace("{clave}", clave);

            return body;
        }

        public static string EnviarMensajeCorreo(List<string> correos, string clave)
        {
            //Creando objeto MailMessage
            MailMessage email = new MailMessage();


            correos.ForEach(c => email.To.Add(new MailAddress(c)));


            email.From = new MailAddress("Notificaciones@comunicatecolegios.com");
            email.Subject = "Registro de padre";
            email.Body = CreaeBody(clave);
            email.IsBodyHtml = true;
            email.Priority = MailPriority.Normal;

            //Definir objeto SmtpClient
            SmtpClient smtp = new SmtpClient();
            smtp.Host = "comunicatecolegios.com";
            smtp.Port = 25;
            smtp.EnableSsl = false;
            smtp.UseDefaultCredentials = false;
            smtp.Credentials = new NetworkCredential("Notificaciones@comunicatecolegios.com", "Comunicate123*");

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
