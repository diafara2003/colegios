
using BaseDatos.Contexto;
using Documentacion.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;

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
                        id = d.DocIdEmpresa,
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

            objCnn.Entry(documentacion).State = System.Data.Entity.EntityState.Deleted;

            objCnn.SaveChanges();

        }

    }
}
