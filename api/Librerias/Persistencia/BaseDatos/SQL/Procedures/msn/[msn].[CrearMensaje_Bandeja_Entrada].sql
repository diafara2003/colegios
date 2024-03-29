IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[msn].[CrearMensaje_Bandeja_Entrada]') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE [msn].[CrearMensaje_Bandeja_Entrada]
END
go

-- ============================================= 
-- Description:	crea un registro en la taba msn.BandejaEntrada
--			    por cada destinatario enviado en el xml
-- =============================================
CREATE PROCEDURE [msn].[CrearMensaje_Bandeja_Entrada]
	
	@idMensaje int,@destinatarios xml,@empresa int
AS
BEGIN
	CREATE TABLE msn.#TBL_Destinatarios(id int ,tipo int , estudiante int)
	CREATE TABLE msn.#TBL_final(usuario INT,claseid int,estudiante INT DEFAULT(0))

	
	
	INSERT INTO msn.#TBL_Destinatarios
			(id,tipo,estudiante)
	SELECT  CAST(colx.query('data(id) ') as varchar) as id,  
			CAST(colx.query('data(tipo) ') as varchar)  as tipo   ,
			CAST(colx.query('data(estudiante) ') as varchar)  as estudiante   
	FROM	@destinatarios.nodes('ArrayOfDestinarario/Destinarario') AS Tabx(Colx)  

	--select * 
	--into msn.TBL_Destinatarios 
	--from msn.#TBL_Destinatarios 

	--select * from msn.#TBL_Destinatarios return


	/*==========================================================|tipo=-60-->profesor al colegio|=========================================================*/
	IF(SELECT COUNT(1) FROM msn.#TBL_Destinatarios WHERE TIPO=-60)>0 BEGIN
		INSERT INTO msn.#TBL_final (usuario)
		SELECT	P.PerId
		from	[DP].[Personas] P
		where	PerIdEmpresa=@empresa and PerTipoPerfil=0 and p.perestado=1

	end
	 


	/*==========================================================|tipo=-40-->Colegio|=========================================================*/
	IF(SELECT COUNT(1) FROM msn.#TBL_Destinatarios WHERE TIPO=-40)>0 BEGIN
		--acudiente 1
		INSERT INTO msn.#TBL_final (usuario,estudiante)
		SELECT	P.PerId,EstId
		FROM	Gargen.grupos
				INNER JOIN Gargen.GruposEstudiantes ON GrId=GruEstGrupo
				INNER JOIN Gargen.EstudianteJardin ON  GruEstEstudiante=	EstId
					AND GrEmpresa=EstEmpresa
				INNER JOIN [DP].[Personas] P ON  Acudiente1=P.PerId
		WHERE	GrEmpresa=@empresa
				and p.perestado=1
				and EstEstado=1

		--acudiente 2
		INSERT INTO msn.#TBL_final (usuario,estudiante)
		SELECT	P.PerId,EstId
		FROM	Gargen.grupos
				INNER JOIN Gargen.GruposEstudiantes ON GrId=GruEstGrupo
				INNER JOIN Gargen.EstudianteJardin ON  GruEstEstudiante=	EstId
					AND GrEmpresa=EstEmpresa
				INNER JOIN [DP].[Personas] P ON  Acudiente2=P.PerId
		WHERE	GrEmpresa=@empresa 
				and p.perestado=1
				and EstEstado=1

		--PROFESORES
		INSERT INTO msn.#TBL_final (usuario)
		SELECT	P.PerId
		FROM	Gargen.grupos
				INNER JOIN Gargen.GruposProfesor ON GrId=GruProGrupo
				INNER JOIN [DP].[Personas] P 	ON P.PERID=GruProProfesor			
		WHERE	GrEmpresa=@empresa  and p.perestado=1
	END


	/*==========================================================|tipo=-30-->PLANTA EDUCATIVA|=========================================================*/
	if(SELECT COUNT(1) FROM msn.#TBL_Destinatarios WHERE tipo=-30)>0 begin
		INSERT INTO msn.#TBL_final (usuario)
		SELECT	P.PerId
		FROM	Gargen.grupos
				INNER JOIN Gargen.GruposProfesor ON GrId=GruProGrupo
				INNER JOIN [DP].[Personas] P 	ON P.PERID=GruProProfesor			
		WHERE	GrEmpresa=@empresa  and p.perestado=1
	end

	/*==========================================================|tipo=-35-->PROFESORES PLANTA EDUCATIVA|==============================================*/
	if(SELECT COUNT(1) FROM msn.#TBL_Destinatarios WHERE tipo=-35)>0 begin
		INSERT INTO msn.#TBL_final (usuario,estudiante)
		SELECT	id,estudiante
		FROM	msn.#TBL_Destinatarios
		WHERE	tipo=-35
	end

	/*==========================================================|tipo=-20-->GRUPOS JARDIN|============================================================*/
	if(SELECT COUNT(1) FROM msn.#TBL_Destinatarios WHERE tipo=-20)>0 begin
		--acudiente 1
		INSERT INTO msn.#TBL_final (usuario,estudiante)
		SELECT	P.PerId,EstId
		FROM	Gargen.grupos
				INNER JOIN Gargen.GruposEstudiantes ON GrId=GruEstGrupo
				INNER JOIN Gargen.EstudianteJardin ON  GruEstEstudiante=	EstId
					AND GrEmpresa=EstEmpresa
				INNER JOIN [DP].[Personas] P ON  Acudiente1=P.PerId
		WHERE	GrEmpresa=@empresa
				and p.perestado=1
				and EstEstado=1

		--acudiente 2
		INSERT INTO msn.#TBL_final (usuario,estudiante)
		SELECT	P.PerId,EstId
		FROM	Gargen.grupos
				INNER JOIN Gargen.GruposEstudiantes ON GrId=GruEstGrupo
				INNER JOIN Gargen.EstudianteJardin ON  GruEstEstudiante=	EstId
					AND GrEmpresa=EstEmpresa
				INNER JOIN [DP].[Personas] P ON  Acudiente2=P.PerId
		WHERE	GrEmpresa=@empresa  and EstEstado=1 and p.perestado=1

	end


	/*==========================================================|tipo=-25-->acudientes|===============================================================*/
	if(SELECT COUNT(1) FROM msn.#TBL_Destinatarios WHERE tipo=-25)>0 begin
		INSERT INTO msn.#TBL_final (usuario,estudiante)
		SELECT	id,estudiante
		FROM	msn.#TBL_Destinatarios
		WHERE	tipo=-25
	end

	/*==========================================================|tipo=-28-->RESPONDER A UN ESTUDIANTE|===============================================================*/
	if(SELECT COUNT(1) FROM msn.#TBL_Destinatarios WHERE tipo=-28)>0 begin
		--acudiente 1
		INSERT INTO msn.#TBL_final (usuario,estudiante)
		SELECT	P.PerId,EstId
		FROM	msn.#TBL_Destinatarios
				INNER JOIN Gargen.EstudianteJardin ON EstId=estudiante
				INNER JOIN [DP].[Personas] P ON  Acudiente1=P.PerId
		WHERE	tipo=-28 and EstEstado=1and p.perestado=1


		--acudiente 1
		INSERT INTO msn.#TBL_final (usuario,estudiante)
		SELECT	P.PerId,EstId
		FROM	msn.#TBL_Destinatarios
				INNER JOIN Gargen.EstudianteJardin ON EstId=estudiante
				INNER JOIN [DP].[Personas] P ON  Acudiente2=P.PerId
		WHERE	tipo=-28 and EstEstado=1 and p.perestado=1
	end

	


	/*
	/*==========================================================|tipo=-30-->Grados|==========================================================*/
	INSERT INTO msn.#TBL_final (usuario)
	SELECT	CE.CurEstEstudianteId
	FROM	[dbo].[CursoEstudiantes] CE 
			INNER JOIN	[dbo].[Cursos] C ON C.CurId=CE.CurEstCursoId 
			INNER JOIN msn.#TBL_Destinatarios D ON D.ID=C.CurGrado AND D.TIPO=-30
			INNER JOIN DP.Personas p on p.PerId=CE.CurEstEstudianteId and p.PerEstado=1
			INNER JOIN [dbo].[Temporada] T ON T.TempId=c.CurTemporada and t.TempEstado=1
	WHERE	P.PerIdEmpresa=@empresa	
	


	/*==========================================================|tipo=-20-->Cursos|==========================================================*/
	INSERT INTO msn.#TBL_final (usuario)
	SELECT	CE.CurEstEstudianteId
	FROM	[dbo].[CursoEstudiantes] CE 			
			INNER JOIN msn.#TBL_Destinatarios D ON D.ID=CE.CurEstCursoId AND D.TIPO=-20
			INNER JOIN DP.Personas p on p.PerId=CE.CurEstEstudianteId and p.PerEstado=1
			--INNER JOIN [dbo].[Temporada] T ON T.TempId=c.CurTemporada and t.TempEstado=1
	WHERE	P.PerIdEmpresa=@empresa


	/*==========================================================|tipo=-10-->Clases|==========================================================*/
	INSERT INTO msn.#TBL_final (usuario,claseid)
	SELECT	CE.CurEstEstudianteId,D.ID
	
	FROM	[dbo].[CursoEstudiantes] CE
			INNER JOIN [dbo].[Clases] C ON C.ClaCursoId=CE.CurEstCursoId
			INNER JOIN msn.#TBL_Destinatarios D ON D.ID=C.Claid AND D.TIPO=-10
			INNER JOIN DP.Personas p on p.PerId=CE.CurEstEstudianteId and p.PerEstado=1
			INNER JOIN [dbo].[Temporada] T ON T.TempId=c.ClaTemporada and t.TempEstado=1
	WHERE	P.PerIdEmpresa=@empresa
	
	

	/*==========================================================|tipo=-5-->Personalizados|===================================================*/
	INSERT INTO msn.#TBL_final (usuario)
	SELECT	A.GruPerPersona
	FROM	[msn].[GruposEnvioAutorizado] A
			INNER JOIN msn.#TBL_Destinatarios D ON D.ID=A.GruPerGrupoId AND D.TIPO=-5
			INNER JOIN DP.Personas p on p.PerId=a.GruPerPersona and p.PerEstado=1 
	WHERE	P.PerIdEmpresa=@empresa



	/*==========================================================|tipo=0-->Estudiantes|=======================================================*/
	/*==========================================================|tipo=1-->Profesores|==========================================================*/
	INSERT INTO msn.#TBL_final (usuario)
	SELECT	id
	FROM	msn.#TBL_Destinatarios D 
			INNER JOIN DP.Personas p on p.PerId=id --and p.PerEstado=1
			--INNER JOIN Empresas on EmpId=PerIdEmpresa
	WHERE	D.TIPO in(0,1,2) and PerIdEmpresa=@empresa
	*/

	/*
	--TEST
	SELECT * 
	FROM  msn.#TBL_final 
	GROUP BY  usuario	
	return
	*/

	/*==========================================================|insert final|==========================================================*/
   INSERT INTO [msn].[BandejaEntrada]
           ([BanMsnId],[BanEstado],[BanUsuario],[BanOkRecibido],[BanOkRecibidoFecha],BanClaseId,BanEstudianteId)
   SELECT	DISTINCT
			@idMensaje,1,usuario,0,GETDATE(),claseid,case when estudiante is null then 0 else estudiante end
   FROM		msn.#TBL_final
   GROUP BY  usuario,claseid,estudiante

   select	DISTINCT LgId,UsuarioId,TokenFCM 
   from		dp.LoginPhone 
			INNER JOIN msn.#TBL_final ON UsuarioId=usuario
	GROUP BY LgId,UsuarioId,TokenFCM 
           
END

