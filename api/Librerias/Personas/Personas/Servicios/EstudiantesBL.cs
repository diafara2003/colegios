using BaseDatos.Contexto;
using Persona.Modelos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;
using Utilidades.Servicios;

namespace Persona.Servicios
{
    public class EstudiantesBL<T> : EntityGenerics<T> where T : class
    {

        public IEnumerable<ConsultaEstudiantesDTO> Get(int empresa, int temporada)
        {

            List<ConsultaEstudiantesDTO> obj = new List<ConsultaEstudiantesDTO>();
            ColegioContext objCnn = new ColegioContext();

            obj = (from e in objCnn.estudiantes
                   join p in objCnn.personas on e.EstIdPersona equals p.PerId
                   join gp in objCnn.grupos_estudiantes on e.EstIdPersona equals gp.GruEstEstudiante
                   join g in objCnn.grupos on gp.GruEstGrupo equals g.GrId
                   where p.PerIdEmpresa == empresa && p.PerTipoPerfil == 2
                   select new ConsultaEstudiantesDTO()
                   {
                       id = p.PerId,
                       nombres = p.PerNombres,
                       apellidos = p.PerApellidos,
                       estado = p.PerEstado,
                       grupo = new CustomGrupo()
                       {
                           id = g.GrId,
                           nombre = g.GrNombre
                       }
                   }).ToList();

            return obj;

        }



        public AgregarEstudianteDTO GetEspecific(int empresa, int temporada, int idPersona)
        {

            AgregarEstudianteDTO obj = new AgregarEstudianteDTO();
            ColegioContext objCnn = new ColegioContext();



            obj.persona = objCnn.personas.Find(idPersona);
            obj.estudiante = objCnn.estudiantes.Where(c => c.EstIdPersona == idPersona).FirstOrDefault();
            obj.grupo = (from ge in objCnn.grupos_estudiantes
                         join g in objCnn.grupos on ge.GruEstGrupo equals g.GrId
                         where ge.GruEstEstudiante == idPersona
                         select new CustomGrupo()
                         {
                             id = g.GrId,
                             nombre = g.GrNombre
                         }).FirstOrDefault();

            return obj;

        }

        public ResponseDTO Update(ActualizarGrupoEstudianteDTO modelo)
        {
            ColegioContext objCnn = new ColegioContext();
            ResponseDTO objresultado = new ResponseDTO();


            var grupo = objCnn.grupos_estudiantes.Where(c => c.GruEstEstudiante == modelo.id).FirstOrDefault();

            grupo.GruEstGrupo = modelo.idgrupo;

            var persona = objCnn.personas.Find(modelo.id);

            persona.PerEstado = modelo.estado;


            objCnn.SaveChanges();


            objresultado.codigo = 1;
            objresultado.respuesta = string.Empty;

            return objresultado;
        }


        public AgregarEstudianteDTO Save(AgregarEstudianteDTO modelo, int empresa)
        {

            ColegioContext objCnn = new ColegioContext();

            modelo.persona.PerIdEmpresa = empresa;
            modelo.persona.PerTipoPerfil = 2;
            modelo.persona.PerEstado = true;

            if (modelo.persona.PerId == 0)
            {


                objCnn.personas.Add(modelo.persona);

                objCnn.SaveChanges();


                modelo.estudiante.EstIdPersona = modelo.persona.PerId;
                modelo.estudiante.EstNombresEstudiante = modelo.persona.PerNombres + ' ' + modelo.persona.PerApellidos;

                objCnn.estudiantes.Add(modelo.estudiante);

                objCnn.grupos_estudiantes.Add(new GruposEstudiantes()
                {
                    GruEstEstudiante = modelo.persona.PerId,
                    GruEstGrupo = modelo.grupo.id
                });

                objCnn.SaveChanges();
            }
            else
            {



                objCnn.UpdateEntity<Personas>(modelo.persona);
                objCnn.UpdateEntity<Estudiantes>(modelo.estudiante);


                objCnn.grupos_estudiantes.Where(c => c.GruEstEstudiante == modelo.persona.PerId).ToList().ForEach(c => objCnn.Entry(c).State = EntityState.Deleted);

                objCnn.grupos_estudiantes.Add(new GruposEstudiantes()
                {
                    GruEstEstudiante = modelo.persona.PerId,
                    GruEstGrupo = modelo.grupo.id
                });

                objCnn.SaveChanges();

            }


            return modelo;
        }

        public void DeleteEstudiante(int id)
        {

            ColegioContext objCnn = new ColegioContext();


            var persona = objCnn.personas.Find(id);

            objCnn.grupos_estudiantes.Where(c => c.GruEstEstudiante == id).ToList().ForEach(c =>
            {

                objCnn.grupos_estudiantes.Remove(c);
            });

            var estudiante = objCnn.estudiantes.Where(c => c.EstIdPersona == id).FirstOrDefault();

            objCnn.estudiantes.Remove(estudiante);

            objCnn.personas.Remove(persona);

            objCnn.SaveChanges();
        }
    }
}
