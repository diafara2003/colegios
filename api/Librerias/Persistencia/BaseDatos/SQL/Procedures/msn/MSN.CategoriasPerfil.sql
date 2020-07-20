IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'MSN.CategoriasPerfil') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE MSN.CategoriasPerfil
END
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- MSN.CategoriasPerfil 1
-- =============================================
CREATE PROCEDURE MSN.CategoriasPerfil
	@id_perfl int
AS
BEGIN
	SELECT  c.CatDescripcion,C.CatId
	INTO    #tblCategoriasPerfil	
	FROM	msn.Categorias c			


	SELECT	CatDescripcion,
	cast(CASE WHEN CatPerPerfil=@id_perfl THEN 1 ELSE 0 END  as bit)AS ASOCIADO
	FROM	#tblCategoriasPerfil
			LEFT JOIN MSN.CategoriaPerfil ON CatId=CatPerCategoria	
	--GROUP BY CatDescripcion
END
GO
