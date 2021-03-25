IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[msn].ConsultarMensajes') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE [msn].ConsultarMensajes
END
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [msn].ConsultarMensajes
	@id int
AS
BEGIN
  
    ;WITH _msn (id)
    AS
    (
    SELECT MenId from msn.Mensajes where MenId=@id
        UNION ALL
    SELECT  MenReplicaIdMsn from msn.Mensajes
            INNER JOIN _msn on _msn.id=MenId 
    )
    SELECT * FROM _MSN
END
GO
