using Colegio.Helper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace Colegio.Controllers
{
    [RoutePrefix("Excel")]
    public class UploadController : ApiController
    {
        [AllowAnonymous]
        [Route("ConvertirExcelToJson")]
        [HttpPost]
        public HttpResponseMessage ConvertirExcelToJson()
        {
            var Elimina = "1";
            
            try
            {
                DataTable TableExcel = new DataTable();
                Tools tool = new Tools();
                string fExten = "";
                System.Web.HttpFileCollection files = System.Web.HttpContext.Current.Request.Files;
                for (int i = 0; i <= files.Count - 1; i++)
                {
                    System.Web.HttpPostedFile file = files[i];
                    if (!string.IsNullOrEmpty(file.FileName))
                        fExten = System.IO.Path.GetExtension(file.FileName);
                    if (file != null && file.ContentLength > 0 && fExten.ToLower() != ".csv")
                    {
                        TableExcel = tool.ConvertExcelToDataTable(file.InputStream, fExten, Elimina);
                    }
                    if (file != null && file.ContentLength > 0 && fExten.ToLower() == ".csv")
                    {
                        TableExcel = tool.ConvertCSVtoDataTable(file.InputStream);
                    }
                }
                return Request.CreateResponse(HttpStatusCode.OK, TableExcel);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, (ex.InnerException != null && ex.InnerException.Message != null ? ex.InnerException.Message : ex.Message));
            }
        }



    }
}
