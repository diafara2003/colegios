IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[msn].[ConsultarMensaje]') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE [msn].[ConsultarMensaje]
END 
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- exec MSN.[ConsultarMensaje] @tipo=0
-- @tipo=0=bandeja de entrada
-- @tipo=1=Enviado
-- @tipo=2=No leidos
-- @tipo=-1=Eliminados
-- @tipo=-2=Borradores
-- =============================================
CREATE PROCEDURE [msn].[ConsultarMensaje]
@usuario varchar(10)=15,@tipo int=0
AS
BEGIN
DECLARE @SQL VARCHAR(MAX)
IF @tipo=-1 BEGIN
SET @SQL ='SELECT	MenId,BanId,MenAsunto,MenMensaje,					
					BanOkRecibido,
					ISNULL(MenCategoriaId,0) MenCategoriaId,
					isnull(BanClaseId,0) BanClaseId,
					ISNULL(BanDestacado,0) BanDestacado,
					CONVERT(VARCHAR(15),MenFecha,103) +'' ''+ CONVERT(varchar(5),CAST(MenFecha AS TIME),108) MenFecha,					
					ISNULL(c.CatColor,'''') MenColor,
					MenOkRecibido,MenBloquearRespuesta,
					PerNombres,PerApellidos,BanHoraLeido BanHoraLeido,
					CASE WHEN A.AdjMsnMensajeId IS NULL THEN 0 ELSE 1 END AS TieneAdjuntos
			FROM	MSN.BandejaEntrada
					INNER JOIN msn.Mensajes ON MENID=BanMsnId
					INNER JOIN DP.Personas on PerId=MenUsuario
					LEFT JOIN [msn].[Categorias] C ON C.CatId=MenCategoriaId
					LEFT JOIN [msn].[AdjuntosMensaje] A ON A.AdjMsnMensajeId=MenId
			WHERE	BanEstado=-1 and MenEstado>=0 and banusuario='+@usuario 
			
END
ELSE IF @tipo=-2  BEGIN
SET @SQL ='SELECT	MenId,0 BanId,MenAsunto,MenMensaje,
					cast(0 as tinyint) BanOkRecibido,
					0 BanClaseId,
					0 BanDestacado,
					ISNULL(MenCategoriaId,0) MenCategoriaId,
					CONVERT(VARCHAR(15),MenFecha,103) +'' ''+ CONVERT(varchar(5),CAST(MenFecha AS TIME),108) MenFecha,
					ISNULL(c.CatColor,'''') MenColor,
					MenOkRecibido,MenBloquearRespuesta,
					PerNombres,PerApellidos,getdate() as BanHoraLeido,
					CASE WHEN A.AdjMsnMensajeId IS NULL THEN 0 ELSE 1 END AS TieneAdjuntos
			FROM	msn.Mensajes 
					INNER JOIN DP.Personas on PerId=MenUsuario
					LEFT JOIN [msn].[Categorias] C ON C.CatId=MenCategoriaId
					LEFT JOIN [msn].[AdjuntosMensaje] A ON A.AdjMsnMensajeId=MenId
			WHERE	MenEstado=-1 and MenUsuario='+@usuario
END
ELSE IF @tipo=0 BEGIN
SET @SQL ='SELECT	MenId,BanId,MenAsunto,MenMensaje,					
					BanOkRecibido,
					ISNULL(MenCategoriaId,0) MenCategoriaId,
					isnull(BanClaseId,0) BanClaseId,
					ISNULL(BanDestacado,0) BanDestacado,
					CONVERT(VARCHAR(15),MenFecha,103) +'' ''+ CONVERT(varchar(5),CAST(MenFecha AS TIME),108) MenFecha,					
					ISNULL(c.CatColor,'''') MenColor,
					MenOkRecibido,MenBloquearRespuesta,
					PerNombres,PerApellidos,BanHoraLeido BanHoraLeido,
					CASE WHEN A.AdjMsnMensajeId IS NULL THEN 0 ELSE 1 END AS TieneAdjuntos
			FROM	MSN.BandejaEntrada
					INNER JOIN msn.Mensajes ON MENID=BanMsnId
					INNER JOIN DP.Personas on PerId=MenUsuario
					LEFT JOIN [msn].[Categorias] C ON C.CatId=MenCategoriaId
					LEFT JOIN [msn].[AdjuntosMensaje] A ON A.AdjMsnMensajeId=MenId
			WHERE	BanEstado>=0 and MenEstado>=0 and  banusuario='+@usuario 
			
END
ELSE IF @tipo=1  BEGIN
SET @SQL ='SELECT	MenId,0 BanId,MenAsunto,MenMensaje,
					cast(0 as tinyint) BanOkRecibido,
					0 BanClaseId,
					0 BanDestacado,
					ISNULL(MenCategoriaId,0) MenCategoriaId,
					CONVERT(VARCHAR(15),MenFecha,103) +'' ''+ CONVERT(varchar(5),CAST(MenFecha AS TIME),108) MenFecha,
					ISNULL(c.CatColor,'''') MenColor,
					MenOkRecibido,MenBloquearRespuesta,
					PerNombres,PerApellidos,getdate() as BanHoraLeido,
					CASE WHEN A.AdjMsnMensajeId IS NULL THEN 0 ELSE 1 END AS TieneAdjuntos
			FROM	msn.Mensajes 
					INNER JOIN DP.Personas on PerId=MenUsuario
					LEFT JOIN [msn].[Categorias] C ON C.CatId=MenCategoriaId
					LEFT JOIN [msn].[AdjuntosMensaje] A ON A.AdjMsnMensajeId=MenId
			WHERE	MenEstado>=0 and MenUsuario='+@usuario
END
ELSE IF @tipo=2  BEGIN
SET @SQL ='SELECT	MenId,BanId as BanId,MenAsunto,MenMensaje,
					BanOkRecibido,
					isnull(BanClaseId,0) BanClaseId,
					ISNULL(MenCategoriaId,0) MenCategoriaId,
					ISNULL(BanDestacado,0) BanDestacado,
					CONVERT(VARCHAR(15),MenFecha,103) +'' ''+ CONVERT(varchar(5),CAST(MenFecha AS TIME),108) MenFecha,					
					ISNULL(c.CatColor,'''') MenColor,
					MenOkRecibido,MenBloquearRespuesta,
					PerNombres,PerApellidos,
					BanHoraLeido,
					CASE WHEN A.AdjMsnMensajeId IS NULL THEN 0 ELSE 1 END AS TieneAdjuntos
			FROM	MSN.BandejaEntrada
					INNER JOIN msn.Mensajes ON MENID=BanMsnId
					INNER JOIN DP.Personas on PerId=MenUsuario
					LEFT JOIN [msn].[Categorias] C ON C.CatId=MenCategoriaId
					LEFT JOIN [msn].[AdjuntosMensaje] A ON A.AdjMsnMensajeId=MenId
			WHERE	BanEstado>=0 and MenEstado>=0 and BanHoraLeido is null and banusuario='+@usuario
			
END
SET @SQL +=' ORDER BY CONVERT(SMALLDATETIME,MenFecha) DESC'
PRINT(@SQL)
EXEC (@SQL)
END

