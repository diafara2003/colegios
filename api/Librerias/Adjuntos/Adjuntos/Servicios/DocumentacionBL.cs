﻿
using Adjuntos.Modelos;
using BaseDatos.Contexto;
using Documentacion.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using BaseDatos.Modelos;
using System.Data;

namespace Documentacion.Servicios
{
    public class DocumentacionBL
    {
        public IEnumerable<DocumentacionDTO> GetDocumentacion(int empresa)
        {
            ColegioContext objCnn = new ColegioContext();

            return (from d in objCnn.documentacion_colegio
                    where d.DocIdEmpresa == empresa
                    select new DocumentacionDTO
                    {
                        id = d.DocId,
                        nombre = d.DocTexto
                    });
        }

        public DocumentacionDTO AddDocumentacionColegio(int empresa, string texto)
        {
            ColegioContext objCnn = new ColegioContext();
            var nuevoRegistro = new Trasversales.Modelo.DocumentosColegio()
            {
                DocId = 0,
                DocTexto = texto,
                DocIdEmpresa = empresa
            };
            objCnn.documentacion_colegio.Add(nuevoRegistro);

            objCnn.SaveChanges();

            return new DocumentacionDTO()
            {
                id = nuevoRegistro.DocId,
                nombre = nuevoRegistro.DocTexto,
            };

        }

        public void EliminarDocumentacion(int id)
        {
            ColegioContext objCnn = new ColegioContext();

            var documentacion = objCnn.documentacion_colegio.Find(id);
            if (documentacion != null)
            {
                objCnn.Entry(documentacion).State = System.Data.Entity.EntityState.Deleted;

                objCnn.SaveChanges();
            }

        }

        public List<DocumentosPendientesEstudianteDTO> GetDocumentosEstudiantes(int empresa)
        {
            ColegioContext objCnn = new ColegioContext();
            List<DocumentosPendientesEstudianteDTO> objResponse = new List<DocumentosPendientesEstudianteDTO>();


            ProcedureDTO ProcedureDTO = new ProcedureDTO();

            ProcedureDTO.commandText = "DocRequeridoColegio";
            ProcedureDTO.parametros.Add("emp", empresa);


            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);

            return (from r in result.AsEnumerable()
                    select new DocumentosPendientesEstudianteDTO
                    {
                        nombreEstudiante = (string)r["EstNombres"],
                        nombreGuupo= (string)r["GrNombre"],
                        totalDocumentosSubidos= (int)r["totDocSubidos"],
                        totalDocumentos = (int)r["totDoc"],
                        codigo = (int)r["GruEstEstudiante"],
                    }).ToList();
        }


        public List<DocumentosPendientesEstudianteDTO> GetDocumentosHijos(int empresa,int acudiente)
        {
            ColegioContext objCnn = new ColegioContext();
            List<DocumentosPendientesEstudianteDTO> objResponse = new List<DocumentosPendientesEstudianteDTO>();


            ProcedureDTO ProcedureDTO = new ProcedureDTO();

            ProcedureDTO.commandText = "EstadoDocHijos";
            ProcedureDTO.parametros.Add("emp", empresa);
            ProcedureDTO.parametros.Add("acudiente", acudiente);


            DataTable result = objCnn.ExecuteStoreQuery(ProcedureDTO);

            return (from r in result.AsEnumerable()
                    select new DocumentosPendientesEstudianteDTO
                    {
                        nombreEstudiante = (string)r["EstNombres"],
                        nombreGuupo = (string)r["GrNombre"],
                        totalDocumentosSubidos = (int)r["totDocSubidos"],
                        totalDocumentos = (int)r["totDoc"],
                        codigo = (int)r["GruEstEstudiante"],
                    }).ToList();
        }

    }
}