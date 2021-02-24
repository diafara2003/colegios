IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[Gargen].[GetGrupos]') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE Gargen.[GetGrupos]
END
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
create PROCEDURE Gargen.[GetGrupos]
	@empresa VARCHAR(10),@temporada VARCHAR(10),@id VARCHAR(10)=''
AS
BEGIN

	CREATE TABLE #TblgruposFinal(IdGrupo int,Nombre varchar(100),Estudiantes int default(0), Profesores varchar(max) default(''))

	DECLARE @SQL VARCHAR(MAX)


	SET @SQL='	SELECT	GrNombre,GrId	
				FROM	[Gargen].[Grupos]
				WHERE	GrEmpresa='+@empresa +' and GrTemporada='+@temporada


	IF (@id NOT IN('','_',' '))BEGIN
		SET @SQL +=' AND GrId'+@ID
	END

	INSERT INTO #TblgruposFinal
			(Nombre,IdGrupo)
	EXEC (@SQL)



	

	update	#TblgruposFinal
	set		Estudiantes=x._count
	from	#TblgruposFinal
			inner join (
			select	IdGrupo,count(EstId) as _count
			from	[Gargen].[Estudiantes]
					inner join #TblgruposFinal on EstGrupo=IdGrupo
			group by IdGrupo
			) as x on x.IdGrupo=#TblgruposFinal.IdGrupo



	select * from #TblgruposFinal
END
GO
