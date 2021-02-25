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

        public Empresas GetEmpresa(int id)
        {
            return new ColegioContext().empresas.Find(id);
        }
        public List<SeccionCustom> Get(int empresa, int idPersona, int perfil)
        {
            List<SeccionCustom> objSeccion = new List<SeccionCustom>();
            ColegioContext objCnn = new ColegioContext();

            //menus por perfil
            objSeccion = (from data in objCnn.seccion
                          join _a in objCnn.accesos on data.SeccionId equals _a.Opcion
                          where _a.EmpresaID == empresa
                          && _a.PerfilID == perfil
                          select new SeccionCustom()
                          {
                              SeccionId = data.SeccionId,
                              SecDescripcion = data.SecDescripcion,
                              SecIcono = data.SecIcono,
                              SecRuta = data.SecRuta,
                              opcion = (from query in objCnn.opcion where query.OpSeccionId == data.SeccionId select query)
                          }).ToList();

            //menus por id de menu
            (from data in objCnn.seccion
             join _a in objCnn.accesos on data.SeccionId equals _a.Opcion
             where _a.EmpresaID == empresa
             && _a.PersonaID == idPersona
             select new SeccionCustom()
             {
                 SeccionId = data.SeccionId,
                 SecDescripcion = data.SecDescripcion,
                 SecIcono = data.SecIcono,
                 SecRuta = data.SecRuta,
                 opcion = (from query in objCnn.opcion where query.OpSeccionId == data.SeccionId select query)
             }).ToList().ForEach(c =>
             {

                 if (objSeccion.Find(o => o.SecDescripcion.Equals(c.SecDescripcion)) == null)
                     objSeccion.Add(c);
             });

            SeccionCustom op_mensajeria = (from data in objCnn.seccion
                                           where data.SecDescripcion.Contains("mensajería")
                                           select new SeccionCustom()
                                           {
                                               SeccionId = data.SeccionId,
                                               SecDescripcion = data.SecDescripcion,
                                               SecIcono = data.SecIcono,
                                               SecRuta = data.SecRuta,
                                               opcion = (from query in objCnn.opcion where query.OpSeccionId == data.SeccionId select query)
                                           }).FirstOrDefault();


            objSeccion.Add(op_mensajeria);


            
            SeccionCustom op_grupos = (from data in objCnn.seccion
                                           where data.SecDescripcion.Equals("Grupos")
                                           select new SeccionCustom()
                                           {
                                               SeccionId = data.SeccionId,
                                               SecDescripcion = data.SecDescripcion,
                                               SecIcono = data.SecIcono,
                                               SecRuta = data.SecRuta,
                                               opcion = (from query in objCnn.opcion where query.OpSeccionId == data.SeccionId select query)
                                           }).FirstOrDefault();


            objSeccion.Add(op_grupos);

            SeccionCustom op_profesores = (from data in objCnn.seccion
                                       where data.SecDescripcion.Equals("Profesores")
                                       select new SeccionCustom()
                                       {
                                           SeccionId = data.SeccionId,
                                           SecDescripcion = data.SecDescripcion,
                                           SecIcono = data.SecIcono,
                                           SecRuta = data.SecRuta,
                                           opcion = (from query in objCnn.opcion where query.OpSeccionId == data.SeccionId select query)
                                       }).FirstOrDefault();


            objSeccion.Add(op_profesores);


            SeccionCustom op_Estudiantes = (from data in objCnn.seccion
                                           where data.SecDescripcion.Equals("Estudiantes")
                                           select new SeccionCustom()
                                           {
                                               SeccionId = data.SeccionId,
                                               SecDescripcion = data.SecDescripcion,
                                               SecIcono = data.SecIcono,
                                               SecRuta = data.SecRuta,
                                               opcion = (from query in objCnn.opcion where query.OpSeccionId == data.SeccionId select query)
                                           }).FirstOrDefault();


            objSeccion.Add(op_Estudiantes);
            return objSeccion;
        }
    }
}
