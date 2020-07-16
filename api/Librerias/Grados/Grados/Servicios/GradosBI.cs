using BaseDatos.Contexto;
using Grado.Modelos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Grado.Servicios
{
    public class GradosBI
    {
        public IEnumerable<Grados> Get(int empresa)
        {
            IEnumerable<Grados> objSeccion = new List<Grados>();
            ColegioContext objCnn = new ColegioContext();

            objSeccion = (from data in objCnn.grados where data.GraEmpId == empresa select data).OrderBy(c => c.GraOrden);
            return objSeccion;
        }

        public IEnumerable<Grados> GetGradoAC(int empresa, string filter = "")
        {
            IEnumerable<Grados> objSeccion = new List<Grados>();
            ColegioContext objCnn = new ColegioContext();

            objSeccion = (from data in objCnn.grados
                          where data.GraEmpId == empresa
                          && data.GraDescripcion.ToLower().Contains(filter.ToLower())
                          select data).OrderBy(c => c.GraOrden);
            return objSeccion;
        }

        public Grados Save(Grados modelo)
        {
            //  ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
                objCnn.grados.Add(modelo);

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
                Grados obj = objCnn.grados.Find(id);

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

        public ResponseDTO Update(Grados modelo)
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

        public GradoEstudianteDTO GetGrdoCursoXUsuario(int usuario)
        {
            ColegioContext objCnn = new ColegioContext();

            return (from _c in objCnn.cursos
                    join _g in objCnn.grados on _c.CurGrado equals _g.GraId
                    join _ce in objCnn.curso_estudiantes on _c.CurId equals _ce.CurEstCursoId
                    select new GradoEstudianteDTO()
                    {
                        CursoId = _c.CurId,
                        GradiId = _g.GraId,
                        NombreCurso = _c.CurDescripcion,
                        NombreGrado = _g.GraDescripcion
                    }).FirstOrDefault();
        }
    }
}
