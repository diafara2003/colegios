namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class accesos : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "menu.Accesos",
                c => new
                    {
                        AccesoId = c.Int(nullable: false, identity: true),
                        PersonaID = c.Int(),
                        PerfilID = c.Int(),
                        EmpresaID = c.Int(nullable: false),
                        Opcion = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AccesoId);
            
        }
        
        public override void Down()
        {
            DropTable("menu.Accesos");
        }
    }
}
