# PruebaJanus
Desafío Técnico de Janus Automation realizado con React, ASP.NET y ServerSQL.
README Este proyecto es una aplicación full-stack para la gestión de inventario, construida con ASP.NET Core Web API en el backend y React con Vite en el frontend. Utiliza SQL Server como base de datos y Tailwind CSS con Shadcn UI para los estilos del frontend.
1. Prerequisitos
Antes de iniciar el proyecto, asegúrate de tener instaladas las siguientes herramientas:
.NET SDK (versión 7.0 o superior recomendada) 
.NET SDKNode.js (versión 18.x o superior recomendada) y npm 
Node.js (npm se incluye con Node.js)
SQL Server (cualquier edición, incluyendo Express o LocalDB) 
SQL Server ExpressSQL Server Management Studio (SSMS) o Azure Data Studio 
Visual Studio Code o Azure Data StudioVisual Studio 2022 (con cargas de trabajo "Desarrollo web y ASP.NET" y "Desarrollo de escritorio con .NET")

2. Configuración de la Base de Datos SQL Server
Crear la Base de Datos y Tablas:
Abre SQL Server Management Studio (SSMS) o Azure Data Studio y conéctate a tu instancia de SQL Server.
Abre una nueva ventana de consulta.
Copia y ejecuta el script SQL que define la base de datos Test, las tablas (TipoProducto, Producto, Stock), la vista (vw_StockProducto) y los procedimientos almacenados (sp_InsertarProducto, sp_ModificarProducto, sp_EliminarProducto).

-- Crear la base de datos
CREATE DATABASE Test;
GO

USE Test;
GO

-- Crear tabla TipoProduto
CREATE TABLE TipoProducto (
    id INT IDENTITY(1,1) PRIMARY KEY,
    descripcion NVARCHAR(100) NOT NULL
);
GO

-- Crear tabla Producto
CREATE TABLE Producto (
    id INT IDENTITY(1,1) PRIMARY KEY,
    idTipoProducto INT NOT NULL,
    nombre NVARCHAR(100) NOT NULL,
    precio DECIMAL(18,2) NOT NULL,
    CONSTRAINT FK_Produto_TipoProducto FOREIGN KEY (idTipoProducto) REFERENCES TipoProducto(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
GO

-- Crear tabla Stock
CREATE TABLE Stock (
    id INT IDENTITY(1,1),
    idProducto INT NOT NULL,
    cantidad INT NOT NULL,
    PRIMARY KEY (id, idProducto),
    CONSTRAINT FK_Stock_Producto FOREIGN KEY (idProducto) REFERENCES Producto(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
GO

-- Crear vista vw_StockProducto
CREATE VIEW vw_StockProducto AS
SELECT
    p.id AS ProductoId,
    p.nombre,
    p.precio,
    tp.descripcion AS TipoProducto,
    s.cantidad
FROM Producto p
INNER JOIN TipoProducto tp ON p.idTipoProducto = tp.id
LEFT JOIN Stock s ON p.id = s.idProducto;
GO

-- Procedimiento para insertar producto
CREATE PROCEDURE sp_InsertarProducto
    @idTipoProducto INT,
    @nombre NVARCHAR(100),
    @precio DECIMAL(18,2)
AS
BEGIN
    INSERT INTO Producto (idTipoProducto, nombre, precio)
    VALUES (@idTipoProducto, @nombre, @precio);
END
GO

-- Procedimiento para modificar producto
CREATE PROCEDURE sp_ModificarProducto
    @id INT,
    @idTipoProducto INT,
    @nombre NVARCHAR(100),
    @precio DECIMAL(18,2)
AS
BEGIN
    UPDATE Producto
    SET idTipoProducto = @idTipoProducto,
        nombre = @nombre,
        precio = @precio
    WHERE id = @id;
END
GO

-- Procedimiento para eliminar producto
CREATE PROCEDURE sp_EliminarProducto
    @id INT
AS
BEGIN
    DELETE FROM Producto WHERE id = @id;
END
GO

Insertar Datos de Prueba (Opcional):Puedes insertar datos iniciales para probar la aplicación. 
El siguiente script te ayudará a poblar las tablas.

USE Test;
GO

-- Insertar Tipos de Producto
INSERT INTO TipoProducto (descripcion) VALUES
('Electrónica'),
('Ropa'),
('Alimentos'),
('Libros');
GO

-- Insertar Productos
INSERT INTO Producto (idTipoProducto, nombre, precio) VALUES
(1, 'Laptop Gaming', 1200.00),
(1, 'Auriculares Inalámbricos', 75.50),
(2, 'Camiseta Algodón', 25.00),
(3, 'Paquete de Café (500g)', 12.75);
GO
3. Configuración del Backend (ASP.NET Core Web API)
Navegar a la Carpeta del Backend:Abre tu terminal o línea de comandos y navega a la carpeta de tu proyecto de backend (ej. PruebaJanus/PruebaJanus.Server).
Configurar la Cadena de Conexión:
Abre el archivo appsettings.json en tu proyecto de backend.
Asegúrate de que la cadena de conexión apunte a tu base de datos Test en SQL Server.

{
  "ConnectionStrings": {
    "TestDBConnection": "Server=.\\SQLExpress;Database=Test;Trusted_Connection=True;TrustServerCertificate=True;"
    // Ajusta "Server=.\\SQLExpress" si tu instancia de SQL Server es diferente.
    // Trusted_Connection=True usa autenticación de Windows. Si usas SQL Server Authentication, añade User Id y Password.
    // TrustServerCertificate=True es para desarrollo, no recomendado en producción sin un certificado válido.
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}

Instalar Dependencias NuGet:
Si no lo has hecho, restaura las dependencias NuGet:
dotnet restore

Configurar CORS:
Abre Program.cs en tu proyecto de backend.
Asegúrate de que la configuración CORS permita solicitudes desde el puerto de tu frontend (Vite por defecto usa http://localhost:5173).

// Program.cs
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// Agrega tu DbContext
builder.Services.AddDbContext<TestDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("TestDBConnection")));

// --- Configuración de CORS ---
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // <-- Puerto de tu frontend Vite
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});
// --- Fin de Configuración de CORS ---

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseHttpsRedirection();

// --- Uso de CORS ---
app.UseCors(); // Asegúrate de que esto esté antes de UseAuthorization y MapControllers
// --- Fin de Uso de CORS ---

app.UseAuthorization();
app.MapControllers();
app.Run();

4. Configuración del Frontend (React con Vite)
Navegar a la Carpeta del Frontend:Abre tu terminal o línea de comandos y navega a la carpeta de tu proyecto de frontend (ej. PruebaJanus/PruebaJanus.Client).
Instalar Dependencias de Node:
Instala las dependencias del proyecto:
npm install
# o
yarn install

Configurar API_BASE_URL:
Abre src/config.js y asegúrate de que apunte a tu backend. 
Si estás usando el proxy de Vite configurado en vite.config.js, la URL debe ser '/api'. 
Si no, debe ser la URL completa de tu backend (ej. https://localhost:7081/api).

// src/config.js
const API_BASE_URL = '/api'; // Si usas el proxy en vite.config.js
// O si no usas el proxy y accedes directamente:
// const API_BASE_URL = 'https://localhost:7081/api'; // Ajusta al puerto de tu backend
export default API_BASE_URL;

Configurar Tailwind CSS v4 con Vite:
Desinstalar versiones antiguas y PostCSS: (Si lo hiciste previamente, puedes omitir este paso)
npm uninstall tailwindcss postcss autoprefixer @tailwindcss/postcss

Instalar Tailwind CSS v4 y el plugin de Vite:
npm install -D tailwindcss@next @tailwindcss/vite

vite.config.js: 
Asegúrate de que el plugin de Tailwind CSS v4 esté añadido:

// vite.config.js
import tailwindcss from '@tailwindcss/vite'; // Importa el plugin
// ...
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(), // Añade el plugin aquí
    ],
    server: {
        proxy: {
            '^/api': { // Asegúrate de que este proxy esté configurado
                target: 'https://localhost:7081', // O el puerto real de tu backend
                secure: false
            }
        },
        // ...
    }
});

tailwind.config.js: 
Crea o actualiza este archivo en la raíz de tu frontend.

/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {},
  },
  plugins: [],
};

src/index.css: 
Asegúrate de que NO contenga las directivas @tailwind (ya que estás en v4), solo las variables CSS de Shadcn UI y tus estilos globales.

/* src/index.css */
/* No @tailwind directivas en v4 */

:root {
  /* Variables CSS de Shadcn UI generadas por 'shadcn-ui init' */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... otras variables ... */
  --radius: 0.5rem;
}

/* Si tienes un modo oscuro */
.dark {
  /* ... variables dark mode ... */
}

body {
  font-family: sans-serif;
  margin: 0;
  padding: 0;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}

Configurar Shadcn UI:
Instalar CLI de Shadcn UI (si no la tienes):
npm install -g shadcn-ui@latest

Inicializar Shadcn UI: 
Navega a la raíz de tu proyecto frontend y ejecuta:
npx shadcn@latest init

Cuando te pregunte "Would you like to use TypeScript?", responde Yes (si tu proyecto usa .tsx). 
Si tu proyecto usa .jsx, asegúrate de tener un tsconfig.json y renombra tus archivos a .jsx si aún son .js.
Cuando pregunte "Which Tailwind CSS version?", elige v4.Sigue las demás indicaciones (estilo, colores, etc.).

Añadir Componentes de Shadcn UI: 
Instala los componentes que necesites (ej. button, input, label, table):
npx shadcn@latest add button input label table

Instalar lucide-react (para iconos de ordenación):
npm install lucide-react

5. Ejecutar la Aplicación
Para que la aplicación funcione correctamente, debes ejecutar tanto el backend como el frontend.
Iniciar el Backend:En la carpeta de tu proyecto de backend (PruebaJanus.Server), abre una terminal y ejecuta:
dotnet run

Asegúrate de que la consola muestre que el servidor está escuchando en https://localhost:7081 (o tu puerto configurado).

Iniciar el Frontend:
En la carpeta de tu proyecto de frontend (PruebaJanus.Client), abre otra terminal y ejecuta:
npm run dev

Vite iniciará el servidor de desarrollo, generalmente en http://localhost:5173. 

Abre esta URL en tu navegador.6. Tecnologías ClaveBackend: ASP.NET Core Web API, Entity Framework Core, SQL ServerFrontend: 
React, Vite, Tailwind CSS v4, Shadcn UI, Lucide React7. 

Estructura del Proyecto (Ejemplo Básico)YourProjectRoot/

├── PruebaJanus.Server/          # Proyecto de Backend .NET Core
│   ├── Controllers/
│   ├── Models/
│   │   ├── Producto.cs
│   │   ├── TipoProducto.cs
│   │   ├── Stock.cs
│   │   └── ProductoStockVista.cs # Clase para mapear tu vista SQL
│   ├── Contexts/
│   │   └── TestDbContext.cs
│   ├── Properties/
│   ├── appsettings.json
│   ├── Program.cs
│   └── PruebaJanus.Server.csproj
└── PruebaJanus.Client/          # Proyecto de Frontend React (Vite)
    ├── public/
    ├── src/
    │   ├── components/
    │   │   ├── ui/                # Componentes de Shadcn UI
    │   │   │   ├── button.jsx
    │   │   │   └── input.jsx
    │   │   │   └── label.jsx
    │   │   │   └── table.jsx
    │   │   ├── ProductForm.jsx
    │   │   ├── ProductList.jsx
    │   │   └── StockView.jsx
    │   ├── lib/                   # Utilidades como cn()
    │   │   └── utils.js
    │   ├── App.jsx
    │   ├── index.css
    │   ├── main.jsx
    │   └── config.js              # URL de la API
    ├── components.json            # Configuración de Shadcn UI
    ├── package.json
    ├── postcss.config.js          # (DEBERÍA ELIMINARSE si usas Tailwind v4)
    ├── tailwind.config.js         # Configuración de Tailwind CSS v4
    └── vite.config.js
