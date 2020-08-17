namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AreaMateriasEmpresa : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.AreasMaterias", "ArEmpresaId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.AreasMaterias", "ArEmpresaId");
        }
    }
}
