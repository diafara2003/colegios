IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[dbo].[EstadoDocHijos]') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE [dbo].EstadoDocHijos
END
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE dbo.EstadoDocHijos 
	@emp int,@acudiente int 
AS
BEGIN
	

select *
into	#tblGrupos
from	[Gargen].[Grupos]
where GrEmpresa=@emp

select *
into	#TblDocRequerida
from	[dbo].[DocumentosColegio]
where	DocIdEmpresa=@emp

declare @tot int= (select COUNT(1) from #TblDocRequerida)
select GruEstEstudiante,GrNombre,EstApellidos+' '+ EstNombres  as EstNombres,count(DocEstIdPersona) as totDocSubidos,
@tot as totDoc
from	[Gargen].[EstudianteJardin]
inner join [Gargen].[GruposEstudiantes] on EstId=GruEstEstudiante
inner join #tblGrupos on GruEstGrupo=GrId
left join [dbo].[DocumentosEstudiante] on EstId=DocEstIdPersona
where (Acudiente1=@acudiente or Acudiente2=@acudiente)
group by GruEstEstudiante,GrNombre,EstNombres,GrId,EstApellidos
order by GrId
drop table #tblGrupos,#TblDocRequerida
END
GO
