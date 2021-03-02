namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class estudiantes_personas : DbMigration
    {
        public override void Up()
        {
            AddColumn("Gargen.EstudianteJardin", "Acudiente1", c => c.Int(nullable: false));
            AddColumn("Gargen.EstudianteJardin", "Acudiente2", c => c.Int(nullable: false));
            AddColumn("DP.Personas", "PerTipoAcudiente", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("DP.Personas", "PerTipoAcudiente");
            DropColumn("Gargen.EstudianteJardin", "Acudiente2");
            DropColumn("Gargen.EstudianteJardin", "Acudiente1");
        }
    }
}
