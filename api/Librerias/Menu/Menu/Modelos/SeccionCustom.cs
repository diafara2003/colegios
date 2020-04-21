using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Menu.Modelos
{
    public class SeccionCustom : Seccion
    {
        public IEnumerable<Opcion> opcion { get; set; }
    }
}
