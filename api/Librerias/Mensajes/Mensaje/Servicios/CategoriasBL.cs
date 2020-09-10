using BaseDatos.Contexto;
using Mensaje.Modelos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Mensaje.Servicios
{
    public class CategoriasBL
    {

        public IEnumerable<Categorias> Get(int usuario)
        {
            ColegioContext objCnn = new ColegioContext();
            int _perfil = objCnn.personas
                .Where(C => C.PerId == usuario)
                .Select(c => c.PerTipoPerfil).FirstOrDefault();

            return (from c in objCnn.categorias
                    join perfil in objCnn.categorias_perfil on c.CatId equals perfil.CatPerCategoria
                    where perfil.CatPerPerfil == _perfil
                    select c
                    );


        }

        public IEnumerable<TipoBandejaDTO> GetXUsuario(int usuario)
        {
            IEnumerable<TipoBandejaDTO> objResultado = new List<TipoBandejaDTO>();
            ColegioContext objCnn = new ColegioContext();
            BaseDatos.Modelos.ProcedureDTO ProcedureDTO = new BaseDatos.Modelos.ProcedureDTO();

            ProcedureDTO.commandText = "msn.CategoriasMensajesRecibido";
            ProcedureDTO.parametros.Add("usuario", usuario);

            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);

            objResultado = (from query in result.AsEnumerable()
                            select new TipoBandejaDTO()
                            {
                                id = (int)query["MenCategoriaId"],
                                Count = (int)query["CtaNoLeido"],
                                Descripcion = (string)query["CatDescripcion"],
                                Color = (string)query["CatColor"],
                            });

            return objResultado;
        }
    }
}
