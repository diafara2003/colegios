IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[msn].[AcEnvioCorreoPersonas]') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE [msn].[AcEnvioCorreoPersonas]
END
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	autocomple para envios de correos
-- =============================================
CREATE PROCEDURE [msn].[AcEnvioCorreoPersonas] 
	@filter varchar(50),@idusuario VARCHAR(50), @Temporada VARCHAR(5)=1, @Emp VARCHAR(5)=1
AS
BEGIN
	DECLARE @tipo_perfil VARCHAR(2),@sql VARCHAR(MAX),@Tipo VARCHAR(10)
	CREATE TABLE msn.#TblCursos(idcurso INT)

	SET @tipo_perfil=ISNULL((SELECT CAST(PerTipoPerfil AS VARCHAR) FROM	DP.Personas WHERE PerId=@idusuario),0)	

	--select @tipo_perfil return

	--SELECT @tipo_perfil RETURN
	--	PROFESOR
	IF(@tipo_perfil=1)BEGIN
	
		SET @sql='
		SELECT	--TOP(5)				
				PerId,PerApellidos,PerNombres
				,GraDescripcion,CurDescripcion,
				' + @tipo_perfil + ' AS tipo, 0 AS Orden,
				gc.GrEnColorRGB,gc.GrEnColorBurbuja,GrEnColorObs,
				0 as idEst
		INTO	MSN.#TBLDatos
		FROM	Clases
				INNER JOIN	Cursos ON ClaCursoId=curid
				INNER JOIN	CursoEstudiantes ON CurEstCursoId=CurId
				INNER JOIN	DP.Personas ON PerId=CurEstEstudianteId and PerIdEmpresa='+@Emp+' --AND PerTipoPerfil=2
				INNER JOIN Grados ON GraId=CurGrado
				INNER JOIN [msn].[GruposEnvioColores] GC on  gc.GrEnColorTipo=' + @tipo_perfil + '
				and ISNULL(GrEnColorEmp,'+@Emp+')='+@Emp+'
		WHERE	ClaProfesor='+CONVERT(VARCHAR,@idusuario)
		
		IF @filter<>'' BEGIN
			IF ISNUMERIC(@filter)=1 BEGIN
				SET @sql +=' AND PerDocumento LIKE  ''%'+@filter+'%'''
			END
			ELSE BEGIN 
				SET @sql +=' AND PerNombres +PerApellidos  LIKE  ''%'+@filter+'%'''
				--SET @sql +=' OR PerApellidos LIKE  ''%'+@filter+'%'''
			END
			
		END
		SET @sql +=' GROUP BY PerId,PerNombres,PerApellidos,GraDescripcion,CurDescripcion,
							  gc.GrEnColorRGB,gc.GrEnColorBurbuja,GrEnColorObs'
		--set @sql +=' ORDER BY PerApellidos,PerNombres'

	END
	--	ESTUDIANTE
	ELSE BEGIN
		SET @sql='
		SELECT	--TOP (5)
				PerId, PerApellidos, PerNombres
				,'''' GraDescripcion,
				 MatDescripcion CurDescripcion,
				' + @tipo_perfil + ' AS tipo, 0 AS Orden,
				gc.GrEnColorRGB,gc.GrEnColorBurbuja,GrEnColorObs,
				0 as idEst
		INTO	MSN.#TBLDatos
		FROM	CursoEstudiantes				
				INNER JOIN	Clases ON ClaCursoId=CurEstCursoId				
				INNER JOIN	DP.Personas ON PerId=ClaProfesor and PerIdEmpresa='+@Emp+'
				INNER JOIN	Materias ON MatID=ClaMateriaId
				INNER JOIN [msn].[GruposEnvioColores] GC on  gc.GrEnColorTipo=' + @tipo_perfil + '
		WHERE	CurEstEstudianteId='+CONVERT(VARCHAR,@idusuario)
		
		IF @filter<>'' BEGIN
			IF ISNUMERIC(@filter)=1 BEGIN
				SET @sql +=' AND PerDocumento LIKE  ''%'+@filter+'%'''
			END
			ELSE BEGIN 
				SET @sql +=' AND PerNombres+PerApellidos+MatDescripcion LIKE  ''%'+@filter+'%'''
				--SET @sql +=' OR PerApellidos LIKE  ''%'+@filter+'%'''
				--SET @sql +=' OR MatDescripcion LIKE  ''%'+@filter+'%'''
			END
			
		END
		
		SET @SQL +=' GROUP BY PerId,PerNombres,PerApellidos,MatDescripcion,
							  gc.GrEnColorRGB,gc.GrEnColorBurbuja,GrEnColorObs'
	END

	SET @SQL = @SQL + '
	UNION ALL
	SELECT	GruEnvId, G.GruEnvDescripcion, '''', '''', '''', 0, -5,
			gc.GrEnColorRGB,gc.GrEnColorBurbuja,GrEnColorObs,
			0 as idEst
	FROM	msn.GruposEnvio AS G INNER JOIN
			msn.GruposEnvioAutorizado AS P ON G.GruEnvId = P.GruPerGrupoId INNER JOIN 
			[msn].[GruposEnvioColores] GC on  gc.GrEnColorTipo=0
	WHERE	(P.GruPerPersona = '+@idusuario+') AND (G.GruEnvEmpId = '+@Emp+') AND (G.GruEnvTemporada= '+@Temporada+')
	'

	--select @tipo_perfil,'jjj'return

	IF(@tipo_perfil IN(0,1))begin
	--garden PROFESOR
	SET @SQL = @SQL + '
	UNION ALL
	SELECT	PerId,isnull(PerApellidos,''''), PerNombres,''Profesor'',
			STUFF((	SELECT '', ''+GRNOMBRE  
					FROM	Gargen.GruposProfesor 
							INNER JOIN Gargen.grupos ON GRID=GRUPROGRUPO 
					WHERE GruProProfesor=perid 
					ORDER BY   GRNOMBRE   FOR XML PATH('''')),1,1,'''')	,
			-30 AS tipo, 1 AS Orden,
			''#43AC34'',''#43AC34'',''Planta educativa'',
			0 as idEst
	FROM	  DP.PERSONAS 
	where PerIdEmpresa='+@Emp+' and PerTipoPerfil in(0,1) AND PerId<>'+@idusuario+'
	
	'
	END
	else IF(@tipo_perfil=3)begin
		SET @SQL = @SQL + '
		UNION ALL
		SELECT	PerId,isnull(PerApellidos,''''), PerNombres,''Profesor'',
				isnull(EstNombres,'''')+'' ''+isnull(EstApellidos,'''')	,
				-25 AS tipo, 1 AS Orden,
				''#43AC34'',''#43AC34'',''Planta educativa'',
				EstId as idEst
		FROM	Gargen.EstudianteJardin
				INNER JOIN   Gargen.GruposEstudiantes on GruEstEstudiante=EstId
				INNER JOIN	 Gargen.grupos on GrId=GruEstGrupo
				INNER JOIN	 Gargen.GruposProfesor ON GRID=GRUPROGRUPO 
				INNER JOIN   DP.PERSONAS on GruProProfesor=perid 
					and GrEmpresa=EstEmpresa
					
		WHERE	PerTipoPerfil=1 and EstEmpresa='+@EMP+' and (acudiente1='+@idusuario+' or acudiente2='+@idusuario+' ) and GrEmpresa='+@EMP+'
	'
	END



--garden ESTUDIANTE
IF(@tipo_perfil=1)begin
	SET @SQL = @SQL + '
	UNION ALL
	SELECT	Acudiente1, EstApellidos, EstNombres,'''', GRNOMBRE,-10 AS tipo, 1 AS Orden,
			''#09BBF9'',''#09BBF9'',''Estudiantes'',
			EstId as idEst
	FROM	Gargen.EstudianteJardin INNER JOIN
			Gargen.GruposEstudiantes ON ESTID=GruEstEstudiante INNER JOIN				
			Gargen.grupos ON GRID=GRUESTGRUPO and Acudiente1>0 AND EstEmpresa='+@EMP+'
			INNER JOIN Gargen.GruposProfesor ON GruProGrupo=GruEstGrupo
			AND GruProProfesor='+@idusuario+'
'
end
/*
else begin
	SET @SQL = @SQL + '
	UNION ALL
	SELECT	Acudiente1, EstApellidos, EstNombres,'''', GRNOMBRE,-10 AS tipo, 1 AS Orden,
			''#09BBF9'',''#09BBF9'',''Estudiantes''
	FROM	Gargen.EstudianteJardin
			INNER JOIN   Gargen.GruposEstudiantes on GruEstEstudiante=EstId
			INNER JOIN	 Gargen.grupos on GrId=GruEstGrupo
	WHERE	EstEmpresa='+@EMP+' and (acudiente1='+@idusuario+' or acudiente2='+@idusuario+' ) and GrEmpresa='+@EMP+'
'
end*/


--grupos PROFESOR
	IF(@tipo_perfil=0)begin
		SET @SQL = @SQL + '
		UNION ALL
		SELECT	GrId, '''',GrNombre,GrNombre, '''',-20 AS tipo, GrId AS Orden,
				''#fd7e14'',''#fd7e14'',''Grupos'',
				0 as idEst
		FROM	Gargen.grupos
		where	GrEmpresa='+@EMP+'
		
	'

	
	end
	else begin
		
		SET @SQL = @SQL + '
		UNION ALL
		SELECT	GrId, '''',GrNombre,GrNombre, '''',-20 AS tipo, -20 AS Orden,
				''#fd7e14'',''#fd7e14'',''Grupos'',
				0 as idEst
		FROM	Gargen.GruposProfesor INNER JOIN				
				Gargen.grupos ON GRID=GRUPROGRUPO 
			
				AND GruProProfesor='+@idusuario+' and GrEmpresa='+@EMP+'
	'
	end


	SET @SQL = @SQL + '
	UNION ALL
	SELECT	Cla.Claid, ''Clase'', Cur.CurDescripcion, '''', Mat.MatDescripcion, -10, GraOrden,
			gc.GrEnColorRGB,gc.GrEnColorBurbuja,GrEnColorObs,
			0 as idEst
	FROM	dbo.Clases AS Cla INNER JOIN
			dbo.Materias AS Mat ON Cla.ClaMateriaId = Mat.MatID INNER JOIN
			dbo.Cursos AS Cur ON Cla.ClaCursoId = Cur.CurId INNER JOIN
			dbo.Grados AS G ON Cur.CurGrado = G.GraId INNER JOIN 
			[msn].[GruposEnvioColores] GC on  gc.GrEnColorTipo=-10
	WHERE	(Cla.ClaEmpId = '+@Emp+') AND (Cla.ClaTemporada = '+@Temporada+') AND (Cla.ClaProfesor = '+@idusuario+')
'


	SET @SQL = @SQL + '
	UNION ALL
	SELECT	A.GrEnAuCurCursoId, ''Curso'', C.CurDescripcion, '''','''', -20, GraOrden,
			gc.GrEnColorRGB,gc.GrEnColorBurbuja,GrEnColorObs,
			0 as idEst
	FROM	msn.GruposEnvioAutorizadoCursos AS A INNER JOIN
			dbo.Cursos C ON A.GrEnAuCurCursoId = C.CurId INNER JOIN
			dbo.Grados AS G ON C.CurGrado = G.GraId INNER JOIN 
			[msn].[GruposEnvioColores] GC on  gc.GrEnColorTipo=-20
	WHERE	(C.CurEmpId = '+@Emp+') AND (C.CurTemporada = '+@Temporada+') AND (A.GrEnAuCurPersonaId = '+@idusuario+')
'

	SET @SQL = @SQL + '
	UNION ALL
	SELECT	A.GrEnAuGraGradoId, ''Grado'', G.GraDescripcion,'''','''',-30, GraOrden,
			gc.GrEnColorRGB,gc.GrEnColorBurbuja,GrEnColorObs,
			0 as idEst
	FROM	msn.GruposEnvioAutorizadoGrados AS A INNER JOIN
			Grados G ON A.GrEnAuGraGradoId = G.GraId INNER JOIN 
			[msn].[GruposEnvioColores] GC on  gc.GrEnColorTipo=-30
	WHERE	(G.GraEmpId = '+@Emp+') AND  (A.GrEnAuGraPersonaId = '+@idusuario+')
'


	SET @SQL = @SQL + '
	UNION ALL
	SELECT	'+@Emp+', E.EmpNombre, '''','''','''',-40, 0,
			--gc.GrEnColorRGB,gc.GrEnColorBurbuja,
			''red'',''red'',
			E.EmpNombre,
			0 as idEst
	FROM	msn.GruposEnvioAutorizadoAll AS A INNER JOIN
			dbo.Empresas E ON E.EmpId = A.GrEnAuAllEmp 
			--INNER JOIN  [msn].[GruposEnvioColores] GC on  gc.GrEnColorTipo=-40
	WHERE	(A.GeEnAuAllTemporada = '+@Temporada+') AND (A.GrEnAuAllPersonaId = '+@idusuario+')
'

	
	SET @sql +='ORDER BY tipo, Orden, PerApellidos,PerNombres
	'
	SET @sql +=' SELECT * FROM MSN.#TBLDatos where 1=1 '

	IF @filter<>'' BEGIN		
		SET @sql +=' AND PerNombres+PerApellidos LIKE  ''%'+@filter+'%'''
		--SET @sql +=' OR PerApellidos LIKE  ''%'+@filter+'%'''			
	END

	PRINT @SQL
	EXEC (@sql)



END


--	Profesor
--	[msn].[AcEnvioCorreoPersonas] '',16

--	Estudiante
--	[msn].[AcEnvioCorreoPersonas] '',32

--




