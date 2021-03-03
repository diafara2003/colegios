using BaseDatos.Contexto;
using Persona.Modelos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utilidades.Servicios;

namespace Persona.Servicios
{
    public class ProfesoresBL<T> : EntityGenerics<T> where T : class
    {

       

        public ConsultaProfesorDTO Get(int empresa, int temporada, int id)
        {
            ColegioContext objCnn = new ColegioContext();



            var profesores = (from data in objCnn.personas
                              where data.PerIdEmpresa == empresa && data.PerEstado
                                    && data.PerId == id
                              select new ConsultaProfesorDTO
                              {
                                  nombre = data.PerNombres,
                                  apellido = data.PerApellidos == null ? string.Empty : data.PerApellidos,
                                  celular = data.PerTelefono == null ? string.Empty : data.PerTelefono,
                                  email = data.PerEmail == null ? string.Empty : data.PerEmail,
                                  id = data.PerId
                              }).FirstOrDefault();


            profesores.grupos = (from g in objCnn.grupos
                                 join gp in objCnn.grupos_profesor on g.GrId equals gp.GruProGrupo
                                 where g.GrEmpresa == empresa && g.GrTemporada == temporada
                                 && gp.GruProProfesor == id
                                 select new CustomGrupo()
                                 {
                                     id = g.GrId,
                                     nombre = g.GrNombre
                                 }
                            );

            return profesores;

        }

        public IEnumerable<ConsultaProfesorDTO> Get(int empresa, int temporada)
        {
            ColegioContext objCnn = new ColegioContext();
            List<ConsultaProfesorDTO> objResult = new List<ConsultaProfesorDTO>();


            var profesores = (from data in objCnn.personas
                              where data.PerIdEmpresa == empresa && data.PerEstado
                               && data.PerTipoPerfil == 1
                              select new ConsultaProfesorDTO
                              {
                                  nombre = data.PerNombres,
                                  apellido = data.PerApellidos == null ? string.Empty : data.PerApellidos,
                                  celular = data.PerTelefono == null ? string.Empty : data.PerTelefono,
                                  email = data.PerEmail == null ? string.Empty : data.PerEmail,
                                  id = data.PerId
                              }).ToList();



            profesores.ForEach(c =>
            {

                c.grupos = (from g in objCnn.grupos
                            join gp in objCnn.grupos_profesor on g.GrId equals gp.GruProGrupo
                            where g.GrEmpresa == empresa && g.GrTemporada == temporada
                                && gp.GruProProfesor == c.id
                            select new CustomGrupo()
                            {
                                id = g.GrId,
                                nombre = g.GrNombre
                            });
            });

            return profesores;
        }

        public void DeleteGrupo(int id)
        {

            ColegioContext objCnn = new ColegioContext();


            var persona = objCnn.personas.Find(id);

            var grupos = (from g in objCnn.grupos
                          join gp in objCnn.grupos_profesor on g.GrId equals gp.GruProGrupo
                          where gp.GruProProfesor == id
                          select gp);



            grupos.ToList().ForEach(c =>
            {
                objCnn.Entry(c).State = EntityState.Deleted;
            });

            objCnn.SaveChanges();

        }


        public IEnumerable<CustomGrupo> Insert(List<CustomGrupo> grupos, int id)
        {

            ColegioContext objCnn = new ColegioContext();

            DeleteGrupo(id);

            grupos.ForEach(c =>
            {

                objCnn.grupos_profesor.Add(new Trasversales.Modelo.GruposProfesor()
                {

                    GruProGrupo = c.id,
                    GruProProfesor = id
                });
            });

            objCnn.SaveChanges();

            return grupos;

        }
    }
}
