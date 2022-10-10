
IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[dbo].[DocReqEstudiante]') 
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
CREATE PROCEDURE dbo.DocReqEstudiante 
	@emp int,@idest int
AS
BEGIN
	
SELECT 
    ISNULL(AjdId,0) AjdId,
	ISNULL(AjdExtension,'') AjdExtension,
	ISNULL(AdjNombre,'') AdjNombre,
	DocTexto
    FROM   [dbo].[DocumentosColegio] 
    LEFT JOIN DocumentosEstudiante on DocEstIdDoc=DocId
		AND DocEstIdEmpresa=@emp and DocEstIdPersona=@idest
	LEFT JOIN Adjuntos on AjdId=DocEstIdAdj and AdjIdEmpresa=4
    WHERE DocIdEmpresa = @emp  

end