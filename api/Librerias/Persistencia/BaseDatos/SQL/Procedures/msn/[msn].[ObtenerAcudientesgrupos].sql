IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[msn].[ObtenerAcudientesgrupos]') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE [msn].[ObtenerAcudientesgrupos]
END
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	autocomple para envios de correos
-- =============================================
CREATE PROCEDURE [msn].[ObtenerAcudientesgrupos]
	@id int,@empresa int
AS
BEGIN

	select *
	into	#TblAcudientes
	from	dp.personas
	where	PerIdEmpresa=@empresa
				and perestado=1


	SELECT	EstId,
			a1.perid as PerIdA1,
			case when a1.PerTipoAcudiente='ma' then 'Mamá'
				 when a1.PerTipoAcudiente='pa' then 'Papá' 
				 when a1.PerTipoAcudiente='abu' then 'Abuelito' 
				 when a1.PerTipoAcudiente='aba' then 'Abuelita' 
				 when a1.PerTipoAcudiente='T' then 'Tío' 
			end as TipoA1,
			a1.PerNombres as PerNombresA1,
			a1.PerApellidos as PerApellidosA1,

			a2.perid as PerIdA2,
			case when a2.PerTipoAcudiente='ma' then 'Mamá'
				 when a2.PerTipoAcudiente='pa' then 'Papá' 
				 when a2.PerTipoAcudiente='abu' then 'Abuelito' 
				 when a2.PerTipoAcudiente='aba' then 'Abuelita' 
				 when a2.PerTipoAcudiente='T' then 'Tío' 
			end as TipoA2,
			a2.PerNombres as PerNombresA2,
			a2.PerApellidos as PerApellidosA2,				 
			'#09BBF9' color,

			EstNombres,EstApellidos
	FROM	Gargen.EstudianteJardin  E
			INNER JOIN Gargen.GruposEstudiantes GE ON E.EstId=GE.GruEstEstudiante
			INNER JOIN #TblAcudientes A1 ON A1.PERID=Acudiente1
			LEFT JOIN #TblAcudientes A2 ON A2.PERID=Acudiente2
	WHERE	GruEstGrupo=@ID AND EstEmpresa=@empresa
	ORDER BY GruEstGrupo,E.EstNombres,E.EstApellidos,ISNULL(A1.PERID,0),ISNULL(A2.PERID,0)
END
