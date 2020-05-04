using BaseDatos.Contexto;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;
namespace Persona.Servicios
{
    public class PersonasBI
    {
        public IEnumerable<Personas> Get(int id = 0)
        {
            IEnumerable<Personas> objSeccion = new List<Personas>();
            ColegioContext objCnn = new ColegioContext();

            if (id == 0)
                objSeccion = (from data in objCnn.personas select data).OrderBy(c => c.PerApellidos);
            else
                objSeccion = (from data in objCnn.personas where data.PerId == id select data).OrderBy(c => c.PerApellidos);
            return objSeccion;
        }

        public IEnumerable<Personas> Get(string filter = "", int tipo = 0)
        {
            IEnumerable<Personas> objSeccion = new List<Personas>();
            ColegioContext objCnn = new ColegioContext();

            if (filter == string.Empty)
                objSeccion = (from data in objCnn.personas
                              where data.PerEstado && data.PerTipoPerfil == tipo
                              select data).OrderBy(c => c.PerApellidos);
            else
                objSeccion = (from data in objCnn.personas
                              where data.PerEstado
                              && data.PerTipoPerfil == tipo
                                && data.PerNombres.Contains(filter) || data.PerApellidos.Contains(filter)
                              select data).OrderBy(c => c.PerApellidos); ;
            return objSeccion;
        }

        public IEnumerable<Personas> GetEstudiantesSinAsignar(int curso = 0)
        {
            IEnumerable<Personas> objSeccion = new List<Personas>();
            ColegioContext objCnn = new ColegioContext();

            if (curso == 0)
            {
                objSeccion = (from estudiantes in objCnn.personas

                              join cursos in objCnn.curso_estudiantes on estudiantes.PerId equals cursos.CurEstEstudianteId into CursoEstudiante
                              from cursoest in CursoEstudiante.DefaultIfEmpty()

                              where estudiantes.PerTipoPerfil == 2 && cursoest.CurEstId == null
                              select estudiantes).OrderBy(c => c.PerApellidos);
            }
            else
            {
                objSeccion = (from curest in objCnn.curso_estudiantes
                              join estudiantes in objCnn.personas on curest.CurEstEstudianteId equals estudiantes.PerId
                              where estudiantes.PerTipoPerfil == 2 && curest.CurEstCursoId == curso
                              select estudiantes).OrderBy(c => c.PerApellidos);
            }

            return objSeccion;
        }

        public Personas Save(Personas modelo)
        {
            //  ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
                objCnn.personas.Add(modelo);

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
                Personas obj = objCnn.personas.Find(id);

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

        public ResponseDTO Update(Personas modelo)
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
