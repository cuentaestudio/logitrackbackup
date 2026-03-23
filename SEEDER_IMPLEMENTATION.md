# 🚀 Implementación: Sistema de Datos de Prueba (Seeder)

## ✅ Lo que se implementó

### 1. **DatabaseSeeder.cs** - Generador modularizado de datos
- Archivo: `Back/Infrastructure/DatabaseSeeder.cs`
- Responsabilidades:
  - Crear 3 usuarios de prueba (Supervisor, Operador, Transportista)
  - Generar 7 paquetes con diferentes estados
  - Crear 3 rutas con diferentes estados
  - Reutilizar 20 vehículos existentes
  - Logging detallado de cada paso

### 2. **Configuración por Variables de Entorno**
- `appsettings.json` - Producción: `EnableSeedData: false`
- `appsettings.Development.json` - Desarrollo: `EnableSeedData: true`

### 3. **Integración en Program.cs**
- Registra `DatabaseSeeder` como servicio
- Lee la configuración `Database:EnableSeedData`
- Ejecuta el seeder al iniciar si está habilitado

### 4. **Actualizaciones a Repositorios**
- Agregó método `GetAll()` a `IVehiculoRepository`
- Agregó método `GetAll()` a `IEnviosRepository`
- Implementaciones en `LocalVehiculoRepository` y `LocalEnviosRepository`

### 5. **Documentación**
- `SEEDER_GUIDE.md` - Guía completa de uso

---

## 📦 Datos de Prueba

### Usuarios (3)
```
✅ supervisor@logitrack.com       (Supervisor)
✅ operador@logitrack.com         (Operador)
✅ transportista@logitrack.com    (Transportista)
Password: password123 (para todos)
```

### Paquetes (7 casos)
- **LOG-2024-001**: EnSucursal (sin entregar)
- **LOG-2024-002**: EnTransito (en ruta)
- **LOG-2024-003**: Entregado (completado)
- **LOG-2024-004**: Cancelado (por cliente)
- **LOG-2024-005**: EnSucursal pequeño (documento)
- **LOG-2024-006**: EnTransito grande (maquinaria)
- **LOG-2024-007**: Entregado histórico (repuestos)

### Rutas (3 estados)
- Ruta 1: **Pendiente** (sin iniciar)
- Ruta 2: **EnCurso** (en ejecución)
- Ruta 3: **Finalizada** (completada)

### Vehículos
- 20 vehículos preexistentes reutilizados
- Diferentes marcas y capacidades

---

## 🎯 Casos de Prueba Cubiertos

✅ **Autenticación**: Login con 3 roles diferentes  
✅ **Estados complejos**: Paquetes en todos los estados  
✅ **Históricos**: Entregas pasadas  
✅ **Cancelaciones**: Paquetes rechazados  
✅ **Escalas de carga**: Paquetes pequeños y grandes  
✅ **Estados de ruta**: Completo ciclo de vida  
✅ **Asignaciones**: Vehículos a rutas con paquetes  

---

## 🚀 Cómo Usar

### Activar datos de prueba

```json
// Back/appsettings.Development.json (ya configurado)
{
  "Database": {
    "EnableSeedData": true
  }
}
```

### Ejecutar backend

```bash
cd Back
dotnet run
```

Verás en consola:
```
[SEED] Iniciando carga de datos de prueba...
[SEED] ✓ 3 usuarios creados
[SEED] ✓ 20 vehículos disponibles
[SEED] ✓ Paquetes creados
[SEED] ✓ Rutas creadas
[SEED] ✓ Datos de prueba cargados exitosamente
```

### Ejecutar frontend

```bash
cd Front
npm run dev
```

### Probar login

Usa cualquiera de los 3 usuarios:
- Email: `supervisor@logitrack.com`
- Contraseña: `password123`

---

## 📁 Estructura de Archivos

```
Back/
├── Infrastructure/
│   └── DatabaseSeeder.cs              ← 🆕 Seeder modularizado
├── Domain/
│   └── Repositories/
│       ├── IVehiculoRepository.cs      ← Agregó GetAll()
│       └── IEnviosRepository.cs        ← Agregó GetAll()
├── Repositories/
│   ├── LocalVehiculoRepository.cs      ← Implementó GetAll()
│   └── LocalEnviosRepository.cs        ← Implementó GetAll()
├── Controllers/
│   └── AuthController.cs               ← Loginrequest Email
├── Application/Services/
│   └── AuthService.cs                  ← Login devuelve{token, user}
├── appsettings.json                    ← Base (EnableSeedData: false)
├── appsettings.Development.json        ← 🆕 Dev (EnableSeedData: true)
├── Program.cs                          ← Agregó inicialización seeder
└── SEEDER_GUIDE.md                     ← 🆕 Documentación
```

---

## 🔒 Características de Seguridad

✅ Controlado por configuración (no hardcodeado)  
✅ Fácilmente desactivable  
✅ Contraseñas hasheadas con bcrypt  
✅ Completamente separado de lógica productiva  
✅ Logging para auditoría  
✅ No carga datos si no está explícitamente habilitado  

---

## 🧪 Validaciones Posibles

Con estos datos puedes validar:

1. **Autenticación**
   - ✅ Login con 3 roles diferentes
   - ✅ Redirecciones correctas por rol

2. **API Endpoints**
   - ✅ Obtener paquetes
   - ✅ Buscar por código de seguimiento
   - ✅ Obtener rutas por transportista
   - ✅ Cambiar estado de paquetes

3. **Estados Complejos**
   - ✅ Manejar paquetes en diferentes estados
   - ✅ Asignar paquetes a rutas
   - ✅ Rastrear históricos

4. **Flujos Completos**
   - ✅ Transportista recibe ruta
   - ✅ Recorre paquetes
   - ✅ Marca entregas
   - ✅ Finaliza ruta

---

## 📝 Notas

- Los datos se cargan **EN MEMORIA** cada vez que inicia el backend
- Al reiniciar, todos los datos se resetean (por diseño)
- Perfecto para desarrollo y testing
- Para producción, dejar `EnableSeedData: false`

---

**Implementado**: Marzo 2024  
**Estado**: ✅ Listo para probar
