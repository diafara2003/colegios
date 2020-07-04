
using BaseDatos.Migrations;
using BaseDatos.Modelos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace BaseDatos.Contexto
{
    public class ColegioContext : DbContext
    {
        public ColegioContext() : base("name=colegioapp")
        {
            Database.SetInitializer<ColegioContext>(null);
            //Database.SetInitializer(new MigrateDatabaseToLatestVersion<ColegioContext, Configuration>());
            
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }


        public DataTable ExecuteStoreQuery(ProcedureDTO data)
        {

            var table = new DataTable();
            using (var ctx = base.Database.Connection)
            {
                var cmd = ctx.CreateCommand();
                cmd.CommandText = data.commandText;
                cmd.CommandType = CommandType.StoredProcedure;

                foreach (var item in data.parametros)
                {
                    DbParameter _param = cmd.CreateParameter();
                    _param.ParameterName = "@" + item.Key;
                    _param.Value = item.Value;

                    cmd.Parameters.Add(_param);
                }

                cmd.Connection.Open();
                table.Load(cmd.ExecuteReader());
            }

            return table;
        }


        public DbSet<Usuarios> usuarios { get; set; }
        public DbSet<Seccion> seccion { get; set; }
        public DbSet<Opcion> opcion { get; set; }
        public DbSet<AreasMaterias> areas_materias { get; set; }
        public DbSet<BandejaEntrada> bandeja_entrada { get; set; }
        public DbSet<Clases> clases { get; set; }
        public DbSet<ClasesEstudiantes> clase_estudiantes { get; set; }
        public DbSet<CursoEstudiantes> curso_estudiantes { get; set; }
        public DbSet<Cursos> cursos { get; set; }
        public DbSet<Empresas> empresas { get; set; }
        public DbSet<Grados> grados { get; set; }
        public DbSet<GruposEnvio> grupo_envio { get; set; }
        public DbSet<GruposEnvioDet> grupo_envio_det { get; set; }
        public DbSet<Materias> materias { get; set; }
        public DbSet<Mensajes> mensajes { get; set; }
        public DbSet<Salones> salones { get; set; }
        public DbSet<Temporada> temporada { get; set; }
        public DbSet<UsuarioPerfil> usuario_perfi { get; set; }        
        public DbSet<Personas> personas { get; set; }
        public DbSet<Estudiantes> estudiantes { get; set; }
        public DbSet<Profesores> prefesores { get; set; }
        public DbSet<GruposEnvioAsignacion> grupo_envio_asignacion { get; set; }
        public DbSet<GruposEnvioAutorizado> grupo_envio_autorizacion { get; set; }
        public DbSet<GruposEnvioAutorizadoAll> grupo_envio_autorizado_all { get; set; }
        public DbSet<GruposEnvioAutorizadoCursos> grupo_envio_autorizacion_cursos { get; set; }
        public DbSet<GruposEnvioAutorizadoGrados> grupo_envio_autorizacion_grados { get; set; }
        public DbSet<GruposEnvioColores> grupo_envio_colores { get; set; }
        public DbSet<EstadoMensaje> estado_mensaje{ get; set; }
        public DbSet<LoginAuditoria> login_auditoria { get; set; }
        public DbSet<Categorias> categorias { get; set; }
        public DbSet<CategoriaPerfil> categorias_perfil { get; set; }
        public DbSet<Adjuntos> adjuntos { get; set; }
    }
}
