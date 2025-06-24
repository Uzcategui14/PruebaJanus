using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Prueba.Server.Models
{
    public class Producto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El ID del tipo de producto es obligatorio.")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del tipo de producto debe ser un número positivo.")] // Asumiendo que el ID es siempre > 0
        public int IdTipoProducto { get; set; }

        [Required(ErrorMessage = "El nombre del producto es obligatorio.")]
        [StringLength(100, ErrorMessage = "El nombre no puede exceder los 100 caracteres.")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "El precio del producto es obligatorio.")]
        [Range(0.01, 9999999999999999.99, ErrorMessage = "El precio debe ser un valor positivo.")] // Precio mayor que 0
        [Column(TypeName = "decimal(18, 2)")] // Asegura el mapeo correcto del tipo de columna DECIMAL(18,2)
        public decimal Precio { get; set; }

    }
}
