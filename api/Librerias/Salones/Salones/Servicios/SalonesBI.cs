using BaseDatos.Contexto;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Salon.Servicios
{
    public class SalonesBI
    {
        public IEnumerable<Trasversales.Modelo.Salones> Get(string filter = "")
        {

            IEnumerable<Trasversales.Modelo.Salones> objSeccion = new List<Trasversales.Modelo.Salones>();
            ColegioContext objCnn = new ColegioContext();

            if (filter == "")
            {
                objSeccion = (from data in objCnn.salones select data);
            }
            else
            {
                objSeccion = (from data in objCnn.salones
                              where data.SalCodigo.Contains(filter) || data.SalDescripcion.Contains(filter)
                              select data
                              );
            }

            return objSeccion;
        }

        public Trasversales.Modelo.Salones Save(Trasversales.Modelo.Salones modelo)
        {
            //  ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
                objCnn.salones.Add(modelo);

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
                Trasversales.Modelo.Salones obj = objCnn.salones.Find(id);

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

        public ResponseDTO Update(Trasversales.Modelo.Salones modelo)
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
