namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class loginPhone : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "DP.LoginPhone",
                c => new
                    {
                        LgId = c.Int(nullable: false, identity: true),
                        UsuarioId = c.Int(nullable: false),
                        TokenFCM = c.String(),
                    })
                .PrimaryKey(t => t.LgId);
            
        }
        
        public override void Down()
        {
            DropTable("DP.LoginPhone");
        }
    }
}
