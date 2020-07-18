using BaseDatos.Contexto;
using Mensaje.Modelos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Mensaje.Servicios
{
    public class GruposBL
    {

        public IEnumerable<GruposEnvioColores> GetEnvioColores(int empresa)
        {            
            ColegioContext objCnn = new ColegioContext();

            return objCnn.grupo_envio_colores.Where(c => c.GrEnColorEmp == empresa);
        }

        public IEnumerable<GruposEnvioAutorizadoCustom> GetautorizadoGrados(int empresa)
        {
            ColegioContext objCnn = new ColegioContext();

            return (from auto in objCnn.grupo_envio_autorizacion_grados
                    join grado in objCnn.grados on auto.GrEnAuGraGradoId equals grado.GraId
                    join persona in objCnn.personas on auto.GrEnAuGraPersonaId equals persona.PerId
                    where grado.GraEmpId == empresa
                    select new GruposEnvioAutorizadoCustom
                    {
                        Descripcion = grado.GraDescripcion,
                        id = auto.GrEnAuGraId,
                        idPersona = auto.GrEnAuGraPersonaId,
                        idtipo = auto.GrEnAuGraGradoId,
                        Apellidos = persona.PerNombres,
                        Nombres = persona.PerApellidos
                    });
        }

        public IEnumerable<GruposEnvioAutorizadoCustom> GetautorizadoCursos(int empresa)
        {
            ColegioContext objCnn = new ColegioContext();

            return (from auto in objCnn.grupo_envio_autorizacion_cursos
                    join curso in objCnn.cursos on auto.GrEnAuCurCursoId equals curso.CurId
                    join persona in objCnn.personas on auto.GrEnAuCurPersonaId equals persona.PerId
                    where curso.CurEmpId == empresa
                    select new GruposEnvioAutorizadoCustom
                    {
                        Descripcion = curso.CurDescripcion,
                        id = auto.GrEnAuCurId,
                        idPersona = auto.GrEnAuCurPersonaId,
                        idtipo = auto.GrEnAuCurCursoId,
                        Apellidos = persona.PerNombres,
                        Nombres = persona.PerApellidos
                    });
        }

        public IEnumerable<GruposEnvio> GetPersonalizados(int empresa, int temporada)
        {
            ColegioContext objCnn = new ColegioContext();

            return objCnn.grupo_envio.Where(c => c.GruEnvEmpId == empresa && c.GruEnvTemporada == temporada);
        }

        public IEnumerable<Categorias> GetCategorias(int empresa)
        {
            ColegioContext objCnn = new ColegioContext();
            throw new Exception();
            return (from data in objCnn.categorias where data.CatEmpresaId == empresa select data);
        }


        public T Select<T>(int id) where T : class
        {
            return new ColegioContext().GetEntity<T>(id);
        }

        public bool UpdateEnvio<T>(T modelo) where T : class
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(modelo).State = EntityState.Modified;

            objCnn.SaveChanges();
            return true;
        }

        public bool AddAutorizado<T>(T modelo) where T : class
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(modelo).State = EntityState.Added;

            objCnn.SaveChanges();
            return true;
        }

        public bool DeleteAutorizado<T>(T modelo) where T : class
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(modelo).State = EntityState.Deleted;

            objCnn.SaveChanges();
            return true;
        }
    }
}
