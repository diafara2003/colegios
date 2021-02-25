namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class gruposEstudianteProfesor : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "Gargen.GruposEstudiantes",
                c => new
                    {
                        GruEstId = c.Int(nullable: false, identity: true),
                        GruEstGrupo = c.Int(nullable: false),
                        GruEstEstudiante = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GruEstId);
            
            CreateTable(
                "Gargen.GruposProfesor",
                c => new
                    {
                        GruProId = c.Int(nullable: false, identity: true),
                        GruProGrupo = c.Int(nullable: false),
                        GruProProfesor = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GruProId);
            
        }
        
        public override void Down()
        {
            DropTable("Gargen.GruposProfesor");
            DropTable("Gargen.GruposEstudiantes");
        }
    }
}
