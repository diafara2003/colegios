IF EXISTS ( SELECT * 
            FROM   sysobjects 
            WHERE  id = object_id(N'[msn].ConsultarMensajesChat') 
                   and OBJECTPROPERTY(id, N'IsProcedure') = 1 )
BEGIN
    DROP PROCEDURE [msn].ConsultarMensajesChat
END
go
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [msn].[ConsultarMensajesChat]
	@id int,@bandeja int
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
			
			MenTipoMsn,MenCategoriaId,MenEstado,MenFechaMaxima,
			PerNombres,isnull(PerApellidos,'') PerApellidos,PerDocumento, 
            isnull(PerEmail,'')PerEmail,
            0 BanEstudianteId,
            @bandeja BanId,

            cast('' as varchar(200)) EstNombres,
            cast('' as varchar(200)) EstApellidos
    into    #TblMensaje
	FROM	_MSN
			INNER JOIN MSN.Mensajes ON MENID=ID
			INNER JOIN DP.PERSONAS ON MenUsuario=PerId
            --INNER JOIN MSN.Bandejaentrada on MenId=BanMsnId
           -- LEFT JOIN Gargen.EstudianteJardin ON EstId=isnull(BanEstudianteId,0)
  --  where   BanId=@bandeja
	order by MENID desc

   
    declare @EstNombres varchar(200),@EstApellidos varchar(200),@EstId int
 


    IF(@bandeja>0)BEGIN
        SELECT  @EstNombres=isnull(E.EstNombres,''),
                @EstApellidos=isnull(e.EstApellidos,''),
                @EstId=isnull(EstId,0)
        FROM    MSN.Bandejaentrada 
                INNER JOIN Gargen.EstudianteJardin E ON EstId=BanEstudianteId
        WHERE   BanId=@bandeja and isnull(BanEstudianteId,0)>0
    END
    ELSE BEGIN
        
        SELECT @EstId=BanEstudianteId FROM MSN.MENSAJES INNER JOIN msn.bandejaentrada ON MENID=BanMsnId WHERE MENID=@ID

        IF(@EstId IS NOT NULL AND @EstId>0)BEGIN
            SELECT  @EstNombres=isnull(E.EstNombres,''),
                    @EstApellidos=isnull(e.EstApellidos,''),
                    @EstId=isnull(EstId,0)
            FROM    Gargen.EstudianteJardin E
            WHERE   EstId=@EstId
        END

    END
   
    
    if(@EstId IS NOT NULL AND @EstId>0) begin
        UPDATE  #TblMensaje
        SET     BanEstudianteId=@EstId,
                EstNombres=@EstNombres,
                EstApellidos=@EstApellidos
        FROM    #TblMensaje            
    end
    
    

    SELECT  *
    FROM    #TblMensaje
END

