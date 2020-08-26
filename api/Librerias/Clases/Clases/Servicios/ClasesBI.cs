
using BaseDatos.Contexto;
using Clase.Modelos;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using BaseDatos.Modelos;
using System;
using Clase.Modelos;
using System.Data.Entity;

namespace Clases.Servicios
{
    public class ClasesBI
    {

        public void AsignarMatariasClases(int empresa) {

            //AsignarMateriasClase
            ColegioContext objCnn = new ColegioContext();
            ProcedureDTO ProcedureDTO = new ProcedureDTO();

            ProcedureDTO.commandText = "AsignarMateriasClase";
            ProcedureDTO.parametros.Add("empresa", empresa);

            
            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);
        }

        public IEnumerable<AsignarClases> GetMateriasGrado(int empresa, int curso = 0)
        {
            IEnumerable<AsignarClases> objlst = new List<AsignarClases>();

            AsignarMatariasClases(empresa);
            
            ColegioContext objCnn = new ColegioContext();
            ProcedureDTO ProcedureDTO = new ProcedureDTO();

            ProcedureDTO.commandText = "[ConsultarClasesMateria]";
            ProcedureDTO.parametros.Add("empresa", empresa);
            ProcedureDTO.parametros.Add("cursoid", curso);

            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);


            objlst = (from data in result.AsEnumerable()
                      select new AsignarClases()
                      {
                          Claid = data["Claid"] is DBNull ? 0 : (int)data["Claid"],
                          MatDescripcion = (string)data["MatDescripcion"],
                          ClaCodigo = data["ClaCodigo"] is DBNull ? "" : (string)data["ClaCodigo"],
                          MatID = (int)data["MatID"],
                          ClaProfesor = data["PerId"] is DBNull ? 0 : (int)data["PerId"],
                          NombreProfesor = string.Format("{0}{1}",
                          (data["PerNombres"] is DBNull ? "" : (string)data["PerNombres"]),
                          (data["PerApellidos"] is DBNull ? "" : " " + (string)data["PerApellidos"])
                          ),
                          ClaSalonId = data["SalId"] is DBNull ? 0 : (int)data["SalId"],
                          NombreSalon = data["SalDescripcion"] is DBNull ? "" : (string)data["SalDescripcion"],
                      });

            return objlst;
        }

        public AisgnarMateriaClaseCustom Save(Trasversales.Modelo.Clases request)
        {

            ColegioContext objCnn = new ColegioContext();
            AisgnarMateriaClaseCustom objresultado = new AisgnarMateriaClaseCustom();

            try
            {
                if (request.ClaSalonId==0)
                {
                    request.ClaSalonId = null;
                }
                if (request.ClaProfesor == 0)
                {
                    request.ClaProfesor = null;
                }

                if (request.Claid == 0)
                {
                    objCnn.clases.Add(request);

                    objCnn.SaveChanges();                    
                }
                else {
                    objCnn.Entry(request).State = EntityState.Modified;

                    objCnn.SaveChanges();
                }
                objresultado.clases = this.GetMateriasGrado(request.ClaEmpId,request.ClaCursoId).Where(g=>g.Claid==request.Claid).FirstOrDefault();

                objresultado.response.codigo = 1;
                objresultado.response.respuesta = "";
            }
            catch (Exception e)
            {
                objresultado.response.codigo = -1;
                objresultado.response.respuesta = e.Message;
            }

            return objresultado;
        }
    }
}
