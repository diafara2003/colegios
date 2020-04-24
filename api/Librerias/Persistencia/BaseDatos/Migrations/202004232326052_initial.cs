namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.AreasMaterias",
                c => new
                    {
                        ArMaId = c.Int(nullable: false, identity: true),
                        ArMaCodigo = c.String(maxLength: 20),
                        ArMaDescripcion = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.ArMaId);
            
            CreateTable(
                "msn.BandejaEntrada",
                c => new
                    {
                        BanId = c.Int(nullable: false, identity: true),
                        BanMsnId = c.Int(nullable: false),
                        BanEstado = c.Int(nullable: false),
                        BanUsuario = c.Int(nullable: false),
                        BanHoraLeido = c.DateTime(nullable: false),
                        BanOkRecibido = c.Byte(nullable: false),
                        BanOkRecibidoFecha = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.BanId);
            
            CreateTable(
                "dbo.ClasesEstudiantes",
                c => new
                    {
                        ClaEstId = c.Int(nullable: false, identity: true),
                        ClaEstclaseId = c.Int(nullable: false),
                        ClaEstEstudianteId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.ClaEstId);
            
            CreateTable(
                "dbo.Clases",
                c => new
                    {
                        Claid = c.Int(nullable: false, identity: true),
                        ClaEmpId = c.Int(nullable: false),
                        ClaTemporada = c.Short(nullable: false),
                        ClaCodigo = c.String(maxLength: 20),
                        ClaMateriaId = c.Int(nullable: false),
                        ClaSalonId = c.Int(nullable: false),
                        ClaCursoId = c.Int(nullable: false),
                        ClaProfesor = c.Int(nullable: false),
                        ClaObservacion = c.String(),
                    })
                .PrimaryKey(t => t.Claid);
            
            CreateTable(
                "dbo.CursoEstudiantes",
                c => new
                    {
                        CurEstId = c.Int(nullable: false, identity: true),
                        CurEstCursoId = c.Int(nullable: false),
                        CurEstEstudianteId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CurEstId);
            
            CreateTable(
                "dbo.Cursos",
                c => new
                    {
                        CurId = c.Int(nullable: false, identity: true),
                        CurEmpId = c.Int(nullable: false),
                        CurTemporada = c.Short(nullable: false),
                        CurCodigo = c.String(maxLength: 20),
                        CurDescripcion = c.String(maxLength: 50),
                        CurTutor = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CurId);
            
            CreateTable(
                "dbo.Empresas",
                c => new
                    {
                        EmpId = c.Int(nullable: false, identity: true),
                        EmpNombre = c.String(maxLength: 100),
                        EmpDireccion = c.String(maxLength: 100),
                        EmpLogo = c.String(maxLength: 100),
                        EmpNit = c.String(maxLength: 500),
                        EmpEstado = c.Byte(nullable: false),
                    })
                .PrimaryKey(t => t.EmpId);
            
            CreateTable(
                "DP.Estudiantes",
                c => new
                    {
                        EstId = c.Int(nullable: false, identity: true),
                        EstIdPersona = c.Int(nullable: false),
                        EstNombresEstudiante = c.String(maxLength: 50),
                        EstNombresMama = c.String(maxLength: 50),
                        EstApellidosMama = c.String(maxLength: 50),
                        EstTelefonoMama = c.String(maxLength: 50),
                        EstCorreoMama = c.String(maxLength: 50),
                        EstNombresPapa = c.String(maxLength: 50),
                        EstApellidosPapa = c.String(maxLength: 50),
                        EstTelefonoPapa = c.String(maxLength: 50),
                        EstCorreoPapa = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.EstId);
            
            CreateTable(
                "dbo.Grados",
                c => new
                    {
                        GraId = c.Int(nullable: false, identity: true),
                        GraCodigo = c.String(maxLength: 20),
                        GraEmpId = c.Int(nullable: false),
                        GraDescripcion = c.String(maxLength: 50),
                        GraOrden = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GraId);
            
            CreateTable(
                "msn.GruposEnvio",
                c => new
                    {
                        GruEnvId = c.Int(nullable: false, identity: true),
                        GruEnvEmpId = c.Int(nullable: false),
                        GruEnvTemporada = c.Int(nullable: false),
                        GruEnvProfesor = c.Int(nullable: false),
                        GruEnvDescripcion = c.String(maxLength: 300),
                    })
                .PrimaryKey(t => t.GruEnvId);
            
            CreateTable(
                "msn.GruposEnvioDet",
                c => new
                    {
                        GruEnvDetId = c.Int(nullable: false, identity: true),
                        GruEnvDetIdGrupo = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GruEnvDetId);
            
            CreateTable(
                "dbo.Materias",
                c => new
                    {
                        MatID = c.Int(nullable: false, identity: true),
                        MatCodigo = c.String(maxLength: 20),
                        MatEmpId = c.Int(nullable: false),
                        MatGradoId = c.Int(nullable: false),
                        MatAreaId = c.Int(nullable: false),
                        MatDescripcion = c.String(maxLength: 50),
                        MatEstado = c.Byte(nullable: false),
                    })
                .PrimaryKey(t => t.MatID);
            
            CreateTable(
                "msn.Mensajes",
                c => new
                    {
                        MenId = c.Int(nullable: false, identity: true),
                        MenEmpId = c.Int(nullable: false),
                        MenUsuario = c.Int(nullable: false),
                        MenTipoMsn = c.String(maxLength: 2),
                        MenAsuto = c.String(maxLength: 100),
                        MenMensaje = c.String(),
                        MenFecha = c.DateTime(nullable: false),
                        MenReplicaIdMsn = c.Int(nullable: false),
                        MenOkRecibido = c.Byte(nullable: false),
                    })
                .PrimaryKey(t => t.MenId);
            
            CreateTable(
                "menu.Opcion",
                c => new
                    {
                        OpcionId = c.Int(nullable: false, identity: true),
                        OpDescripcion = c.String(),
                        OpSeccionId = c.Int(nullable: false),
                        OpRuta = c.String(),
                        OcIcono = c.String(),
                    })
                .PrimaryKey(t => t.OpcionId);
            
            CreateTable(
                "DP.Personas",
                c => new
                    {
                        PerId = c.Int(nullable: false, identity: true),
                        PerIdEmpresa = c.Int(nullable: false),
                        PerNombres = c.String(maxLength: 50),
                        PerApellidos = c.String(maxLength: 50),
                        PerTIpoDoc = c.String(maxLength: 50),
                        PerDocumento = c.String(maxLength: 50),
                        PerEmail = c.String(maxLength: 50),
                        PerTelefono = c.String(maxLength: 50),
                        PerGenero = c.String(maxLength: 2),
                        PerRH = c.String(maxLength: 5),
                        PerEPS = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.PerId);
            
            CreateTable(
                "DP.Profesores",
                c => new
                    {
                        ProfId = c.Int(nullable: false, identity: true),
                        ProfIdPersona = c.Int(nullable: false),
                        ProfProfesion = c.String(),
                    })
                .PrimaryKey(t => t.ProfId);
            
            CreateTable(
                "dbo.Salones",
                c => new
                    {
                        SalId = c.Int(nullable: false, identity: true),
                        SalCodigo = c.String(maxLength: 20),
                        SalDescripcion = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.SalId);
            
            CreateTable(
                "menu.Seccion",
                c => new
                    {
                        SeccionId = c.Int(nullable: false, identity: true),
                        SecDescripcion = c.String(),
                        SecIcono = c.String(),
                    })
                .PrimaryKey(t => t.SeccionId);
            
            CreateTable(
                "dbo.Temporada",
                c => new
                    {
                        TempId = c.Int(nullable: false, identity: true),
                        TempAno = c.Int(nullable: false),
                        TempEstado = c.Byte(nullable: false),
                    })
                .PrimaryKey(t => t.TempId);
            
            CreateTable(
                "dbo.UsuarioPerfil",
                c => new
                    {
                        UsuPerId = c.Int(nullable: false, identity: true),
                        UsuPerDescripcion = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.UsuPerId);
            
            CreateTable(
                "dbo.Usuarios",
                c => new
                    {
                        IdUsuario = c.Int(nullable: false, identity: true),
                        UsuPersona = c.Int(nullable: false),
                        UsuUsuario = c.String(),
                        UsuClave = c.String(),
                        UsuTipoPerfil = c.Int(nullable: false),
                        UsuEstado = c.Byte(nullable: false),
                    })
                .PrimaryKey(t => t.IdUsuario);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Usuarios");
            DropTable("dbo.UsuarioPerfil");
            DropTable("dbo.Temporada");
            DropTable("menu.Seccion");
            DropTable("dbo.Salones");
            DropTable("DP.Profesores");
            DropTable("DP.Personas");
            DropTable("menu.Opcion");
            DropTable("msn.Mensajes");
            DropTable("dbo.Materias");
            DropTable("msn.GruposEnvioDet");
            DropTable("msn.GruposEnvio");
            DropTable("dbo.Grados");
            DropTable("DP.Estudiantes");
            DropTable("dbo.Empresas");
            DropTable("dbo.Cursos");
            DropTable("dbo.CursoEstudiantes");
            DropTable("dbo.Clases");
            DropTable("dbo.ClasesEstudiantes");
            DropTable("msn.BandejaEntrada");
            DropTable("dbo.AreasMaterias");
        }
    }
}
