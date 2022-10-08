namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DocumentosAdjuntos1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.DocumentosColegio",
                c => new
                    {
                        DocId = c.Int(nullable: false, identity: true),
                        DocIdEmpresa = c.Int(nullable: false),
                        DocTexto = c.String(),
                    })
                .PrimaryKey(t => t.DocId);
            
            CreateTable(
                "dbo.DocumentosEstudiante",
                c => new
                    {
                        DocEstId = c.Int(nullable: false, identity: true),
                        DocEstIdDoc = c.Int(nullable: false),
                        DocEstIdEmpresa = c.Int(nullable: false),
                        DocEstIdAdj = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.DocEstId);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.DocumentosEstudiante");
            DropTable("dbo.DocumentosColegio");
        }
    }
}
