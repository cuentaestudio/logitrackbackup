# 🌱 DatabaseSeeder - Sistema de Datos de Prueba

## Descripción

El `DatabaseSeeder` es un sistema modularizado que carga datos de prueba automáticamente en memoria cuando se inicia el backend. Está completamente separado de la lógica productiva y es controlado por **variables de entorno/configuración**.

## Características

✅ **Controlado por configuración**: Se activa/desactiva mediante `appsettings.json`  
✅ **Modularizado**: Todo en la clase `DatabaseSeeder.cs`, separado del código principal  
✅ **Datos realistas**: 3 usuarios (uno por rol) con datos asociados complejos  
✅ **Múltiples casos de uso**: Estados variados de paquetes, rutas y vehículos  
✅ **Logging detallado**: Muestra qué se está cargando en cada paso  

## Datos que carga

### 👥 Usuarios de Prueba (3)

| Email | Rol | Contraseña |
|-------|-----|-----------|
| `supervisor@logitrack.com` | Supervisor | `password123` |
| `operador@logitrack.com` | Operador | `password123` |
| `transportista@logitrack.com` | Transportista | `password123` |

### 🚚 Vehículos

20 vehículos predefinidos en `LocalVehiculoRepository` con diferentes marcas y capacidades de carga.

### 📦 Paquetes (7 casos de prueba)

| Código | Estado | Descripción |
|--------|--------|-------------|
| LOG-2024-001 | EnSucursal | En espera de ser enviado |
| LOG-2024-002 | EnTransito | En ruta de entrega |
| LOG-2024-003 | Entregado | Ya fue entregado |
| LOG-2024-004 | Cancelado | Cancelado por cliente |
| LOG-2024-005 | EnSucursal | Pequeño documento |
| LOG-2024-006 | EnTransito | Carga grande |
| LOG-2024-007 | Entregado | Histórico |

### 🛣️ Rutas (3 casos de prueba)

| Estado | Descripción | Paquetes |
|--------|-------------|----------|
| Pendiente | Sin iniciar | 2 paquetes |
| EnCurso | En ejecución | 2 paquetes |
| Finalizada | Completada | 2 paquetes |

## Configuración

### Habilitar/Deshabilitar

Edita `appsettings.json`:

```json
{
  "Database": {
    "EnableSeedData": true  // ✅ Cargar datos de prueba
    // "EnableSeedData": false  // ❌ No cargar datos
  }
}
```

### Pasos para usar

#### 1️⃣ Activar los datos de prueba

Ve a `Back/appsettings.json` y cambia:

```json
"Database": {
  "EnableSeedData": true
}
```

#### 2️⃣ Iniciar el backend

```bash
cd Back
dotnet run
```

Verás en la consola:

```
[SEED] Iniciando carga de datos de prueba...
[SEED] Usuario Supervisor: supervisor@logitrack.com
[SEED] Usuario Operador: operador@logitrack.com
[SEED] Usuario Transportista: transportista@logitrack.com
[SEED] ✓ 3 usuarios creados
[SEED] ✓ 20 vehículos disponibles
[SEED] ✓ Paquetes creados
[SEED] ✓ Rutas creadas
[SEED] ✓ Datos de prueba cargados exitosamente
```

#### 3️⃣ Probar con el frontend

Inicia el frontend y prueba el login con:

```
Email: supervisor@logitrack.com
Contraseña: password123
```

## 🎯 Casos de Prueba Disponibles

Los datos están diseñados para validar:

✅ **Autenticación**: 3 roles diferentes  
✅ **Estados de paquetes**: Todos los estados posibles  
✅ **Estados de rutas**: Pendiente, EnCurso, Finalizada  
✅ **Búsqueda**: Por código de seguimiento, destinatario  
✅ **Filtrado**: Rutas activas, paquetes en sucursal, etc.  
✅ **Asignación**: Vehículos a rutas, paquetes a rutas  

## 📁 Arquitectura

```
Back/
├── Infrastructure/
│   └── DatabaseSeeder.cs         ← Seeder modularizado
├── appsettings.json              ← Configuración
├── Program.cs                    ← Inicializa seeder
└── ...
```

## ⚙️ Desactivar Temporalmente

Si necesitas trabajar sin datos de prueba:

```json
"Database": {
  "EnableSeedData": false
}
```

Simplemente reinicia el backend y los datos no se cargarán (los repositorios siguen funcionando normalmente).

## 🔒 Consideraciones de Seguridad

- ✅ Los datos de prueba **SÓ LO** se carga si está explícitamente habilitado
- ✅ Las contraseñas se hashean con **bcrypt**
- ✅ No hay datos sensibles reales
- ✅ Completamente separado de lógica productiva
- ✅ En producción, setting`EnableSeedData: false`

## 📝 Agregar más datos de prueba

Para agregar más datos:

1. Abre `Back/Infrastructure/DatabaseSeeder.cs`
2. En el método `SeedAsync()`, agrega nuevos métodos privados
3. Llama al nuevo método desde `SeedAsync()`
4. Ejemplo:

```csharp
private async Task SeedPaquetesAdicionales()
{
    // Tu lógica aquí
}
```

## 🐛 Troubleshooting

### "No hay suficientes paquetes/vehículos"

**Causa**: Los repositorios sin datos iniciales.  
**Solución**: Asegúrate de que `EnableSeedData: true` y reinicia.

### Las contraseñas no coinciden

**Causa**: Las contraseñas se hashean.  
**Solución**: Usa `password123` (la contraseña original) para todos los usuarios.

### Los datos persisten entre reinicios

**Causa**: Son datos en memoria.  
**Solución**: Cada reinicio del backend limpia los datos (diseño intencional).

---

**Creado**: Marzo 2026  
**Versión**: 1.0  
**Estado**: ✅ Productivo
