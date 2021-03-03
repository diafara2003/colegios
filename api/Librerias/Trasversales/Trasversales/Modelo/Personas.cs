using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Trasversales.Modelo
{
    [Table("Personas", Schema = "DP")]
    public class Personas
    {
        [Key]
        public int PerId { get; set; }
        public int PerIdEmpresa { get; set; }
        [MaxLength(50)]
        public string PerNombres { get; set; }
        [MaxLength(50)]
        public string PerApellidos { get; set; }
        [MaxLength(50)]
        public string PerTIpoDoc { get; set; }
        [MaxLength(50)]
        public string PerDocumento { get; set; }
        [MaxLength(50)]
        public string PerEmail { get; set; }
        [MaxLength(50)]
        public string PerTelefono { get; set; }
        [MaxLength(2)]
        public string PerGenero { get; set; }
        [MaxLength(5)]
        public string PerRH { get; set; }
        [MaxLength(50)]
        public string PerEPS { get; set; }

        [MaxLength(50)]
        public string PerUsuario { get; set; }
        [MaxLength(50)]
        public string PerClave { get; set; }        
        public bool PerEstado { get; set; }        
        public int PerTipoPerfil { get; set; }
        public string PerFechanacimiento { get; set; }
        public string PerLugarNacimiento { get; set; }
        public string PerDireccion { get; set; }

        public string PerTipoAcudiente { get; set; }

        public bool PerIngreso { get; set; }

    }
}
