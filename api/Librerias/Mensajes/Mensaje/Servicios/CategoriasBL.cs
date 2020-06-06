using BaseDatos.Contexto;
using System;
using System.Collections.Generic;
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
    }
}
