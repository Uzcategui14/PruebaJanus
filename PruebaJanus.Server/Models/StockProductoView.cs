namespace Prueba.Server.Models
{
    public class StockProductoView
    {
        public int ProductoId { get; set; }
        public string Nombre { get; set; }
        public decimal Precio { get; set; }
        public string TipoProducto { get; set; }
        public int? Cantidad { get; set; }
    }
}
