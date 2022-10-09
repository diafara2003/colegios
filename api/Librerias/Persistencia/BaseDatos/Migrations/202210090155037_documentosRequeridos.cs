namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class documentosRequeridos : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.DocumentosEstudiante", "DocEstIdPersona", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.DocumentosEstudiante", "DocEstIdPersona");
        }
    }
}
