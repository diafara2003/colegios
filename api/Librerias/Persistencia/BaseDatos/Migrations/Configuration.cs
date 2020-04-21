namespace BaseDatos.Migrations
{
    using Contexto;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;
    using Trasversales.Modelo;

    internal sealed class Configuration : DbMigrationsConfiguration<BaseDatos.Contexto.ColegioContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ColegioContext context)
        {

           
        }
    }
}
