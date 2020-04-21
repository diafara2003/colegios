using BaseDatos.Contexto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using Trasversales.Modelo;
using Menu.Modelos;

namespace Menu.Servicios
{
    public class MenuBI
    {
        public IEnumerable<SeccionCustom> Get()
        {
            IEnumerable<SeccionCustom> objSeccion = new List<SeccionCustom>();
            ColegioContext objCnn = new ColegioContext();

            objSeccion = (from data in objCnn.seccion
                          select new SeccionCustom()
                          {
                              SeccionId = data.SeccionId,
                              SecDescripcion = data.SecDescripcion,
                              SecIcono = data.SecIcono,
                              opcion = (from query in objCnn.opcion where query.OpSeccionId == data.SeccionId select query)
                          });
            return objSeccion;
        }
    }
}
