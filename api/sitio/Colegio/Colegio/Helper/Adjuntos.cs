

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
    }
}