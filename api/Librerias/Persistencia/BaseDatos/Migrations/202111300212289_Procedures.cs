namespace BaseDatos.Migrations
{
    using BaseDatos.Resources;
    using System;
    using System.Data.Entity.Migrations;
    using System.Windows.Interop;

    public partial class Procedures : DbMigration
    {
        public override void Up()
        {
            Sql(DBO._dbo___AsignarMateriasClase_);
            Sql(DBO._dbo___AsignarMaterriasCurso_);
            Sql(DBO._dbo___ConsultarClasesMateria_);
            Sql(BaseDatos.Resources.Garden.Gargen__GetGrupos_);
            Sql(BaseDatos.Resources.MSN.msn_BandejaClases);
            Sql(BaseDatos.Resources.MSN.msn_CategoriasMensajesRecibido);
            Sql(BaseDatos.Resources.MSN._msn__ConsultarMensajesChat);
            Sql(BaseDatos.Resources.MSN._msn___AcEnvioCorreoPersonas_);
            Sql(BaseDatos.Resources.MSN._msn___ConsultarMensaje_);
            Sql(BaseDatos.Resources.MSN._msn___CrearMensaje_Bandeja_Entrada_);
            
        }
        
        public override void Down()
        {
        }
    }
}
