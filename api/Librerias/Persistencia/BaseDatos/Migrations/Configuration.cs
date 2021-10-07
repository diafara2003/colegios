namespace BaseDatos.Migrations
{
    using Contexto;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using Trasversales.Modelo;


    internal sealed class Configuration : DbMigrationsConfiguration<BaseDatos.Contexto.ColegioContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ColegioContext context)
        {
            return;
            List<GruposEnvioColores> grupoColores = new List<GruposEnvioColores>();


            grupoColores.Add(new GruposEnvioColores()
            {
                GrEnColorEmp = -1,
                GrEnColorTipo = -10,
                GrEnColorBurbuja = "#1294F5",
                GrEnColorObs = "#FFFFFF",
                GrEnColorRGB = "red"
            });
            grupoColores.Add(new GruposEnvioColores()
            {
                GrEnColorEmp = -1,
                GrEnColorTipo = -20,
                GrEnColorBurbuja = "#1294F5",
                GrEnColorObs = "#FFFFFF",
                GrEnColorRGB = "red"
            });
            grupoColores.Add(new GruposEnvioColores()
            {
                GrEnColorEmp = -1,
                GrEnColorTipo = 0,
                GrEnColorBurbuja = "#1294F5",
                GrEnColorObs = "#FFFFFF",
                GrEnColorRGB = "red"
            });

            grupoColores.ForEach(c => context.grupo_envio_colores.AddOrUpdate(c));

            context.SaveChanges();

          


            List<Seccion> defaultStandards = new List<Seccion>();
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
                SecRuta = "	../estudiantes/estudiantes.html"
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


            defaultStandards.ForEach(c => context.seccion.AddOrUpdate(c));

            context.SaveChanges();

            List<UsuarioPerfil> defaultStandardsPerfil = new List<UsuarioPerfil>();

            defaultStandardsPerfil.Add(new UsuarioPerfil()
            {
                UsuPerDescripcion = "Docente"
            });
            defaultStandardsPerfil.Add(new UsuarioPerfil()
            {
                UsuPerDescripcion = "Estudiantes"
            });

            defaultStandardsPerfil.ForEach(c => context.usuario_perfi.AddOrUpdate(c));

            context.SaveChanges();

            context.empresas.AddOrUpdate(new Empresas()
            {
                EmpNombre = "Admin",
                EmpEstado = 1,
                EmpDireccion = "Main",
                EmpNit = "admin"
            });
            context.SaveChanges();

            context.personas.AddOrUpdate(new Personas()
            {
                PerClave = "comunicate",
                PerDocumento = "comunicate",
                PerIdEmpresa = 1,
                PerNombres = "Admin Comunicate",
                PerEstado = true
            });
            context.SaveChanges();

            context.accesos.AddOrUpdate(new Accesos()
            {
                EmpresaID = 1,
                Opcion = 1,
                PerfilID = 1,
                PersonaID = 1
            });
            context.SaveChanges();


        }
    }
}
