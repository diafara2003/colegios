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
        public IEnumerable<CursosCustom> Get(int id = 0, int empresa = 0)
        {
            ColegioContext objCnn = new ColegioContext();
            IEnumerable<CursosCustom> objSeccion = new List<CursosCustom>();
            int temporada_activa = objCnn.temporada.Where(C => C.TempEstado == 1).FirstOrDefault().TempId;

            if (id == 0)
            {
                objSeccion = (from data in objCnn.cursos
                              join t in objCnn.temporada on data.CurTemporada equals t.TempId
                              join grado in objCnn.grados on data.CurGrado equals grado.GraId

                              join salon in objCnn.salones on data.CurSalon equals salon.SalId into CursoSalon
                              from cursosalon in CursoSalon.DefaultIfEmpty()

                              join tutor in objCnn.personas on data.CurTutor equals tutor.PerId into CursoTutor
                              from tutorPersona in CursoTutor.DefaultIfEmpty()

                              join auxiliar in objCnn.personas on data.CurAuxiliar equals auxiliar.PerId into CursoAuxiliar
                              from auxiliarPersona in CursoAuxiliar.DefaultIfEmpty()
                              where data.CurTemporada == temporada_activa
                              && data.CurEmpId == empresa
                              select new CursosCustom()
                              {
                                  CurCodigo = data.CurCodigo,
                                  CurDescripcion = data.CurDescripcion,
                                  CurEmpId = data.CurEmpId,
                                  CurId = data.CurId,
                                  CurTemporada = data.CurTemporada,
                                  CurTutor = data.CurTutor,
                                  CurGrado = data.CurGrado,
                                  NombreTemporada = t.TempAno.ToString(),
                                  Nombretutor = string.IsNullOrEmpty(tutorPersona.PerNombres) ? string.Empty : tutorPersona.PerNombres,
                                  NombreAuxiliar = string.IsNullOrEmpty(auxiliarPersona.PerNombres) ? string.Empty : auxiliarPersona.PerNombres,
                                  NombreGrado = string.IsNullOrEmpty(grado.GraDescripcion) ? string.Empty : grado.GraDescripcion,
                                  NombreSalon = string.IsNullOrEmpty(cursosalon.SalDescripcion) ? string.Empty : cursosalon.SalDescripcion,
                              });
            }
            else
            {
                objSeccion = (from data in objCnn.cursos

                              join t in objCnn.temporada on data.CurTemporada equals t.TempId
                              join grado in objCnn.grados on data.CurGrado equals grado.GraId

                              join salon in objCnn.salones on data.CurSalon equals salon.SalId into CursoSalon
                              from cursosalon in CursoSalon.DefaultIfEmpty()

                              join tutor in objCnn.personas on data.CurTutor equals tutor.PerId into CursoTutor
                              from tutorPersona in CursoTutor.DefaultIfEmpty()

                              join auxiliar in objCnn.personas on data.CurAuxiliar equals auxiliar.PerId into CursoAuxiliar
                              from auxiliarPersona in CursoAuxiliar.DefaultIfEmpty()

                              where data.CurId == id
                              && data.CurEmpId == empresa
                              select new CursosCustom()
                              {
                                  CurCodigo = data.CurCodigo,
                                  CurDescripcion = data.CurDescripcion,
                                  CurEmpId = data.CurEmpId,
                                  CurId = data.CurId,
                                  CurGrado = data.CurGrado,
                                  CurTemporada = data.CurTemporada,
                                  CurTutor = data.CurTutor,
                                  NombreTemporada = t.TempAno.ToString(),
                                  Nombretutor = string.IsNullOrEmpty(tutorPersona.PerNombres) ? string.Empty : tutorPersona.PerNombres,
                                  NombreAuxiliar = string.IsNullOrEmpty(auxiliarPersona.PerNombres) ? string.Empty : auxiliarPersona.PerNombres,
                                  NombreGrado = string.IsNullOrEmpty(grado.GraDescripcion) ? string.Empty : grado.GraDescripcion,
                                  NombreSalon = string.IsNullOrEmpty(cursosalon.SalDescripcion) ? string.Empty : cursosalon.SalDescripcion,
                              });
            }
            return objSeccion;
        }

        public IEnumerable<Cursos> GetCursosAC(string filter = "", int empresa = 0)
        {
            ColegioContext objCnn = new ColegioContext();

            return objCnn.cursos.Where(c => c.CurEmpId == empresa && c.CurDescripcion.ToLower().Contains(filter.ToLower())).Take(10);
        }

        public IEnumerable<Cursos> GetCursosGrados(int idgrado, int empresa)
        {
            ColegioContext objCnn = new ColegioContext();
            int temporada_activa = objCnn.temporada.Where(C => C.TempEstado == 1).FirstOrDefault().TempId;

            return (from curso in objCnn.cursos
                    where curso.CurGrado == idgrado && curso.CurTemporada == temporada_activa
                    && curso.CurEmpId == empresa
                    select curso);
        }

        public CursoEstudiantes AsignarEstudianteCurso(CursoEstudiantes request)
        {
            ColegioContext objCnn = new ColegioContext();
            CursoEstudiantes objInserted = new CursoEstudiantes();


            objCnn.curso_estudiantes.Add(request);

            objCnn.SaveChanges();

            return request;
        }

        public ResponseDTO QuitarEstudianteCurso(CursoEstudiantes request)
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
                Trasversales.Modelo.CursoEstudiantes obj = (from data in objCnn.curso_estudiantes
                                                            where data.CurEstCursoId == request.CurEstCursoId
                                                            && data.CurEstEstudianteId == request.CurEstEstudianteId
                                                            select data).FirstOrDefault();

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

        public ResponseCursoCustom Update(Trasversales.Modelo.Cursos modelo)
        {
            ResponseCursoCustom objresponse = new ResponseCursoCustom();
            ColegioContext objCnn = new ColegioContext();

            try
            {

                objCnn.Entry(modelo).State = EntityState.Modified;

                objCnn.SaveChanges();

                objresponse.resultado.codigo = 1;
                objresponse.resultado.respuesta = "";

                objresponse.curso = this.Get(modelo.CurId).FirstOrDefault();
            }
            catch (Exception e)
            {

                objresponse.resultado.codigo = -1;
                objresponse.resultado.respuesta = e.Message;
            }
            return objresponse;


        }
    }
}
