using BaseDatos.Contexto;
using Materia.Modelos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Trasversales.Modelo;

namespace Materia.Servicios
{
    public class MateriaBL
    {
        public IEnumerable<MateriasCustom> Get(int empresa = 0, int grado = 0, int id = 0)
        {
            IEnumerable<MateriasCustom> objSeccion = new List<MateriasCustom>();
            ColegioContext objCnn = new ColegioContext();

            if (grado != 0)
            {
                objSeccion = (from data in objCnn.materias
                              join area in objCnn.areas_materias on data.MatAreaId equals area.ArMaId
                              where data.MatGradoId == grado && data.MatEmpId == empresa
                              select new MateriasCustom()
                              {
                                  nombreArea = area.ArMaDescripcion,
                                  MatAreaId = data.MatAreaId,
                                  MatEmpId = data.MatEmpId,
                                  MatCodigo = data.MatCodigo,
                                  MatDescripcion = data.MatDescripcion,
                                  MatElectiva = data.MatElectiva,
                                  MatEstado = data.MatEstado,
                                  MatGradoId = data.MatGradoId,
                                  MatID = data.MatID,
                                  MatTemporadaId = data.MatTemporadaId
                              });
            }
            else if (id != 0)
            {
                objSeccion = (from data in objCnn.materias
                              join area in objCnn.areas_materias on data.MatAreaId equals area.ArMaId
                              where data.MatID == id
                              select new MateriasCustom()
                              {
                                  nombreArea = area.ArMaDescripcion,
                                  MatAreaId = data.MatAreaId,
                                  MatEmpId = data.MatEmpId,
                                  MatCodigo = data.MatCodigo,
                                  MatDescripcion = data.MatDescripcion,
                                  MatElectiva = data.MatElectiva,
                                  MatEstado = data.MatEstado,
                                  MatGradoId = data.MatGradoId,
                                  MatID = data.MatID,
                                  MatTemporadaId = data.MatTemporadaId
                              });
            }
            else
            {
                objSeccion = (
                  from data in objCnn.materias
                  join area in objCnn.areas_materias on data.MatAreaId equals area.ArMaId
                  where data.MatEmpId == empresa
                  select new MateriasCustom()
                  {
                      nombreArea = area.ArMaDescripcion,
                      MatAreaId = data.MatAreaId,
                      MatEmpId = data.MatEmpId,
                      MatCodigo = data.MatCodigo,
                      MatDescripcion = data.MatDescripcion,
                      MatElectiva = data.MatElectiva,
                      MatEstado = data.MatEstado,
                      MatGradoId = data.MatGradoId,
                      MatID = data.MatID,
                      MatTemporadaId = data.MatTemporadaId
                  });
            }

            return objSeccion;
        }


        public ResponseMateriaCustom Save(Materias request)
        {

            ColegioContext objCnn = new ColegioContext();
            ResponseMateriaCustom objInserted = new ResponseMateriaCustom();
            try
            {
                objCnn.materias.Add(request);

                objCnn.SaveChanges();

                objInserted.materia = this.Get(id: request.MatID).FirstOrDefault();

                objInserted.resultado.codigo = 1;
                objInserted.resultado.respuesta = "";
            }
            catch (Exception e)
            {
                objInserted.resultado.codigo = -1;
                objInserted.resultado.respuesta = e.Message;
            }
            return objInserted;
        }

        public ResponseDTO Update(Materias request)
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {

                objCnn.Entry(request).State = EntityState.Modified;

                objCnn.SaveChanges();

                objresponse.codigo = 1;
                objresponse.respuesta = "";
            }
            catch (Exception e)
            {

                objresponse.codigo = -1;
                objresponse.respuesta = e.Message;
            }
            return objresponse;
        }

        public ResponseDTO Remove(int id)
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
                Trasversales.Modelo.Materias obj = objCnn.materias.Find(id);

                objCnn.Entry(obj).State = EntityState.Deleted;

                objCnn.SaveChanges();

                objresponse.codigo = 1;
                objresponse.respuesta = "";
            }
            catch (Exception e)
            {

                objresponse.codigo = -1;
                objresponse.respuesta = e.Message;
            }
            return objresponse;
        }


    }
}
