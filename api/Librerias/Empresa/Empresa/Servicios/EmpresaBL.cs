using BaseDatos.Contexto;
using Empresa.Modelos;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using Trasversales.Modelo;
using Utilidades.Servicios;

namespace Empresa.Servicios
{


    public class EmpresaBL : EntityGenerics<Empresas>
    {


        private readonly Random _random = new Random();
        // Generates a random string with a given size.    
        string RandomString(int size, bool lowerCase = false)
        {
            var builder = new StringBuilder(size);

            // Unicode/ASCII Letters are divided into two blocks
            // (Letters 65–90 / 97–122):
            // The first group containing the uppercase letters and
            // the second group containing the lowercase.  

            // char is a single Unicode character  
            char offset = lowerCase ? 'a' : 'A';
            const int lettersOffset = 26; // A...Z or a..z: length=26  

            for (var i = 0; i < size; i++)
            {
                var @char = (char)_random.Next(offset, offset + lettersOffset);
                builder.Append(@char);
            }

            return lowerCase ? builder.ToString().ToLower() : builder.ToString();
        }

        public IEnumerable<EmpresaCustomDTO> Get(int id = 0)
        {
            ColegioContext objCnn = new ColegioContext();
            List<EmpresaCustomDTO> objresultado = new List<EmpresaCustomDTO>();

            if (id == 0)
            {
                var emp = (from e in objCnn.empresas select e).ToList();

                emp.ForEach(c =>
                {
                    var p = objCnn.personas.Where(C => C.PerTipoPerfil == 0 && C.PerIdEmpresa == c.EmpId).Single();
                    objresultado.Add(new EmpresaCustomDTO()
                    {
                        empresa = c,
                        persona = p
                    });
                });
            }
            else
            {
                var e = objCnn.empresas.Find(id);
                var p = objCnn.personas.Where(C => C.PerTipoPerfil == 0 && C.PerIdEmpresa == id).Single();

                objresultado.Add(new EmpresaCustomDTO()
                {
                    empresa = e,
                    persona = p
                });
            }


            return objresultado;
        }

        public Personas Save(Empresas modelo)
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();
            modelo.EmpEstado = 1;
            objCnn.empresas.Add(modelo);

            objCnn.SaveChanges();

            if (!string.IsNullOrEmpty(modelo.EmpLogo))
            {
                var adjunto = objCnn.adjuntos.Find(modelo.EmpLogo);
                adjunto.AdjIdEmpresa = modelo.EmpId;
                objCnn.Entry(adjunto).State = EntityState.Modified;
                objCnn.SaveChanges();
            }


            //se crea un usuario por defecto
            Personas objPersona = new Personas();
            objPersona.PerEstado = true;
            objPersona.PerNombres = modelo.EmpNombre;
            objPersona.PerApellidos = string.Empty;
            objPersona.PerEstado = true;
            objPersona.PerDocumento = modelo.EmpNit;
            objPersona.PerUsuario = modelo.EmpNit;
            objPersona.PerTipoPerfil = 1;

            if (string.IsNullOrEmpty(objPersona.PerClave))
            {
                objPersona.PerClave = RandomString(10);
            }

            objPersona.PerIdEmpresa = modelo.EmpId;
            objPersona.PerTipoPerfil = 1;

            EliminarAdjuntos_huerfanos(modelo.EmpNombre);
            return objPersona;
        }

        public ResponseDTO AddCustom(EmpresaCustomDTO modelo)
        {
            ColegioContext objCnn = new ColegioContext();
            ResponseDTO obj = new ResponseDTO();

            //se valida que no exista el documento
            var documento = objCnn.empresas.Count(d => d.EmpNit == modelo.empresa.EmpNit);

            if (documento > 0)
            {
                obj.codigo = -1;
                obj.respuesta = "EL nit ya se encuentra en el sistema";
                return obj;
            }


            modelo.empresa = base.Add(modelo.empresa);

            objCnn.SaveChanges();

            if (!string.IsNullOrEmpty(modelo.empresa.EmpLogo))
            {
                int id = Convert.ToInt32(modelo.empresa.EmpLogo);
                var adjunto = objCnn.adjuntos.Where(c => c.AjdId == id).FirstOrDefault();

                if (adjunto != null)
                {
                    adjunto.AdjIdEmpresa = modelo.empresa.EmpId;
                    objCnn.Entry(adjunto).State = EntityState.Modified;
                    objCnn.SaveChanges();
                }

            }

            modelo.persona.PerDocumento = modelo.empresa.EmpNit;
            modelo.persona.PerNombres = modelo.empresa.EmpNombre;
            modelo.persona.PerIdEmpresa = modelo.empresa.EmpId;
            modelo.persona.PerUsuario = modelo.empresa.EmpNit;

            objCnn.personas.Add(modelo.persona);

            objCnn.SaveChanges();


            EliminarAdjuntos_huerfanos(modelo.empresa.EmpNombre);

            obj.codigo = modelo.empresa.EmpId;
            obj.respuesta = modelo.persona.PerId.ToString();


            objCnn.grupo_envio_autorizado_all.Add(new GruposEnvioAutorizadoAll()
            {

                GrEnAuAllEmp = modelo.empresa.EmpId,
                GeEnAuAllTemporada = 1,
                GrEnAuAllPersonaId = modelo.persona.PerId
            }); ;

            objCnn.SaveChanges();

            return obj;
        }


        public bool UpdateCustom(EmpresaCustomDTO modelo)
        {
            ColegioContext objCnn = new ColegioContext();

            modelo.empresa.EmpEstado = 1;
            base.Update(modelo.empresa);

            modelo.persona.PerEstado = true;
            modelo.persona.PerDocumento = modelo.empresa.EmpNit;
            modelo.persona.PerNombres = modelo.empresa.EmpNombre;
            modelo.persona.PerIdEmpresa = modelo.empresa.EmpId;
            modelo.persona.PerUsuario = modelo.empresa.EmpNit;
            modelo.persona.PerDireccion = modelo.empresa.EmpDireccion;

            objCnn.Entry(modelo.persona).State = EntityState.Modified;


            if (!string.IsNullOrEmpty(modelo.empresa.EmpLogo))
            {
                int id = Convert.ToInt32(modelo.empresa.EmpLogo);
                var adjunto = objCnn.adjuntos.Where(c => c.AjdId == id).FirstOrDefault();

                if (adjunto != null)
                {
                    adjunto.AdjIdEmpresa = modelo.empresa.EmpId;
                    objCnn.Entry(adjunto).State = EntityState.Modified;
                    objCnn.SaveChanges();
                }

            }

            objCnn.SaveChanges();

            EliminarAdjuntos_huerfanos(modelo.empresa.EmpNombre);

            return true;
        }

        void EliminarAdjuntos_huerfanos(string nombre_embresa)
        {
            ColegioContext objCnn = new ColegioContext();

            var adjuntos = objCnn.adjuntos.Where(c => c.AdjIdEmpresa == -1 && c.AdjIdRuta.Contains(nombre_embresa));

            adjuntos.ToList().ForEach(c =>
            {

                objCnn.Entry(c).State = EntityState.Deleted;
            });

            objCnn.SaveChanges();
        }
    }
}
