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

            obj = (from e in objCnn.estudiante_jardin
                   join gp in objCnn.grupos_estudiantes on e.EstId equals gp.GruEstEstudiante
                   join g in objCnn.grupos on gp.GruEstGrupo equals g.GrId
                   where e.EstEmpresa == empresa
                   select new ConsultaEstudiantesDTO()
                   {
                       id = e.EstId,
                       nombres = e.EstNombres,
                       apellidos = e.EstApellidos,
                       estado = e.EstEstado,
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

            obj.acudientes = new List<Personas>();

            ColegioContext objCnn = new ColegioContext();



            obj.estudiante = objCnn.estudiante_jardin.Find(idPersona);


            obj.acudientes.Add(objCnn.personas.Find(obj.estudiante.Acudiente1));

            if (obj.estudiante.Acudiente2 > 0) obj.acudientes.Add(objCnn.personas.Find(obj.estudiante.Acudiente2));



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

            var persona = objCnn.estudiante_jardin.Find(modelo.id);

            // persona.PerEstado = modelo.estado;


            objCnn.SaveChanges();


            objresultado.codigo = 1;
            objresultado.respuesta = string.Empty;

            return objresultado;
        }


        public AgregarEstudianteDTO Save(AgregarEstudianteDTO modelo, int empresa)
        {

            ColegioContext objCnn = new ColegioContext();

            if (modelo.estudiante.EstId == 0)
            {
                modelo.acudientes.ToList().ForEach(c =>
                {

                    c.PerIdEmpresa = empresa;
                    c.PerTipoPerfil = 3;
                    c.PerEstado = true;
                    c.PerUsuario = c.PerEmail;
                    c.PerClave = c.PerTelefono;
                    c.PerIngreso = false;

                    objCnn.personas.Add(c);


                });

                objCnn.SaveChanges();

                modelo.estudiante.EstEmpresa = empresa;
                modelo.estudiante.EstEstado = true;
                modelo.estudiante.Acudiente1 = modelo.acudientes.FirstOrDefault().PerId;

                if (modelo.acudientes.Count() == 2)
                    modelo.estudiante.Acudiente2 = modelo.acudientes[1].PerId;


                objCnn.estudiante_jardin.Add(modelo.estudiante);

                objCnn.SaveChanges();




                objCnn.grupos_estudiantes.Add(new GruposEstudiantes()
                {
                    GruEstEstudiante = modelo.estudiante.EstId,
                    GruEstGrupo = modelo.grupo.id
                });

                objCnn.SaveChanges();
            }
            else
            {



                modelo.acudientes.ToList().ForEach(c => objCnn.UpdateEntity<Personas>(c));


                objCnn.UpdateEntity<EstudianteJardin>(modelo.estudiante);


                objCnn.grupos_estudiantes.Where(c => c.GruEstEstudiante == modelo.estudiante.EstId).ToList().ForEach(c => objCnn.Entry(c).State = EntityState.Deleted);

                objCnn.grupos_estudiantes.Add(new GruposEstudiantes()
                {
                    GruEstEstudiante = modelo.estudiante.EstId,
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

            objCnn.grupos_estudiantes.Where(c => c.GruEstEstudiante == id).ToList().ForEach(c => objCnn.grupos_estudiantes.Remove(c));



            var estudiante = objCnn.estudiante_jardin.Where(c => c.EstId == id).FirstOrDefault();


            objCnn.estudiante_jardin.Remove(estudiante);
            objCnn.personas.Remove(persona);

            objCnn.SaveChanges();
        }
    }
}
