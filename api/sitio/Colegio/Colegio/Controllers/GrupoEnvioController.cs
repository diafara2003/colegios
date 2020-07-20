using Mensaje.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    [RoutePrefix("autorizados")]
    public class GrupoEnvioController : ApiController
    {
        Personas _empresa = new Personas();
        public GrupoEnvioController()
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);
            _empresa = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
        }

        public IEnumerable<GruposEnvioColores> Get()
        {
            return new Mensaje.Servicios.GruposBL().GetEnvioColores(_empresa.PerIdEmpresa);
        }

        [Route("grados")]
        public IEnumerable<GruposEnvioAutorizadoCustom> GetGrados()
        {
            return new Mensaje.Servicios.GruposBL().GetautorizadoGrados(_empresa.PerIdEmpresa);
        }

        [Route("cursos")]
        public IEnumerable<GruposEnvioAutorizadoCustom> GetCursos()
        {
            return new Mensaje.Servicios.GruposBL().GetautorizadoCursos(_empresa.PerIdEmpresa);
        }

        [Route("personalizado")]
        public IEnumerable<GruposEnvio> GetPersonalizado(int temporada)
        {
            return new Mensaje.Servicios.GruposBL().GetPersonalizados(_empresa.PerIdEmpresa, temporada);
        }

        [Route("categoria")]
        public IEnumerable<Categorias> GetCategoria()
        {
            return new Mensaje.Servicios.GruposBL().GetCategorias(_empresa.PerIdEmpresa);
        }


        [Route("categoriaperfil")]
        public IEnumerable<CategoriaPerfilCustom> GetCategoriaPerfil(int id)
        {
            return new Mensaje.Servicios.GruposBL().GetCategoriasPerfil(id);
        }




        public bool Post(GruposEnvioColores request)
        {
            return new Mensaje.Servicios.GruposBL().UpdateEnvio<GruposEnvioColores>(request);
        }

        [Route("cursos")]
        public IEnumerable<GruposEnvioAutorizadoCustom> PostCursos(GruposEnvioAutorizadoCursos request)
        {

            new Mensaje.Servicios.GruposBL().AddAutorizado<GruposEnvioAutorizadoCursos>(request);

            return new Mensaje.Servicios.GruposBL().GetautorizadoCursos(_empresa.PerIdEmpresa);
        }

        [Route("grados")]
        public IEnumerable<GruposEnvioAutorizadoCustom> PostGrados(GruposEnvioAutorizadoGrados request)
        {

            new Mensaje.Servicios.GruposBL().AddAutorizado<GruposEnvioAutorizadoGrados>(request);

            return new Mensaje.Servicios.GruposBL().GetautorizadoGrados(_empresa.PerIdEmpresa);
        }

        [Route("personalizado")]
        public IEnumerable<GruposEnvio> PostPersonalizado(GruposEnvio request)
        {

            new Mensaje.Servicios.GruposBL().AddAutorizado<GruposEnvio>(request);

            return new Mensaje.Servicios.GruposBL().GetPersonalizados(_empresa.PerIdEmpresa, request.GruEnvTemporada);
        }

        [Route("categoria")]
        public IEnumerable<Categorias> PostCategoria(Categorias request)
        {
            if (request.CatId == -1)
            {
                new Mensaje.Servicios.GruposBL().AddAutorizado<Categorias>(request);
            }
            else
            {
                new Mensaje.Servicios.GruposBL().UpdateEnvio<Categorias>(request);
            }

            return new Mensaje.Servicios.GruposBL().GetCategorias(_empresa.PerIdEmpresa);
        }


        [Route("categoriaperfil")]
        public IEnumerable<CategoriaPerfilCustom> PostCategoria(CategoriaPerfil request)
        {

            CategoriaPerfil nuevo = new Mensaje.Servicios.GruposBL().AddAutorizado<CategoriaPerfil>(request);

            return new Mensaje.Servicios.GruposBL().GetCategoriasPerfil(nuevo.CatPerCategoria);
        }




        [Route("categoriaperfil/eliminar")]
        public bool PostCategoriaPerfilDelete(EliminarPerfilCategoria request)
        {

            new Mensaje.Servicios.GruposBL().DeleteCategoriaPerfil(request);
            return true;

        }

        [Route("categoria/eliminar")]
        public IEnumerable<Categorias> PostCategoriaDelete(Categorias request)
        {
            var _categoria = new Mensaje.Servicios.GruposBL().Select<Categorias>(request.CatId);

            new Mensaje.Servicios.GruposBL().DeleteAutorizado<Categorias>(_categoria);

            return new Mensaje.Servicios.GruposBL().GetCategorias(request.CatEmpresaId);
        }

        [Route("cursos/eliminar")]
        public IEnumerable<GruposEnvioAutorizadoCustom> PostCursosDelete(GruposEnvioAutorizadoCustom request)
        {
            var _curso = new Mensaje.Servicios.GruposBL().Select<GruposEnvioAutorizadoCursos>(request.id);

            new Mensaje.Servicios.GruposBL().DeleteAutorizado<GruposEnvioAutorizadoCursos>(_curso);

            return new Mensaje.Servicios.GruposBL().GetautorizadoCursos(_empresa.PerIdEmpresa);
        }

        [Route("grados/eliminar")]
        public IEnumerable<GruposEnvioAutorizadoCustom> PostGradosDelete(GruposEnvioAutorizadoCustom request)
        {

            var _grado = new Mensaje.Servicios.GruposBL().Select<GruposEnvioAutorizadoGrados>(request.id);

            new Mensaje.Servicios.GruposBL().DeleteAutorizado<GruposEnvioAutorizadoGrados>(_grado);

            return new Mensaje.Servicios.GruposBL().GetautorizadoGrados(_empresa.PerIdEmpresa);
        }

        [Route("personalizado/eliminar")]
        public IEnumerable<GruposEnvio> PostPersonalizadoDelete(GruposEnvio request)
        {

            var _personalizado = new Mensaje.Servicios.GruposBL().Select<GruposEnvio>(request.GruEnvId);

            new Mensaje.Servicios.GruposBL().DeleteAutorizado<GruposEnvio>(_personalizado);

            return new Mensaje.Servicios.GruposBL().GetPersonalizados(_empresa.PerIdEmpresa, request.GruEnvTemporada);
        }
    }
}
