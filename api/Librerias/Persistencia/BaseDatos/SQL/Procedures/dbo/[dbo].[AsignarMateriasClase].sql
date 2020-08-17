IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[dbo].[AsignarMateriasClase]') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE [dbo].[AsignarMateriasClase]
END
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[AsignarMateriasClase]
	@empresa int
AS
BEGIN

INSERT INTO [dbo].[Clases]
           ([ClaEmpId],[ClaTemporada],[ClaMateriaId],ClaCursoId           
           )
SELECT		@empresa AS empresa ,MatTemporadaId,MatID,CurId
FROM		Materias 
			INNER JOIN Temporada ON TempId=MatTemporadaId
			INNER JOIN Grados ON GraId=MatGradoId
			INNER JOIN Cursos on GraId=CurGrado
			LEFT JOIN Clases on MatID=ClaMateriaId		
WHERE		MatEstado=1 and Claid is null


END
