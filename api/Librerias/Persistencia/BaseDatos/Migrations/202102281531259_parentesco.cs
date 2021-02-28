namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class parentesco : DbMigration
    {
        public override void Up()
        {
            AddColumn("DP.Estudiantes", "EstParentestoAcudiente1", c => c.String());
            AddColumn("DP.Estudiantes", "EstParentestoAcudiente2", c => c.String());
            DropColumn("DP.Estudiantes", "EstNombresAcuediente");
            DropColumn("DP.Estudiantes", "EstApellidosAcudiente");
            DropColumn("DP.Estudiantes", "EstTelefonoAcudiente");
            DropColumn("DP.Estudiantes", "EstEmpresaAcudiente");
            DropColumn("DP.Estudiantes", "EstCargoAcudiente");
            DropColumn("DP.Estudiantes", "EstTeleEmpresaAcudiente");
        }
        
        public override void Down()
        {
            AddColumn("DP.Estudiantes", "EstTeleEmpresaAcudiente", c => c.String(maxLength: 50));
            AddColumn("DP.Estudiantes", "EstCargoAcudiente", c => c.String(maxLength: 50));
            AddColumn("DP.Estudiantes", "EstEmpresaAcudiente", c => c.String(maxLength: 50));
            AddColumn("DP.Estudiantes", "EstTelefonoAcudiente", c => c.String(maxLength: 50));
            AddColumn("DP.Estudiantes", "EstApellidosAcudiente", c => c.String(maxLength: 50));
            AddColumn("DP.Estudiantes", "EstNombresAcuediente", c => c.String(maxLength: 50));
            DropColumn("DP.Estudiantes", "EstParentestoAcudiente2");
            DropColumn("DP.Estudiantes", "EstParentestoAcudiente1");
        }
    }
}
