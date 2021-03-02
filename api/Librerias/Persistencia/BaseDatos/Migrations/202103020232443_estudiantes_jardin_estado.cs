namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class estudiantes_jardin_estado : DbMigration
    {
        public override void Up()
        {
            AddColumn("Gargen.EstudianteJardin", "EstEstado", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("Gargen.EstudianteJardin", "EstEstado");
        }
    }
}
