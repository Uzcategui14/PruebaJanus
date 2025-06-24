using System.ComponentModel.DataAnnotations;

namespace Prueba.Server.Models
{
    public class TipoProducto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "La descripción del tipo de producto es obligatoria.")]
        [StringLength(100, ErrorMessage = "La descripción no puede exceder los 100 caracteres.")]
        public string Descripcion { get; set; }
    }
}
