namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ingreso_persona : DbMigration
    {
        public override void Up()
        {
            Sql(BaseDatos.Resources.Garden.Gargen__GetGrupos_);
        }
        
        public override void Down()
        {
        }
    }
}
