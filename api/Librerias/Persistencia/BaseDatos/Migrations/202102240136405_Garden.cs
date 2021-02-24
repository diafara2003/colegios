namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Garden : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "Gargen.Estudiantes",
                c => new
                    {
                        EstId = c.Int(nullable: false, identity: true),
                        EstEmpresa = c.Int(nullable: false),
                        EstNombres = c.String(),
                        EstApellidos = c.String(),
                        EstGrupo = c.Int(nullable: false),
                        EstFechaNacimineto = c.DateTime(nullable: false),
                        EstRC = c.String(),
                        EstRH = c.String(),
                        EstAseguradora = c.String(),
                        EstAlergias = c.String(),
                        EstMedicamentos = c.String(),
                        EstObs = c.String(),
                        EstDireccion = c.String(),
                        EstTelefono = c.String(),
                        EstJornada = c.String(),
                        EstAlimentacion = c.Boolean(nullable: false),
                        EsTrasporte = c.Boolean(nullable: false),
                        EstNombreTransportador = c.String(),
                    })
                .PrimaryKey(t => t.EstId);
            
            CreateTable(
                "Gargen.Grupos",
                c => new
                    {
                        GrId = c.Int(nullable: false, identity: true),
                        GrEmpresa = c.Int(nullable: false),
                        GrTemporada = c.Int(nullable: false),
                        GrNombre = c.String(),
                    })
                .PrimaryKey(t => t.GrId);
            
        }
        
        public override void Down()
        {
            DropTable("Gargen.Grupos");
            DropTable("Gargen.Estudiantes");
        }
    }
}
