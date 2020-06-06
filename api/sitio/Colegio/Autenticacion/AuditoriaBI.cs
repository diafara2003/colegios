
using BaseDatos.Contexto;

namespace Autenticacion
{
    public class AuditoriaBI
    {
        public void Save(int id_usuario)
        {

            ColegioContext objCnn = new ColegioContext();


            objCnn.login_auditoria.Add(new Trasversales.Modelo.LoginAuditoria()
            {
                LogPersonaId = id_usuario,
                LogId = 0,
                LogFecha = System.DateTime.Now
            });

            objCnn.SaveChanges();


        }
    }
}
