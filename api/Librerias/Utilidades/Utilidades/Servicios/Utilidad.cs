using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Net.Mime;
using System.Web;
using System.Xml;
using System.Xml.Serialization;
using Trasversales.Modelo;

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

        static AlternateView CreaeBody(string ruta, Personas usuario, Adjuntos adjunto,string rutaLogo)
        {

            string body = string.Empty;

            using (StreamReader reader = new StreamReader(ruta))
            {
                body = reader.ReadToEnd();
            }

            string nombre = usuario.PerNombres;

            if (!string.IsNullOrEmpty(usuario.PerApellidos)) nombre = usuario.PerNombres + " " + usuario.PerApellidos;
            body = body.Replace("{nombre}", nombre);
            body = body.Replace("{clave}", usuario.PerClave);
            body = body.Replace("{usuario}", usuario.PerUsuario);


            string contentID1 = Guid.NewGuid().ToString().Replace("-", "");
            string contentID2 = Guid.NewGuid().ToString().Replace("-", "");
            string contentID3 = Guid.NewGuid().ToString().Replace("-", "");
            body = body.Replace("{logo}", contentID1);            
            body = body.Replace("{ios}", contentID2);
            body = body.Replace("{android}", contentID3);
            
            

            

            AlternateView AV =
        AlternateView.CreateAlternateViewFromString(body, null, MediaTypeNames.Text.Html);



            LinkedResource Img = new LinkedResource(adjunto.AdjIdRuta, MediaTypeNames.Image.Jpeg);
            Img.ContentId = contentID1;
            Img.TransferEncoding = TransferEncoding.Base64;
            AV.LinkedResources.Add(Img);
            


            LinkedResource iosImage = new LinkedResource(rutaLogo + @"\\ios.png", MediaTypeNames.Image.Jpeg);
            iosImage.ContentId = contentID2;
            iosImage.TransferEncoding = TransferEncoding.Base64;
            AV.LinkedResources.Add(iosImage);

            LinkedResource addroidImage = new LinkedResource(rutaLogo + @"\\android.png", MediaTypeNames.Image.Jpeg);
            addroidImage.ContentId = contentID3;
            iosImage.TransferEncoding = TransferEncoding.Base64;
            AV.LinkedResources.Add(addroidImage);

            return AV;
        }

        public static string EnviarMensajeCorreo(string asunto,string ruta, List<string> correos, Personas usuario, Empresas empresa, Adjuntos adjunto,string rutaLogos)
        {
            //Creando objeto MailMessage
            MailMessage email = new MailMessage();


            correos.ForEach(c => email.To.Add(new MailAddress(c)));


            email.From = new MailAddress("Notificaciones@comunicatecolegios.com");
            email.Subject = asunto;//"Registro de padre";
            //  email.Body = CreaeBody(ruta, usuario);
            email.IsBodyHtml = true;
            email.Priority = MailPriority.Normal;
            email.AlternateViews.Add(CreaeBody(ruta, usuario, adjunto, rutaLogos));
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
