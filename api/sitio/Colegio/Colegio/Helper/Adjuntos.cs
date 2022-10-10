

using Colegio.Controllers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Web;

namespace Colegio.Helper
{
    public class Adjuntos
    {
        public string PostFile(HttpRequest _request)
        {
            var httpRequest = _request;

            var postedFile = httpRequest.Files[0];

            string root = HttpContext.Current.Server.MapPath("~/App_Data/uploads");

            var filePath = root + postedFile.FileName;
            postedFile.SaveAs(filePath);
            
            return filePath;
        }


        public List<AdjuntoDTO> save_file(string nombre_empresa)
        {
            HttpResponseMessage result = null;
            var httpRequest = HttpContext.Current.Request;
            List<AdjuntoDTO> savedFilePath = new List<AdjuntoDTO>();

            string rootPath = HttpContext.Current.Server.MapPath("~/UploadedFiles/" + nombre_empresa + "/");

            if (!Directory.Exists(rootPath))
            {
                Directory.CreateDirectory(rootPath);
            }

            if (httpRequest.Files.Count > 0)
            {

                foreach (string file in httpRequest.Files)
                {
                    var postedFile = httpRequest.Files[file];
                    string newFileName = Guid.NewGuid() + Path.GetExtension(postedFile.FileName);
                    var filePath = rootPath + newFileName;
                    postedFile.SaveAs(filePath);
                    savedFilePath.Add(new AdjuntoDTO()
                    {
                        nombre = postedFile.FileName,
                        ruta = filePath
                    });
                }
            }


            return savedFilePath;
        }

    }
}