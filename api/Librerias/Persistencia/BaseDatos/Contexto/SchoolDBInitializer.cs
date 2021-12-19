using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace BaseDatos.Contexto
{
    public class SchoolDBInitializer : System.Data.Entity.CreateDatabaseIfNotExists<ColegioContext>
    {
        protected override void Seed(ColegioContext context)
        {

            IList<Seccion> defaultStandards = new List<Seccion>();
            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Empresa",
                SecIcono = "fas fa-briefcase",
                SecRuta = "../empresa/empresa.html"
            });

            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "	Mensajería",
                SecIcono = "far fa-envelope",
                SecRuta = "../comunicados/bandejaentradav3.html"
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
                SecDescripcion = "Estudiantes",
                SecIcono = "far fa-envelope",
                SecRuta = "../estudiantes/estudiantes.html"
            });

            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Profesores",
                SecIcono = "far fa-envelope",
                SecRuta = "../profesores/profesores.html"
            });

            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Grupos",
                SecIcono = "fas fa-users",
                SecRuta = "../grupos/grupos.html"
            });

          //  context.seccion.AddRange(defaultStandards);

            IList<UsuarioPerfil> defaultStandardsPerfil = new List<UsuarioPerfil>();

            defaultStandardsPerfil.Add(new UsuarioPerfil()
            {
                UsuPerDescripcion = "Docente"
            });
            defaultStandardsPerfil.Add(new UsuarioPerfil()
            {
                UsuPerDescripcion = "Estudiantes"
            });

            //context.usuario_perfi.AddRange(defaultStandardsPerfil);


            context.empresas.Add(new Empresas()
            {
                EmpNombre = "Admin",
                EmpEstado = 1,
                EmpDireccion = "Main",
                EmpNit = "admin"
            });



            context.personas.Add(new Personas()
            {
                PerClave = "comunicate",
                PerDocumento = "comunicate",
                PerIdEmpresa = 1,
                PerNombres = "Admin Comunicate",
                PerEstado = true
            });

            context.accesos.Add(new Accesos() { 
            EmpresaID=1,
            Opcion=1,
            PerfilID=1,
            PersonaID=1
            });

            base.Seed(context);
        }
    }
}
