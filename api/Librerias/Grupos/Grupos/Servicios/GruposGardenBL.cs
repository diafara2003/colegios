using BaseDatos.Contexto;
using GruposGarden.Modelos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;
using Utilidades.Servicios;

namespace Grupo.Servicios
{
    public class GruposGardenBL<T> : EntityGenerics<T> where T : class
    {
        public IEnumerable<ConsultaGruposDTO> Get(int empresa, int temporada, string id = "")
        {
            ColegioContext objCnn = new ColegioContext();
            Dictionary<string, object> objParametros = new Dictionary<string, object>();


         

            List<ConsultaGruposDTO> objresult = (from data in objCnn.grupos
                                                 where data.GrEmpresa==empresa
                                                 select new ConsultaGruposDTO()
                                                 {
                                                     Estudiantes = 0,
                                                     IdGrupo = data.GrId,
                                                     Nombre = data.GrNombre
                                                 }).ToList();


            

            objresult.ForEach(c =>
            {

                c.Estudiantes = objCnn.grupos_estudiantes.Count(e => e.GruEstGrupo == c.IdGrupo);


                c.profesores = (from p in objCnn.personas
                                join gp in objCnn.grupos_profesor on p.PerId equals gp.GruProProfesor
                                where gp.GruProGrupo == c.IdGrupo
                                select new ConsultaProfesorDTO
                                {
                                    id = p.PerId,
                                    nombre = p.PerNombres,
                                    apellido = p.PerApellidos == null ? string.Empty : p.PerApellidos,
                                    celular = p.PerTelefono == null ? string.Empty : p.PerTelefono,
                                    email = p.PerEmail == null ? string.Empty : p.PerEmail,
                                });
            });

            return objresult;

        }



    }
}
