IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'msn.CategoriasMensajesRecibido') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE msn.CategoriasMensajesRecibido
END
go

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- msn.CategoriasMensajesRecibido  15
-- =============================================
CREATE PROCEDURE [msn].[CategoriasMensajesRecibido]
	-- Add the parameters for the stored procedure here 
	@usuario int
AS
BEGIN

	SELECT	COUNT(1) as CtaNoLeido,MenCategoriaId AS ID
			
	INTO	MSN.#CuentaNoLeido
	FROM	msn.BandejaEntrada
			INNER JOIN MSN.Mensajes ON BanMsnId=MenId
			INNER JOIN MSN.Categorias ON CatId=MenCategoriaId
	WHERE	BanUsuario=@usuario and BanHoraLeido IS NULL
	GROUP BY MenCategoriaId,CatColor

	--SELECT * FROM MSN.#CuentaNoLeido

	SELECT	MenCategoriaId,CatDescripcion,ISNULL(CtaNoLeido,0) AS CtaNoLeido,
			CatColor
	FROM	msn.BandejaEntrada
			INNER JOIN MSN.Mensajes ON BanMsnId=MenId
			INNER JOIN MSN.Categorias ON CatId=MenCategoriaId
			LEFT JOIN MSN.#CuentaNoLeido ON ID=MenCategoriaId
	WHERE	BanUsuario=@usuario
	GROUP BY CatDescripcion,CtaNoLeido,MenCategoriaId,CatColor
END
