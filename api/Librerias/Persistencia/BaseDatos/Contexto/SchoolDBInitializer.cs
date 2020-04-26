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
                SecDescripcion = "Mensajeria",
                SecIcono = ""
            });
            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Materias",
                SecIcono = ""
            });

            context.seccion.AddRange(defaultStandards);

            IList<UsuarioPerfil> defaultStandardsPerfil = new List<UsuarioPerfil>();

            defaultStandardsPerfil.Add(new UsuarioPerfil()
            {
                UsuPerDescripcion= "Profesores"
            });
            defaultStandardsPerfil.Add(new UsuarioPerfil()
            {
                UsuPerDescripcion = "Estudiantes"
            });
            defaultStandardsPerfil.Add(new UsuarioPerfil()
            {
                UsuPerDescripcion = "Acudiente"
            });
            defaultStandardsPerfil.Add(new UsuarioPerfil()
            {
                UsuPerDescripcion = "Tutor"
            });

            context.usuario_perfi.AddRange(defaultStandardsPerfil);

            base.Seed(context);
        }
    }
}
