namespace BaseDatos.Migrations
{
    using BaseDatos.Resources;
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initial_procedures : DbMigration
    {
        public override void Up()
        {
            Sql(DBO._dbo___AsignarMateriasClase_);
            Sql(DBO._dbo___AsignarMaterriasCurso_);
            Sql(DBO._dbo___ConsultarClasesMateria_);
            Sql(MSN._msn___AcEnvioCorreoPersonas_);
            Sql(MSN._msn___ConsultarMensaje_);
            Sql(MSN._msn___CrearMensaje_Bandeja_Entrada_);
        }
        
        public override void Down()
        {
        }
    }
}
