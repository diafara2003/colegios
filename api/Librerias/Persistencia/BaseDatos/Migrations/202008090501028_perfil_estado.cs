namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class perfil_estado : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UsuarioPerfil", "UsuPerEstado", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.UsuarioPerfil", "UsuPerEstado");
        }
    }
}
