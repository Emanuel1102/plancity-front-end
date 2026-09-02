# PlanCity - Frontend

Frontend de PlanCity, plataforma para descubrir y organizar eventos y actividades locales. Construido con React + TypeScript + Vite, consumiendo la API REST de PlanCity (NestJS + PostgreSQL).

## Requisitos previos

- Node.js (v18 o superior recomendado)
- El backend `plancity-api` corriendo localmente en `http://localhost:3000` (ver [repositorio del backend](https://github.com/carlosdcastano/plancity-api) para su propia configuración: variables de entorno, conexión a Supabase y migraciones).

## Cómo correr el proyecto

1. Clonar este repositorio e instalar dependencias:

```bash
   npm install
```

2. Asegurarse de que el backend esté corriendo en `http://localhost:3000` (definido como `baseURL` en `src/services/api.ts`).

3. Levantar el servidor de desarrollo:

```bash
   npm run dev
```

4. Abrir la URL que indique la consola (por defecto `http://localhost:5173`).

## Cómo correr las pruebas

```bash
npm run test
```

## Decisiones técnicas

### Almacenamiento del token de sesión

El `accessToken` se guarda en **`localStorage`**, a través de un módulo centralizado (`src/services/tokenStorage.ts`) que expone `getToken`, `setToken` y `removeToken`.

Se eligió `localStorage` sobre `sessionStorage` porque:
- Persiste entre recargas de página y entre pestañas, cumpliendo el criterio de que la sesión se mantenga mientras el token sea válido, sin necesitar mecanismos adicionales de sincronización.
- Al no existir un endpoint de refresh token en la API, el token vive el tiempo que dura su validez; `localStorage` refleja ese comportamiento de forma directa.
- El cierre de sesión es siempre explícito (botón "Cerrar sesión"), que limpia el storage y notifica al backend vía `POST /auth/logout`, o implícito ante un `401` capturado por el interceptor de Axios.

### Librería HTTP e interceptor de autenticación

Se usó **Axios**, con una instancia centralizada (`src/services/api.ts`) en vez de invocarlo directamente en cada servicio. Esto permitió:

- **Interceptor de request:** antes de cada petición, se obtiene el token con `tokenStorage.getToken()` y, si existe, se inyecta automáticamente en el header `Authorization: Bearer <token>`. Así ningún servicio (`eventService`, `categoryService`, etc.) necesita preocuparse por adjuntar el token manualmente.

- **Interceptor de response:** si una respuesta llega con status `401`, se limpia el token del storage y se redirige a `/login` mediante `window.location.href`. Se usó esta forma de redirección (en vez de `useNavigate` de React Router) porque los interceptores de Axios se ejecutan fuera del árbol de componentes de React, por lo que no tienen acceso directo a los hooks de navegación del router.

El resto de errores (`400`, `403`, errores de red) se distinguen y manejan a nivel de componente mediante el hook genérico `useFetch<T>`, que expone un `error.type` (`network` | `validation` | `auth` | `unknown`) para que cada pantalla muestre feedback visible al usuario, sin dejar nunca el manejo solo en consola.


## Modelo de roles y control de acceso

| Acción | Visitante | Usuario | Admin |
|---|---|---|---|
| Ver eventos y categorías | ✅ | ✅ | ✅ |
| Marcar/quitar favoritos, ver "Mis favoritos" | ❌ | ✅ | ✅ |
| Crear/editar/eliminar categorías | ❌ | ❌ | ✅ |
| Crear/editar/eliminar eventos | ❌ | ❌ | ✅ |

El control de acceso se implementa en dos capas:

1. **Visual:** los botones y enlaces de acciones restringidas (favoritos, administración) solo se renderizan si el usuario cumple el rol requerido (`isAuthenticated`, `role === "admin"`).
2. **De ruta:** los componentes `ProtectedRoute` y `AdminRoute` envuelven las rutas sensibles y redirigen (`/login` o `/`) si se intenta acceder directamente por URL sin los permisos adecuados, sin depender de que el botón esté oculto.

