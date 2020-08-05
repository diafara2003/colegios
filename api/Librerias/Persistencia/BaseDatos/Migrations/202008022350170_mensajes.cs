namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class mensajes : DbMigration
    {
        public override void Up()
        {
         
            AddColumn("msn.Mensajes", "MenFechaMaxima", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("msn.Mensajes", "MenFechaMaxima");
        }
    }
}
