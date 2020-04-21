using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace BaseDatos.Contexto
{
    public class SchoolDBInitializer : CreateDatabaseIfNotExists<ColegioContext>
    {
        protected override void Seed(ColegioContext context)
        {

            IList<Seccion> defaultStandards = new List<Seccion>();

            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Mensajeria",
                SecIcono = ""
            });
            defaultStandards.Add(new Seccion()
            {
                SecDescripcion = "Materias",
                SecIcono = ""
            });

            context.seccion.AddRange(defaultStandards);

            base.Seed(context);
        }
    }
}
