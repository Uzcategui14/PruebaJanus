using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Prueba.Server.Contexts;
using Prueba.Server.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Prueba.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly TestDbContext _context;

        public ProductosController(TestDbContext context)
        {
            _context = context;
        }

        // GET: api/<ProductosController>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Producto>>> GetProductos()
        {
            return await _context.Producto.ToListAsync();
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
        public async Task<ActionResult<IEnumerable<StockProductoView>>> GetStockProductosView()
        {
            try
            {
                var stockProductos = await _context.StockProductos
                    .Where(sp => sp.ProductoId != null && sp.Nombre != null && sp.TipoProducto != null)
                    .ToListAsync();

                // Filtrar manualmente si alguna propiedad crítica es null
                var stockProductosFiltrados = stockProductos
                    .Where(sp => sp.ProductoId != 0 && !string.IsNullOrEmpty(sp.Nombre) && !string.IsNullOrEmpty(sp.TipoProducto))
                    .ToList();

                return stockProductosFiltrados;
            }
            catch (Exception ex)
            {
                // Opcional: registrar el error con un logger
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
    }
}
