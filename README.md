# April's Portfolio & April Studio

Portafolio estático adaptable a móvil. Dominio existente: **abrilvilla.dev**. Se conserva `CNAME`; no requiere ChatGPT Sites ni nuevas credenciales.

## Portafolio

`index.html`, `styles.css`, `script.js` y `content.json` forman el sitio público, compatible con GitHub Pages. Las secciones son agenda/tutorial, MacBook/carpetas, journal, planner y Motorola/contactos/certificados/CV. `previous-portfolio.html` conserva la versión anterior.

Los proyectos y enlaces iniciales proceden del repositorio existente y sus README. Los dos certificados no recibidos y los tres CV permanecen pendientes. No se afirma haber verificado al emisor en tiempo real. Las descripciones no añaden resultados ni logros inventados.

Referencia: https://canva.link/5yxz2vafa504gsh. Esta primera versión reconstruye la composición mediante CSS; faltan los recortes exportados de Canva para sustituir los objetos provisionales por los recursos originales. Sin imágenes generadas ni 3D.

## April Studio privado

1. Descarga o clona este repositorio en tu computadora.
2. Con Python 3 instalado, ejecuta desde el repositorio: `python studio/server.py`.
3. Abre `http://127.0.0.1:8765/studio/`.

El servidor solo escucha en loopback y valida Host, sesión local, Origin y una cabecera de solicitud en las operaciones de escritura. No se publica ningún endpoint de administración en GitHub Pages. Se utiliza SQLite y la carpeta ignorada `.april-studio/`. No subas esa carpeta a GitHub: contiene borradores y medios privados. Cualquier persona con acceso a tu computadora puede acceder al panel mientras está abierto; no es un CMS remoto con contraseña.

Puedes crear/editar/duplicar/eliminar contenido, ordenar, cambiar tamaños, guardar borradores, subir JPG/PNG/WebP/PDF/MP4/WebM hasta 25 MB, añadir CV y credenciales, importar y exportar JSON. **Preparar publicación** crea `content.json` solo con registros publicados y pendientes y copia solo los archivos referenciados. Revisa el archivo y sube esos cambios a GitHub para actualizar el dominio. No se hacen pushes automáticos.

Exportar todo contiene borradores; conserva el respaldo privado. Los archivos multimedia del respaldo se conservan por separado en `.april-studio/assets/`; el JSON no incluye sus bytes. Para un respaldo completo copia la carpeta privada cuando el servidor esté cerrado.

## Verificación

`node --check script.js`, `node --check studio/studio.js`, `python -m py_compile studio/server.py` y `python studio/test_server.py`.

Pendiente: exportar recursos originales, añadir video/CV y comprobar visualmente en dispositivos reales. La navegación respeta movimiento reducido y los detalles usan un diálogo accesible.
