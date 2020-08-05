﻿using BaseDatos.Contexto;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Trasversales.Modelo;
using System.Data;
using Persona.Modelos;

namespace Persona.Servicios
{
    public class PersonasBI
    {

        public IEnumerable<UsuarioPerfil> GetPerfi()
        {

            ColegioContext objCnn = new ColegioContext();

            return objCnn.usuario_perfi;
        }

        public IEnumerable<Personas> Get(int id = 0)
        {
            IEnumerable<Personas> objSeccion = new List<Personas>();
            ColegioContext objCnn = new ColegioContext();

            if (id == 0)
                objSeccion = (from data in objCnn.personas select data).OrderBy(c => c.PerApellidos);
            else
                objSeccion = (from data in objCnn.personas where data.PerId == id select data).OrderBy(c => c.PerApellidos);
            return objSeccion;
        }

        public IEnumerable<Personas> Get(string filter = "", int tipo = 0)
        {
            IEnumerable<Personas> objSeccion = new List<Personas>();
            ColegioContext objCnn = new ColegioContext();

            if (filter == string.Empty)
                objSeccion = (from data in objCnn.personas
                              where data.PerEstado && data.PerTipoPerfil == tipo
                              select data).OrderBy(c => c.PerApellidos);
            else
                objSeccion = (from data in objCnn.personas
                              where data.PerEstado
                              && data.PerTipoPerfil == tipo
                                && data.PerNombres.Contains(filter) || data.PerApellidos.Contains(filter)
                              select data).OrderBy(c => c.PerApellidos); ;
            return objSeccion;
        }


        public IEnumerable<Personas> GetEstudiantesSinAsignar(int curso = 0)
        {
            IEnumerable<Personas> objSeccion = new List<Personas>();
            ColegioContext objCnn = new ColegioContext();

            if (curso == 0)
            {
                objSeccion = (from estudiantes in objCnn.personas

                              join cursos in objCnn.curso_estudiantes on estudiantes.PerId equals cursos.CurEstEstudianteId into CursoEstudiante
                              from cursoest in CursoEstudiante.DefaultIfEmpty()

                              where estudiantes.PerTipoPerfil == 2 && cursoest.CurEstId == null
                              select estudiantes).OrderBy(c => c.PerApellidos);
            }
            else
            {
                objSeccion = (from curest in objCnn.curso_estudiantes
                              join estudiantes in objCnn.personas on curest.CurEstEstudianteId equals estudiantes.PerId
                              where estudiantes.PerTipoPerfil == 2 && curest.CurEstCursoId == curso
                              select estudiantes).OrderBy(c => c.PerApellidos);
            }

            return objSeccion;
        }



        public ResponseDTO Remove(int id)
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            try
            {
                Personas obj = objCnn.personas.Find(id);



                objCnn.Entry(obj).State = EntityState.Deleted;


                objCnn.curso_estudiantes.Where(c => c.CurEstEstudianteId == id).ToList().ForEach(d => objCnn.Entry(d).State = EntityState.Deleted);
                Estudiantes objestudiante = objCnn.estudiantes.Where(c => c.EstIdPersona == id).FirstOrDefault();

                if (objestudiante!=null)
                {
                    objCnn.Entry(objestudiante).State = EntityState.Deleted;
                }

                Profesores objProfesor = objCnn.prefesores.Where(c => c.ProfIdPersona == id).FirstOrDefault();

                if (objProfesor != null)
                {
                    objCnn.Entry(objProfesor).State = EntityState.Deleted;
                }


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


        public T Select<T>(int id) where T : class
        {
            return new ColegioContext().GetEntity<T>(id);
        }


        public Personas GetUser(string documento, string password)
        {
            ColegioContext objCnn = new ColegioContext();
            Personas _persona = new Personas();
            if (string.IsNullOrEmpty(password))
            {
                _persona = (from data in objCnn.personas
                            where data.PerDocumento == documento
                            select data).FirstOrDefault();
            }
            else
            {

                _persona = (from data in objCnn.personas
                            where data.PerDocumento == documento && data.PerClave == password
                            select data).FirstOrDefault();
            }



            return _persona;

        }

        public Estudiantes GetdatoEstudiante(int id_estudiante)
        {
            ColegioContext objCnn = new ColegioContext();

            Estudiantes _result = objCnn.estudiantes.Where(c => c.EstIdPersona == id_estudiante).FirstOrDefault();
            if (_result == null)
            {
                _result = new Estudiantes();
            }

            return _result;
        }

        public IEnumerable<GradoEstudianteDTO> GetCursosEstudiante(int grado)
        {
            IEnumerable<GradoEstudianteDTO> obj = new List<GradoEstudianteDTO>();
            ColegioContext objCnn = new ColegioContext();

            if (grado == -1)
            {
                obj = (from p in objCnn.personas
                       join c_e in objCnn.curso_estudiantes on p.PerId equals c_e.CurEstEstudianteId
                       join c in objCnn.cursos on c_e.CurEstCursoId equals c.CurId
                       join g in objCnn.grados on c.CurGrado equals g.GraId
                       orderby g.GraOrden,c.CurCodigo
                       select new GradoEstudianteDTO
                       {
                           estudiante = p,
                           grado = g,
                           curso = c
                       });

            }
            else
            {
                obj = (from p in objCnn.personas
                       join c_e in objCnn.curso_estudiantes on p.PerId equals c_e.CurEstEstudianteId
                       join c in objCnn.cursos on c_e.CurEstCursoId equals c.CurId
                       join g in objCnn.grados on c.CurGrado equals g.GraId
                       where g.GraId == grado
                       select new GradoEstudianteDTO
                       {
                           estudiante = p,
                           grado = g,
                           curso = c
                       });

            }


            return obj;
        }

        public Profesores GetdatoProfesor(int id_profesor)
        {
            ColegioContext objCnn = new ColegioContext();

            Profesores _result = objCnn.prefesores.Where(c => c.ProfIdPersona == id_profesor).FirstOrDefault();

            if (_result == null) _result = new Profesores();

            return _result;
        }

        public T Save<T>(T modelo) where T : class
        {
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(modelo).State = EntityState.Added;

            objCnn.SaveChanges();

            return modelo;
        }
        public ResponseDTO UpdateEnvio<T>(T modelo) where T : class
        {
            ResponseDTO objresponse = new ResponseDTO();
            ColegioContext objCnn = new ColegioContext();

            objCnn.Entry(modelo).State = EntityState.Modified;

            objCnn.SaveChanges();

            objresponse.codigo = 1;
            objresponse.respuesta = "";
            return objresponse;
        }
    }
}
