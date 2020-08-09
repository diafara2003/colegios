namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class perfil_empresas : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UsuarioPerfil", "UsuEmpId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.UsuarioPerfil", "UsuEmpId");
        }
    }
}
