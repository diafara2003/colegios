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
    public class GruposGardenBL<T>: EntityGenerics<T> where T : class
    {
        public IEnumerable<ConsultaGruposDTO> Get(int empresa, int temporada,string id="")
        {
            ColegioContext objCnn = new ColegioContext();
            Dictionary<string, object> objParametros = new Dictionary<string, object>();


            objParametros.Add("empresa", empresa);
            objParametros.Add("temporada", temporada);
            objParametros.Add("id", id);

            DataTable result = objCnn.ExecuteStoreQuery(new BaseDatos.Modelos.ProcedureDTO()
            {
                commandText = "Gargen.GetGrupos",
                parametros = objParametros
            });


            return (from data in result.AsEnumerable()
                    select new ConsultaGruposDTO()
                    {
                        Estudiantes = (int)data["Estudiantes"],
                        IdGrupo = (int)data["IdGrupo"],
                        Nombre = (string)data["Nombre"],
                        Profesores = (string)data["Profesores"],
                    });

        }


        
    }
}
