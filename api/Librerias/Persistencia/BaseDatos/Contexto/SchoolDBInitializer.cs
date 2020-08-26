using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace BaseDatos.Contexto
{
    public class SchoolDBInitializer : CreateDatabaseIfNotExists<ColegioContext>
    {
        protected override void Seed(ColegioContext context)
        {

            IList<Seccion> defaultStandards = new List<Seccion>();

            
            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Materias",
                SecIcono = "far fa-envelope",
                SecRuta= "../comunicados/bandejaentradav2.html"
            });

            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Configuración",
                SecIcono = "fas fa-cog",
                SecRuta = ""
            });
            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Usuarios",
                SecIcono = "fas fa-users",
                SecRuta = ""
            });
            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Grupos envío",
                SecIcono = "",
                SecRuta = ""
            });
            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Empresa",
                SecIcono = "fas fa-briefcase",
                SecRuta = "../empresa/empresa.html"
            });

            context.seccion.AddRange(defaultStandards);

            IList<UsuarioPerfil> defaultStandardsPerfil = new List<UsuarioPerfil>();

            defaultStandardsPerfil.Add(new UsuarioPerfil()
            {
                UsuPerDescripcion= "Docente"
            });
            defaultStandardsPerfil.Add(new UsuarioPerfil()
            {
                UsuPerDescripcion = "Estudiantes"
            });
         

            context.usuario_perfi.AddRange(defaultStandardsPerfil);

            base.Seed(context);
        }
    }
}
