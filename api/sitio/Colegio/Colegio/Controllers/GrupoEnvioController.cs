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
            return new Mensaje.Servicios.GruposBL<GruposEnvioColores>().GetEnvioColores(_empresa.PerIdEmpresa);
        }

        [Route("grados")]
        public IEnumerable<GruposEnvioAutorizadoCustom> GetGrados()
        {
            return new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoCustom>().GetautorizadoGrados(_empresa.PerIdEmpresa);
        }

        [Route("cursos")]
        public IEnumerable<GruposEnvioAutorizadoCustom> GetCursos()
        {
            return new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoCustom>().GetautorizadoCursos(_empresa.PerIdEmpresa);
        }

        [Route("personalizado")]
        public IEnumerable<GruposEnvio> GetPersonalizado(int temporada)
        {
            return new Mensaje.Servicios.GruposBL<GruposEnvio>().GetPersonalizados(_empresa.PerIdEmpresa, temporada);
        }

        [Route("categoria")]
        public IEnumerable<Categorias> GetCategoria()
        {
            return new Mensaje.Servicios.GruposBL<Categorias>().GetCategorias(_empresa.PerIdEmpresa);
        }


        [Route("categoriaperfil")]
        public IEnumerable<CategoriaPerfilCustom> GetCategoriaPerfil(int id)
        {
            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            var _persona = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();
            return new Mensaje.Servicios.GruposBL<CategoriaPerfilCustom>().GetCategoriasPerfil(_persona.PerIdEmpresa, id);
        }




        public bool Post(GruposEnvioColores request)
        {
            return new Mensaje.Servicios.GruposBL<GruposEnvioColores>().Update(request);
        }

        [Route("cursos")]
        public IEnumerable<GruposEnvioAutorizadoCustom> PostCursos(GruposEnvioAutorizadoCursos request)
        {

            new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoCursos>().Add(request);

            return new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoCustom>().GetautorizadoCursos(_empresa.PerIdEmpresa);
        }

        [Route("grados")]
        public IEnumerable<GruposEnvioAutorizadoCustom> PostGrados(GruposEnvioAutorizadoGrados request)
        {

            new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoGrados>().Add(request);

            return new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoCustom>().GetautorizadoGrados(_empresa.PerIdEmpresa);
        }

        [Route("personalizado")]
        public IEnumerable<GruposEnvio> PostPersonalizado(GruposEnvio request)
        {

            new Mensaje.Servicios.GruposBL<GruposEnvio>().Add(request);

            return new Mensaje.Servicios.GruposBL<GruposEnvio>().GetPersonalizados(_empresa.PerIdEmpresa, request.GruEnvTemporada);
        }

        [Route("categoria")]
        public IEnumerable<Categorias> PostCategoria(Categorias request)
        {
            if (request.CatId == -1)
            {
                new Mensaje.Servicios.GruposBL<Categorias>().Add(request);
            }
            else
            {
                new Mensaje.Servicios.GruposBL<Categorias>().Update(request);
            }

            return new Mensaje.Servicios.GruposBL<Categorias>().GetCategorias(_empresa.PerIdEmpresa);
        }


        [Route("categoriaperfil")]
        public IEnumerable<CategoriaPerfilCustom> PostCategoria(CategoriaPerfil request)
        {

            CategoriaPerfil nuevo = new Mensaje.Servicios.GruposBL<CategoriaPerfil>().Add(request);

            var identity = Convert.ToInt32(Thread.CurrentPrincipal.Identity.Name);

            var _persona = new Persona.Servicios.PersonasBI().Get(id: identity).FirstOrDefault();

            return new Mensaje.Servicios.GruposBL<CategoriaPerfilCustom>().GetCategoriasPerfil(_persona.PerIdEmpresa, nuevo.CatPerCategoria);
        }




        [Route("categoriaperfil/eliminar")]
        public bool PostCategoriaPerfilDelete(EliminarPerfilCategoria request)
        {

            new Mensaje.Servicios.GruposBL<EliminarPerfilCategoria>().DeleteCategoriaPerfil(request);
            return true;

        }

        [Route("categoria/eliminar")]
        public IEnumerable<Categorias> PostCategoriaDelete(Categorias request)
        {
            var _categoria = new Mensaje.Servicios.GruposBL<Categorias>().SelectById(request.CatId);

            new Mensaje.Servicios.GruposBL<Categorias>().Delete(_categoria);

            return new Mensaje.Servicios.GruposBL<Categorias>().GetCategorias(request.CatEmpresaId);
        }

        [Route("cursos/eliminar")]
        public IEnumerable<GruposEnvioAutorizadoCustom> PostCursosDelete(GruposEnvioAutorizadoCustom request)
        {
            var _curso = new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoCursos>().SelectById(request.id);

            new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoCursos>().Delete(_curso);

            return new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoCustom>().GetautorizadoCursos(_empresa.PerIdEmpresa);
        }

        [Route("grados/eliminar")]
        public IEnumerable<GruposEnvioAutorizadoCustom> PostGradosDelete(GruposEnvioAutorizadoCustom request)
        {

            var _grado = new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoGrados>().SelectById(request.id);

            new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoGrados>().Delete(_grado);

            return new Mensaje.Servicios.GruposBL<GruposEnvioAutorizadoCustom>().GetautorizadoGrados(_empresa.PerIdEmpresa);
        }

        [Route("personalizado/eliminar")]
        public IEnumerable<GruposEnvio> PostPersonalizadoDelete(GruposEnvio request)
        {

            var _personalizado = new Mensaje.Servicios.GruposBL<GruposEnvio>().SelectById(request.GruEnvId);

            new Mensaje.Servicios.GruposBL<GruposEnvio>().Delete(_personalizado);

            return new Mensaje.Servicios.GruposBL<GruposEnvio>().GetPersonalizados(_empresa.PerIdEmpresa, request.GruEnvTemporada);
        }
    }
}
