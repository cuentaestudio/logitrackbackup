# 🚚 LogiTrack - Sistema de Gestión Logística

Bienvenido al repositorio de LogiTrack. Este sistema permite la gestión integral de paquetes, asignación de rutas y trazabilidad de envíos.

## 🌐 Entornos de Prueba (Despliegue)

El sistema se encuentra desplegado y funcional para su evaluación.

* **Frontend (Interfaz de Usuario):** # 🚚 LogiTrack - Sistema de Gestión Logística

Bienvenido al repositorio oficial del Producto Mínimo Viable (MVP) de LogiTrack. Este sistema permite la gestión integral de paquetes, asignación de rutas y trazabilidad de envíos mediante una arquitectura moderna en la nube.

## 🌐 Entornos de Prueba (Despliegue)

El sistema se encuentra desplegado y funcional para su evaluación. Dado que el backend utiliza un servicio de escalado a cero (Scale-to-Zero), **la primera petición del día puede demorar hasta 50 segundos en responder** mientras el servidor se reactiva.

* **Frontend (Interfaz de Usuario):** https://www.netlify.com/
* **Backend (API REST):** https://render.com/
* **Documentación API (Swagger):** https://logitrack-api-4d2k.onrender.com/swagger/index.html

---

## 🔐 Credenciales de Acceso

El sistema LogiTrack cuenta con control de acceso basado en roles (JWT). Para ejecutar el flujo completo, recomendamos utilizar los siguientes usuarios de prueba:

### 1. Rol Supervisor
Tiene acceso total. Puede crear rutas, asignar transportistas y visualizar métricas globales.
* **Nombre:** Carlos	Rodriguez
* **Email:** carlos.rodriguez@logitrack.com
* **Contraseña:** kjkszpj1234

* **Nombre:** Ana	Martinez
* **Email:** ana.martinez@logitrack.com
* **Contraseña:** kjkszpj1234

### 2. Rol Operador (Sucursal)
Encargado de la gestión de paquetes. Puede dar de alta nuevos envíos y actualizar los estados iniciales.
* **Nombre:** Juan Perez
* **Email:** juan.perez@logitrack.com
* **Contraseña:** kjkszpj1234

* **Nombre:** Maria Gomez
* **Email:** maria.gomez@logitrack.co
* **Contraseña:** kjkszpj1234

### 3. Rol Transportista
Vista restringida. Solo puede visualizar las rutas que tiene asignadas, aceptar viajes y marcar paquetes como entregados.
* **Nombre:** Sofia Fernandez
* **Email:** sofia.fernandez@logitrack.com	
* **Contraseña:** kjkszpj1234

* **Nombre:** Luis Lopez
* **Email:** luis.lopez@logitrack.com
* **Contraseña:** kjkszpj1234
---

