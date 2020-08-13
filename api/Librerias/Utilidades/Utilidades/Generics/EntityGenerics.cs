
using BaseDatos.Contexto;
using System.Collections.Generic;
using System.Data.Entity;

namespace Utilidades.Servicios
{
    public class EntityGenerics<T> where T : class
    {
        public T SelectById(int id)
        {
            return new ColegioContext().GetEntity<T>(id);
        }

        public IEnumerable<T> SelectAll()
        {
            return new ColegioContext().GetAllEntity<T>();
        }

        public bool Update(T modelo)
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(modelo).State = EntityState.Modified;

            objCnn.SaveChanges();
            return true;
        }

        public T Add(T modelo)
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(modelo).State = EntityState.Added;

            objCnn.SaveChanges();
            return modelo;
        }

        public bool Delete(T modelo)
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(modelo).State = EntityState.Deleted;

            objCnn.SaveChanges();
            return true;
        }

        public bool Delete(int id)
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(SelectById(id)).State = EntityState.Deleted;

            objCnn.SaveChanges();
            return true;
        }
    }
}
