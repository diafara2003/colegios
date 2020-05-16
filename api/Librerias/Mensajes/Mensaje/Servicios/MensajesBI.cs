using BaseDatos.Contexto;
using Mensaje.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Mensaje.Servicios
{
    public class MensajesBI
    {

        public Mensajes Get(int id)
        {
            ColegioContext objCnn = new ColegioContext();


            return (from mensaje in objCnn.mensajes
                    where mensaje.MenId == id
                    select mensaje).FirstOrDefault();
        }

        public Mensajes Save(CrearMensajeCustom request)
        {
            ColegioContext objCnn = new ColegioContext();

            try
            {

                request.mensaje.MenFecha = DateTime.Now;
                objCnn.mensajes.Add(request.mensaje);
                objCnn.SaveChanges();


                objCnn = new ColegioContext();
                //por cada destinatario se inserta en la tabla bandeja de entrada
                request.destinatarios.ForEach(p =>
                {
                    objCnn.bandeja_entrada.Add(new BandejaEntrada()
                    {
                        BanEstado = 0,
                        BanId = 0,
                        BanMsnId = request.mensaje.MenId,
                        BanUsuario = p                        
                    });

                });

                objCnn.SaveChanges();

            }
            catch (Exception e)
            {
            }
            return request.mensaje;

        }


    }
}
