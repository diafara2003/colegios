using BaseDatos.Contexto;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Temporadas.Servicios
{
    public class TemporadaBI
    {
        public IEnumerable<Temporada> Get()
        {
            IEnumerable<Temporada> objSeccion = new List<Temporada>();
            ColegioContext objCnn = new ColegioContext();

            objSeccion = (from data in objCnn.temporada select data);
            return objSeccion;
        }

        public Temporada Save(Temporada modelo)
        {
          //  ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
                objCnn.temporada.Add(modelo);

                objCnn.SaveChanges();

                //objresponse.codigo = 1;
                //objresponse.respuesta = "";
            }
            catch (Exception e)
            {

                //objresponse.codigo = -1;
                //objresponse.respuesta = e.Message;
            }
            return modelo;


        }

        public ResponseDTO Remove(int id)
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
                Temporada obj = objCnn.temporada.Find(id);

                objCnn.Entry(obj).State = EntityState.Deleted;

                objCnn.SaveChanges();

                objresponse.codigo = 1;
                objresponse.respuesta = "";
            }
            catch (Exception e)
            {

                objresponse.codigo = -1;
                objresponse.respuesta = e.Message;
            }
            return objresponse;


        }

        public ResponseDTO Update(Temporada modelo)
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
               
                objCnn.Entry(modelo).State = EntityState.Modified;

                objCnn.SaveChanges();

                objresponse.codigo = 1;
                objresponse.respuesta = "";
            }
            catch (Exception e)
            {

                objresponse.codigo = -1;
                objresponse.respuesta = e.Message;
            }
            return objresponse;


        }
    }
}
