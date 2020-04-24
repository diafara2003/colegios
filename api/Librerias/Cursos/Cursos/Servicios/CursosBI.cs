using BaseDatos.Contexto;
using Curso.Modelos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Curso.Servicios
{
    public class CursosBI
    {
        public IEnumerable<CursosCustom> Get(int id = 0)
        {

            IEnumerable<CursosCustom> objSeccion = new List<CursosCustom>();
            ColegioContext objCnn = new ColegioContext();
            if (id == 0)
            {
                objSeccion = (from data in objCnn.cursos
                              join t in objCnn.temporada on data.CurTemporada equals t.TempId
                              select new CursosCustom()
                              {
                                  CurCodigo = data.CurCodigo,
                                  CurDescripcion = data.CurDescripcion,
                                  CurEmpId = data.CurEmpId,
                                  CurId = data.CurId,
                                  CurTemporada = data.CurTemporada,
                                  CurTutor = data.CurTutor,
                                  NombreTemporada = t.TempAno.ToString()
                              });
            }
            else
            {
                objSeccion = (from data in objCnn.cursos
                              join t in objCnn.temporada on data.CurTemporada equals t.TempId
                              where data.CurId == id
                              select new CursosCustom()
                              {
                                  CurCodigo = data.CurCodigo,
                                  CurDescripcion = data.CurDescripcion,
                                  CurEmpId = data.CurEmpId,
                                  CurId = data.CurId,
                                  CurTemporada = data.CurTemporada,
                                  CurTutor = data.CurTutor,
                                  NombreTemporada = t.TempAno.ToString()
                              });
            }
            return objSeccion;
        }

        public CursosCustom Save(Trasversales.Modelo.Cursos modelo)
        {
            //  ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();
            CursosCustom objInserted = new CursosCustom();
            try
            {
                objCnn.cursos.Add(modelo);

                objCnn.SaveChanges();

                objInserted = this.Get(modelo.CurId).FirstOrDefault();

                //objresponse.codigo = 1;
                //objresponse.respuesta = "";
            }
            catch (Exception e)
            {

                //objresponse.codigo = -1;
                //objresponse.respuesta = e.Message;
            }
            return objInserted;


        }

        public ResponseDTO Remove(int id)
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
                Trasversales.Modelo.Cursos obj = objCnn.cursos.Find(id);

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

        public ResponseDTO Update(Trasversales.Modelo.Cursos modelo)
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
