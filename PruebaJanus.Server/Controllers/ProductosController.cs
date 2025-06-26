using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prueba.Server.Contexts;
using Prueba.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Prueba.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly TestDbContext _context;

        public ProductosController(TestDbContext context)
        {
            _context = context;
        }

        // GET: api/<ProductosController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string orderBy = "Id", // Parámetro para la columna de ordenación (por defecto "Id")
            [FromQuery] string orderDirection = "asc") // Parámetro para la dirección (por defecto "asc" ascendente)
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            // Iniciar la consulta
            IQueryable<Producto> query = _context.Producto;

            // --- LÓGICA DE ORDENACIÓN ---
            switch (orderBy?.ToLower()) // Usamos ?.ToLower() para manejar nulls y ser insensible a mayúsculas/minúsculas
            {
                case "nombre":
                    query = (orderDirection?.ToLower() == "desc") ? query.OrderByDescending(p => p.Nombre) : query.OrderBy(p => p.Nombre);
                    break;
                case "precio":
                    query = (orderDirection?.ToLower() == "desc") ? query.OrderByDescending(p => p.Precio) : query.OrderBy(p => p.Precio);
                    break;
                case "idtipoproducto":
                    query = (orderDirection?.ToLower() == "desc") ? query.OrderByDescending(p => p.IdTipoProducto) : query.OrderBy(p => p.IdTipoProducto);
                    break;
                case "id": // Ordenación por defecto
                default:
                    query = (orderDirection?.ToLower() == "desc") ? query.OrderByDescending(p => p.Id) : query.OrderBy(p => p.Id);
                    break;
            }
            // --- FIN LÓGICA DE ORDENACIÓN ---

            // Contar el total de registros (después de cualquier filtro, pero antes de paginar)
            var totalCount = await query.CountAsync();

            // Aplicar paginación: saltar los registros de páginas anteriores y tomar solo los de la página actual
            var productos = await query
                                    .Skip((pageNumber - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

            // Añadir encabezados de respuesta
            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("X-Page-Number", pageNumber.ToString());
            Response.Headers.Append("X-Page-Size", pageSize.ToString());

            return Ok(productos);
        }

        // GET api/<ProductosController>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Producto>> GetProducto(int id)
        {
            var producto = await _context.Producto.FindAsync(id);

            if (producto == null)
            {
                return NotFound(); // Retorna un 404 si el producto no se encuentra
            }

            return producto; // Retorna el producto encontrado con un 200 OK
        }

        [HttpPost]
        public async Task<ActionResult<Producto>> PostProducto(Producto producto)
        {
            _context.Producto.Add(producto);
            await _context.SaveChangesAsync();

            // Retorna un 201 CreatedAtAction con la URL del nuevo recurso
            return CreatedAtAction(nameof(GetProducto), new { id = producto.Id }, producto);
        }

        // FIXED: Marked the method as async and updated the return type to Task<ActionResult<Producto>>
        // PUT api/<ProductosController>/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Producto>> Put(int id, Producto producto)
        {
            if (id != producto.Id)
            {
                return BadRequest(); // Retorna un 400 si el ID en la URL no coincide con el del cuerpo
            }

            _context.Entry(producto).State = EntityState.Modified;

            try
            {

                await _context.SaveChangesAsync(); // Fixed CS4032 by marking the method async
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExists(id))
                {
                    return NotFound(); // Retorna un 404 si el producto no existe para actualizar
                }
                else
                {
                    throw; // Lanza la excepción si es otro problema de concurrencia
                }
            }

            return NoContent(); // Retorna un 204 No Content para indicar que la actualización fue exitosa
        }

        private bool ProductoExists(int id)
        {
            return _context.Producto.Any(e => e.Id == id);
        }

        // DELETE api/<ProductosController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Producto.FindAsync(id);
            if (producto == null)
            {
                return NotFound(); // Retorna un 404 si el producto no se encuentra
            }

            _context.Producto.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent(); // Retorna un 204 No Content para indicar que la eliminación fue exitosa
        }


        [HttpGet("Stock")]
        public async Task<ActionResult<IEnumerable<StockProductoView>>> GetStockProductosView(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string orderBy = "ProductoId",
            [FromQuery] string orderDirection = "asc")
        {
            if (pageNumber < 1) pageNumber = 1;
            if (pageSize < 1 || pageSize > 100) pageSize = 10;

            // ¡Ahora consultamos directamente la vista!
            IQueryable<StockProductoView> query = _context.StockProductos; // <-- ¡Aquí está el cambio clave!

            // --- LÓGICA DE ORDENACIÓN ---
            switch (orderBy?.ToLower())
            {
                case "nombre":
                    query = (orderDirection?.ToLower() == "desc") ? query.OrderByDescending(p => p.Nombre) : query.OrderBy(p => p.Nombre);
                    break;
                case "precio":
                    query = (orderDirection?.ToLower() == "desc") ? query.OrderByDescending(p => p.Precio) : query.OrderBy(p => p.Precio);
                    break;
                case "tipoproducto":
                    query = (orderDirection?.ToLower() == "desc") ? query.OrderByDescending(p => p.TipoProducto) : query.OrderBy(p => p.TipoProducto);
                    break;
                case "cantidad":
                    query = (orderDirection?.ToLower() == "desc") ? query.OrderByDescending(p => p.Cantidad) : query.OrderBy(p => p.Cantidad);
                    break;
                case "productoid": // Ordenación por defecto
                default:
                    query = (orderDirection?.ToLower() == "desc") ? query.OrderByDescending(p => p.ProductoId) : query.OrderBy(p => p.ProductoId);
                    break;
            }
            // --- FIN LÓGICA DE ORDENACIÓN ---

            var totalCount = await query.CountAsync();

            var stock = await query
                                    .Skip((pageNumber - 1) * pageSize)
                                    .Take(pageSize)
                                    .ToListAsync();

            Response.Headers.Append("X-Total-Count", totalCount.ToString());
            Response.Headers.Append("X-Page-Number", pageNumber.ToString());
            Response.Headers.Append("X-Page-Size", pageSize.ToString());

            return Ok(stock);
        }
    }
}
