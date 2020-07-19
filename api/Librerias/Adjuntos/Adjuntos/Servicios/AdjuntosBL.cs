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

        public IEnumerable<Trasversales.Modelo.Adjuntos> Get(int id_usuario = 0, List<int> id_adjunto = null, int id=0)
        {
            ColegioContext objCnn = new ColegioContext();

            if (id_usuario != 0 && id_adjunto==null)
            {
                return objCnn.adjuntos.Where(c => c.AdjIdUsuario == id_usuario);
            }
            else if (id_adjunto != null)
            {
                return objCnn.adjuntos.Where(c => id_adjunto.Contains(c.AjdId));
            }
            else
            {
                return objCnn.adjuntos.Where(c => c.AjdId == id);
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
