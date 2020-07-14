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
    public class GruposBL
    {

       public IEnumerable<GruposEnvioColores> GetEnvioColores(int empresa)
        {
            ColegioContext objCnn = new ColegioContext();

            return objCnn.grupo_envio_colores.Where(c => c.GrEnColorEmp == empresa);
        }

        public bool UpdateEnvioColores(GruposEnvioColores modelo)
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(modelo).State = EntityState.Modified;

            objCnn.SaveChanges();
            return true;
        }
    }
}
