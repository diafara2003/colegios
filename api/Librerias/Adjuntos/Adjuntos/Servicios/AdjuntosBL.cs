using BaseDatos.Contexto;
using System.Linq;
using System;
using System.Collections;
using System.Collections.Generic;

namespace Adjuntos.Servicios
{
    public class AdjuntosBL
    {
        public Trasversales.Modelo.Adjuntos Save(Trasversales.Modelo.Adjuntos _modelo)
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.adjuntos.Add(_modelo);

            objCnn.SaveChanges();

            return _modelo;
        }

        public IEnumerable<Trasversales.Modelo.Adjuntos> Get(int id_usuario = 0, int id_adjunto = 0)
        {
            ColegioContext objCnn = new ColegioContext();

            if (id_usuario != 0)
            {
                return objCnn.adjuntos.Where(c => c.AdjIdUsuario == id_usuario);
            }
            else
            {
                return objCnn.adjuntos.Where(c => c.AjdId == id_adjunto);
            }
        }

        public bool Delete(int id)
        {
            ColegioContext objCnn = new ColegioContext();


            objCnn.adjuntos.Remove(objCnn.adjuntos.Find(id));

            objCnn.SaveChanges();

            return true;
        }

    }
}
