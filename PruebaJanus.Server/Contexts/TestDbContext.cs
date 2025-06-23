using Microsoft.EntityFrameworkCore;
using Prueba.Server.Models;

namespace Prueba.Server.Contexts
{

    public class TestDbContext : DbContext
    {
        public TestDbContext(DbContextOptions<TestDbContext> options) : base(options) { }

        public DbSet<TipoProducto> TipoProducto { get; set; }
        public DbSet<Producto> Producto { get; set; }
        public DbSet<Stock> Stock { get; set; }
        public DbSet<StockProductoView> StockProductos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Producto>()
                .Property(p => p.Precio)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<StockProductoView>()
                .Property(p => p.Precio)
                .HasColumnType("decimal(18,2)");

            // Configuración para la vista (si la usas como DbSet)
            modelBuilder.Entity<StockProductoView>().HasNoKey().ToView("vw_StockProducto");
        }

    }
}
