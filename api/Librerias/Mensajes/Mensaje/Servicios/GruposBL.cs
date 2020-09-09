using BaseDatos.Contexto;
using BaseDatos.Modelos;
using Mensaje.Modelos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;
using Utilidades.Servicios;

namespace Mensaje.Servicios
{
    public class GruposBL<T> : EntityGenerics<T> where T : class
    {

        public IEnumerable<GruposEnvioColores> GetEnvioColores(int empresa)
        {
            ColegioContext objCnn = new ColegioContext();
            List<GruposEnvioColores> objresultado = new List<GruposEnvioColores>();

            var colores = objCnn.grupo_envio_colores.Where(c => (c.GrEnColorEmp) == empresa);

            colores.ToList().ForEach(c => objresultado.Add(c));

            objCnn.grupo_envio_colores
                .Where(c => c.GrEnColorEmp == null)
                .ToList()
                .ForEach(c =>
                {
                    if (objresultado.Find(x => x.GrEnColorObs.Equals(c.GrEnColorObs)) == null)
                        objresultado.Add(c);
                });

            return objresultado.OrderBy(c => c.GrEnColorObs);

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

        public IEnumerable<Categorias> GetCategorias(int empresa, int perfil = 0)
        {
            ColegioContext objCnn = new ColegioContext();
            List<Categorias> objresultado = new List<Categorias>();

            if (perfil != 0)
                objresultado = (from c in objCnn.categorias
                                join cp in objCnn.categorias_perfil on c.CatId equals cp.CatPerCategoria
                                where c.CatEmpresaId == empresa && cp.CatPerPerfil == perfil
                                select c
                        ).ToList();
            else
                objresultado = (from c in objCnn.categorias
                                    //join cp in objCnn.categorias_perfil on c.CatId equals cp.CatPerCategoria
                                where c.CatEmpresaId == empresa
                                select c
                    ).ToList();



            return objresultado;
        }


        public IEnumerable<CategoriaPerfilCustom> GetCategoriasPerfil(int empresa, int idCategoria)
        {
            ColegioContext objCnn = new ColegioContext();
            List<CategoriaPerfilCustom> objresultado = new List<CategoriaPerfilCustom>();

            objCnn.usuario_perfi.Where(c => c.UsuEmpId == empresa && c.UsuPerEstado).ToList().ForEach(c =>
                   {
                       objresultado.Add(new CategoriaPerfilCustom()
                       {
                           idPerfil = c.UsuPerId,
                           nombrePerfil = c.UsuPerDescripcion,
                           enUso = objCnn.categorias_perfil.Count(p => p.CatPerCategoria == idCategoria && p.CatPerPerfil == c.UsuPerId)
                       });
                   });


            objCnn.usuario_perfi.Where(c => c.UsuEmpId == null && c.UsuPerEstado).ToList().ForEach(c =>
            {
                if (objresultado.Find(x => x.nombrePerfil.Equals(c.UsuPerDescripcion)) == null)
                {
                    objresultado.Add(new CategoriaPerfilCustom()
                    {
                        idPerfil = c.UsuPerId,
                        nombrePerfil = c.UsuPerDescripcion,
                        enUso = objCnn.categorias_perfil.Count(p => p.CatPerCategoria == idCategoria && p.CatPerPerfil == c.UsuPerId)
                    });
                }
                
            });

            return objresultado;
        }


        public void DeleteCategoriaPerfil(EliminarPerfilCategoria request)
        {
            ColegioContext objCnn = new ColegioContext();

            var _cat_perfil = objCnn.categorias_perfil.Where(c => c.CatPerCategoria == request.id_categoria && c.CatPerPerfil == request.id_perfil).FirstOrDefault();


            objCnn.Entry(_cat_perfil).State = EntityState.Deleted;

            objCnn.SaveChanges();



        }
    }
}
