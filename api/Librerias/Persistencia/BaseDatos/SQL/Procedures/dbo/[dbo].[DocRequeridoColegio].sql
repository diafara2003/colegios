IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[dbo].[DocRequeridoColegio]') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE [dbo].DocRequeridoColegio
END
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE dbo.DocRequeridoColegio 
	@emp int
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
select GrNombre,EstApellidos+' '+ EstNombres  as EstNombres,count(DocEstIdPersona) as totDocSubidos,
@tot as totDoc
from	[Gargen].[EstudianteJardin]
inner join [Gargen].[GruposEstudiantes] on EstId=GruEstEstudiante
inner join #tblGrupos on GruEstGrupo=GrId
left join [dbo].[DocumentosEstudiante] on EstId=DocEstIdPersona
group by GrNombre,EstNombres,GrId,EstApellidos
order by GrId
drop table #tblGrupos,#TblDocRequerida
END
GO
