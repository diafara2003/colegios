namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class estudiantes_jardin : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "Gargen.EstudianteJardin",
                c => new
                    {
                        EstId = c.Int(nullable: false, identity: true),
                        EstEmpresa = c.Int(nullable: false),
                        EstNombres = c.String(),
                        EstApellidos = c.String(),
                        EstFechaNacimineto = c.DateTime(nullable: false),
                        EstRC = c.String(),
                        EstRH = c.String(),
                        EstAseguradora = c.String(),
                        EstAlergias = c.String(),
                        EstMedicamentos = c.String(),
                        EstObs = c.String(),
                        EstDireccion = c.String(),
                        EstTelefono = c.String(),
                    })
                .PrimaryKey(t => t.EstId);
            
        }
        
        public override void Down()
        {
            DropTable("Gargen.EstudianteJardin");
        }
    }
}
