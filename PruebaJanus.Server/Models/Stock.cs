using System.ComponentModel.DataAnnotations;

namespace Prueba.Server.Models
{
    public class Stock
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El ID del producto es obligatorio para el stock.")]
        [Range(1, int.MaxValue, ErrorMessage = "El ID del producto debe ser un número positivo.")]
        public int IdProducto { get; set; }

        [Required(ErrorMessage = "La cantidad de stock es obligatoria.")]
        [Range(0, int.MaxValue, ErrorMessage = "La cantidad de stock no puede ser negativa.")] // Permitir 0 o más
        public int Cantidad { get; set; }
    }
}
