using Empresa.Modelos;
using Empresa.Servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Trasversales.Modelo;

namespace Colegio.Controllers
{
    public class EmpresaController : ApiController
    {
        // GET: api/Empresa
        public IEnumerable<EmpresaCustomDTO> Get()
        {
            return new EmpresaBL().Get();
        }

        // GET: api/Empresa/5
        public Empresas Get(int id)
        {
            return new EmpresaBL().SelectById(id);
        }

        // POST: api/Empresa
        public ResponseDTO Post(EmpresaCustomDTO request)
        {
            return new EmpresaBL().AddCustom(request);
            
        }

        // PUT: api/Empresa/5
        public bool Put(EmpresaCustomDTO request)
        {
            return new EmpresaBL().UpdateCustom(request);
        }

        // DELETE: api/Empresa/5
        public bool Delete(int id)
        {
            return new EmpresaBL().Delete(id);
        }
    }
}
