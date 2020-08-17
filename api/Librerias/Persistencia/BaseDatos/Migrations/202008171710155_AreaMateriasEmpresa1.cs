namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AreaMateriasEmpresa1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Salones", "SalEmpresaId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Salones", "SalEmpresaId");
        }
    }
}
