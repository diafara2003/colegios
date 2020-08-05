using BaseDatos.Contexto;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Materia.Servicios
{
    public class AreaMateria
    {
        public IEnumerable<AreasMaterias> Get()
        {
            IEnumerable<AreasMaterias> objSeccion = new List<AreasMaterias>();
            ColegioContext objCnn = new ColegioContext();

            objSeccion = (from data in objCnn.areas_materias select data);
            return objSeccion;
        }

        public AreasMaterias Save(AreasMaterias modelo)
        {
            //  ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
                objCnn.areas_materias.Add(modelo);

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
                AreasMaterias obj = objCnn.areas_materias.Find(id);

                //se valida si el area tiene materias asignadas
                int objmaterias = objCnn.materias.Where(c => c.MatAreaId == obj.ArMaId).Count();

                if (objmaterias == 0)
                {

                    objCnn.Entry(obj).State = EntityState.Deleted;

                    objCnn.SaveChanges();

                    objresponse.codigo = 1;
                    objresponse.respuesta = "";
                }
                else
                {
                    objresponse.codigo = -1;
                    objresponse.respuesta = string.Format("No se puede eliminar porque tiene asignado {0} materias", objmaterias);
                }

            }
            catch (Exception e)
            {

                objresponse.codigo = -1;
                objresponse.respuesta = e.Message;
            }
            return objresponse;


        }

        public ResponseDTO Update(AreasMaterias modelo)
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
