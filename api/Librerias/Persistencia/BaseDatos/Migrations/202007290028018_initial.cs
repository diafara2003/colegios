namespace BaseDatos.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initial : DbMigration
    {
        public override void Up()
        {
           
           
            CreateTable(
                "dbo.Adjuntos",
                c => new
                    {
                        AjdId = c.Int(nullable: false, identity: true),
                        AdjIdEmpresa = c.Int(nullable: false),
                        AdjIdUsuario = c.Int(nullable: false),
                        AdjIdRuta = c.String(),
                        AdjNombre = c.String(),
                        AjdExtension = c.String(),
                    })
                .PrimaryKey(t => t.AjdId);
            
            CreateTable(
                "msn.AdjuntosMensaje",
                c => new
                    {
                        AdjMenId = c.Int(nullable: false, identity: true),
                        AdjMenAdjuntoId = c.Int(nullable: false),
                        AdjMsnMensajeId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.AdjMenId);
            
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
                        BanHoraLeido = c.DateTime(),
                        BanOkRecibido = c.Byte(nullable: false),
                        BanOkRecibidoFecha = c.DateTime(),
                        BanClaseId = c.Int(),
                        BanDestacado = c.Int(),
                    })
                .PrimaryKey(t => t.BanId);
            
            CreateTable(
                "msn.Categorias",
                c => new
                    {
                        CatId = c.Int(nullable: false, identity: true),
                        CatEmpresaId = c.Int(nullable: false),
                        CatDescripcion = c.String(maxLength: 50),
                        CatColor = c.String(maxLength: 50),
                        CarHoraPermitida = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.CatId);
            
            CreateTable(
                "msn.CategoriaPerfil",
                c => new
                    {
                        CatPerId = c.Int(nullable: false, identity: true),
                        CatPerCategoria = c.Int(nullable: false),
                        CatPerPerfil = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.CatPerId);
            
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
                        ClaSalonId = c.Int(),
                        ClaCursoId = c.Int(nullable: false),
                        ClaProfesor = c.Int(),
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
                        CurTemporada = c.Int(nullable: false),
                        CurSalon = c.Int(),
                        CurGrado = c.Int(),
                        CurCodigo = c.String(maxLength: 20),
                        CurDescripcion = c.String(maxLength: 50),
                        CurTutor = c.Int(),
                        CurAuxiliar = c.Int(),
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
                "msn.EstadoMensaje",
                c => new
                    {
                        EstMenId = c.Int(nullable: false, identity: true),
                        EstMenDescripcion = c.String(maxLength: 50),
                        EstMenEstado = c.Byte(nullable: false),
                    })
                .PrimaryKey(t => t.EstMenId);
            
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
                        EstEmpresaMama = c.String(maxLength: 50),
                        EstCargoMama = c.String(maxLength: 50),
                        EstTeleEmpresaMama = c.String(maxLength: 50),
                        EstNombresPapa = c.String(maxLength: 50),
                        EstApellidosPapa = c.String(maxLength: 50),
                        EstTelefonoPapa = c.String(maxLength: 50),
                        EstCorreoPapa = c.String(maxLength: 50),
                        EstEmpresaPapa = c.String(maxLength: 50),
                        EstCargoPapa = c.String(maxLength: 50),
                        EstTeleEmpresaPapa = c.String(maxLength: 50),
                        EstNombresAcuediente = c.String(maxLength: 50),
                        EstApellidosAcudiente = c.String(maxLength: 50),
                        EstTelefonoAcudiente = c.String(maxLength: 50),
                        EstEmpresaAcudiente = c.String(maxLength: 50),
                        EstCargoAcudiente = c.String(maxLength: 50),
                        EstTeleEmpresaAcudiente = c.String(maxLength: 50),
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
                        GruEnvTipo = c.String(maxLength: 2),
                        GruEnvDescripcion = c.String(maxLength: 300),
                        GruEnvioColor = c.String(),
                        GruEstado = c.Boolean(nullable: false),
                        GruAsignaAuto = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.GruEnvId);
            
            CreateTable(
                "msn.GruposEnvioAsignacion",
                c => new
                    {
                        GrAsigId = c.Int(nullable: false, identity: true),
                        GrAsigPersonaId = c.Int(nullable: false),
                        GrAsigGrupoEnvioId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GrAsigId);
            
            CreateTable(
                "msn.GruposEnvioAutorizado",
                c => new
                    {
                        GruPerId = c.Int(nullable: false, identity: true),
                        GruPerGrupoId = c.Int(nullable: false),
                        GruPerPersona = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GruPerId);
            
            CreateTable(
                "msn.GruposEnvioAutorizadoCursos",
                c => new
                    {
                        GrEnAuCurId = c.Int(nullable: false, identity: true),
                        GrEnAuCurCursoId = c.Int(nullable: false),
                        GrEnAuCurPersonaId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GrEnAuCurId);
            
            CreateTable(
                "msn.GruposEnvioAutorizadoGrados",
                c => new
                    {
                        GrEnAuGraId = c.Int(nullable: false, identity: true),
                        GrEnAuGraGradoId = c.Int(nullable: false),
                        GrEnAuGraPersonaId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GrEnAuGraId);
            
            CreateTable(
                "msn.GruposEnvioAutorizadoAll",
                c => new
                    {
                        GrEnAuAllId = c.Int(nullable: false, identity: true),
                        GrEnAuAllEmp = c.Int(nullable: false),
                        GeEnAuAllTemporada = c.Int(nullable: false),
                        GrEnAuAllPersonaId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GrEnAuAllId);
            
            CreateTable(
                "msn.GruposEnvioColores",
                c => new
                    {
                        GrEnColorId = c.Int(nullable: false, identity: true),
                        GrEnColorEmp = c.Int(nullable: false),
                        GrEnColorTipo = c.Int(nullable: false),
                        GrEnColorRGB = c.String(maxLength: 50),
                        GrEnColorObs = c.String(maxLength: 50),
                        GrEnColorBurbuja = c.String(maxLength: 50),
                    })
                .PrimaryKey(t => t.GrEnColorId);
            
            CreateTable(
                "msn.GruposEnvioDet",
                c => new
                    {
                        GruEnvDetId = c.Int(nullable: false, identity: true),
                        GruEnvDetIdGrupo = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.GruEnvDetId);
            
            CreateTable(
                "dbo.LoginAuditoria",
                c => new
                    {
                        LogId = c.Int(nullable: false, identity: true),
                        LogPersonaId = c.Int(nullable: false),
                        LogFecha = c.DateTime(nullable: false),
                    })
                .PrimaryKey(t => t.LogId);
            
            CreateTable(
                "dbo.Materias",
                c => new
                    {
                        MatID = c.Int(nullable: false, identity: true),
                        MatCodigo = c.String(maxLength: 20),
                        MatEmpId = c.Int(nullable: false),
                        MatTemporadaId = c.Int(nullable: false),
                        MatGradoId = c.Int(nullable: false),
                        MatAreaId = c.Int(nullable: false),
                        MatDescripcion = c.String(maxLength: 50),
                        MatEstado = c.Byte(nullable: false),
                        MatElectiva = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.MatID);
            
            CreateTable(
                "msn.Mensajes",
                c => new
                    {
                        MenId = c.Int(nullable: false, identity: true),
                        MenEmpId = c.Int(nullable: false),
                        MenUsuario = c.Int(nullable: false),
                        MenCategoriaId = c.Int(nullable: false),
                        MenClase = c.Int(nullable: false),
                        MenTipoMsn = c.String(maxLength: 2),
                        MenAsunto = c.String(maxLength: 100),
                        MenMensaje = c.String(),
                        MenFecha = c.DateTime(nullable: false),
                        MenReplicaIdMsn = c.Int(nullable: false),
                        MenOkRecibido = c.Byte(nullable: false),
                        MenBloquearRespuesta = c.Byte(nullable: false),
                        MenSendTo = c.String(),
                        MenEstado = c.Int(nullable: false),
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
                        PerUsuario = c.String(maxLength: 50),
                        PerClave = c.String(maxLength: 50),
                        PerEstado = c.Boolean(nullable: false),
                        PerTipoPerfil = c.Int(nullable: false),
                        PerFechanacimiento = c.String(),
                        PerLugarNacimiento = c.String(),
                        PerDireccion = c.String(),
                    })
                .PrimaryKey(t => t.PerId);
            
            CreateTable(
                "DP.Profesores",
                c => new
                    {
                        ProfId = c.Int(nullable: false, identity: true),
                        ProfIdPersona = c.Int(nullable: false),
                        ProfProfesion = c.String(),
                        ProfEspacialidad = c.String(),
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
                        SecRuta = c.String(),
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
            DropTable("dbo.LoginAuditoria");
            DropTable("msn.GruposEnvioDet");
            DropTable("msn.GruposEnvioColores");
            DropTable("msn.GruposEnvioAutorizadoAll");
            DropTable("msn.GruposEnvioAutorizadoGrados");
            DropTable("msn.GruposEnvioAutorizadoCursos");
            DropTable("msn.GruposEnvioAutorizado");
            DropTable("msn.GruposEnvioAsignacion");
            DropTable("msn.GruposEnvio");
            DropTable("dbo.Grados");
            DropTable("DP.Estudiantes");
            DropTable("msn.EstadoMensaje");
            DropTable("dbo.Empresas");
            DropTable("dbo.Cursos");
            DropTable("dbo.CursoEstudiantes");
            DropTable("dbo.Clases");
            DropTable("dbo.ClasesEstudiantes");
            DropTable("msn.CategoriaPerfil");
            DropTable("msn.Categorias");
            DropTable("msn.BandejaEntrada");
            DropTable("dbo.AreasMaterias");
            DropTable("msn.AdjuntosMensaje");
            DropTable("dbo.Adjuntos");
        }
    }
}
