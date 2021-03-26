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
    
	SELECT	MenId,MenAsunto,MenBloquearRespuesta,MenUsuario,MenClase,
			MenEmpId,MenFecha,MenMensaje,MenOkRecibido,MenSendTo,
			MenUsuario,
			MenTipoMsn,MenCategoriaId,MenEstado,MenFechaMaxima,
			PerNombres,PerApellidos,PerDocumento,PerEmail
	FROM	_MSN
			INNER JOIN MSN.Mensajes ON MENID=ID
			INNER JOIN DP.PERSONAS ON MenUsuario=PerId
END
GO
