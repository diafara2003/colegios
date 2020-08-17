namespace BaseDatos.Migrations
{
    using BaseDatos.Resources;
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class sp_asignarclases : DbMigration
    {
        public override void Up()
        {
            Sql(DBO._dbo___AsignarMateriasClase_);
        }
        
        public override void Down()
        {
        }
    }
}
