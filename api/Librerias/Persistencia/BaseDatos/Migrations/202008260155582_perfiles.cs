namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class perfiles : DbMigration
    {
        public override void Up()
        {
            AlterColumn("msn.GruposEnvioColores", "GrEnColorEmp", c => c.Int());
            AlterColumn("dbo.UsuarioPerfil", "UsuEmpId", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.UsuarioPerfil", "UsuEmpId", c => c.Int(nullable: false));
            AlterColumn("msn.GruposEnvioColores", "GrEnColorEmp", c => c.Int(nullable: false));
        }
    }
}
