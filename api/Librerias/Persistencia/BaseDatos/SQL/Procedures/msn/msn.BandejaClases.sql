IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'msn.BandejaClases') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE msn.BandejaClases
END
go

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- msn.BandejaClases  15
-- =============================================
CREATE PROCEDURE [msn].[BandejaClases]
	-- Add the parameters for the stored procedure here
	@usuario int
AS
BEGIN

	SELECT	COUNT(1) as CtaNoLeido,BanClaseId AS ID
	INTO	MSN.#CuentaNoLeido
	FROM	MSN.BandejaEntrada
			INNER JOIN Clases on Claid=BanClaseId
			INNER JOIN Materias ON MatID=ClaMateriaId
	WHERE	BanUsuario=@usuario and BanHoraLeido IS NULL
	GROUP BY BanClaseId

	SELECT	BanClaseId,MatDescripcion ,ISNULL(CtaNoLeido,0) AS CtaNoLeido	
	FROM	MSN.BandejaEntrada
			INNER JOIN Clases on Claid=BanClaseId
			INNER JOIN Materias ON MatID=ClaMateriaId
			LEFT JOIN MSN.#CuentaNoLeido ON ID=BanClaseId 
	WHERE	BanUsuario=@usuario --and BanHoraLeido IS NULL
	GROUP BY MatDescripcion,CtaNoLeido,BanClaseId
END
