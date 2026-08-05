# Beto Pasteles

Sitio web de **Beto Pasteles**, tienda de pasteles y galletas naturales para perros.
Una sola página estática, sin dependencias ni build: se abre `index.html` y funciona.

```
beto-pasteles/
├── index.html        # estructura y todas las ilustraciones SVG de la marca
├── styles.css        # sistema visual (colores, tipografía, layout, responsive)
├── script.js         # catálogo, filtros, carrito, personalizador
└── assets/spots.svg  # banda de manchas de dálmata (patrón repetible)
```

## Secciones

| Sección | Qué hace |
|---|---|
| Hero | Propuesta de valor + caja de regalo ilustrada |
| Para cada ocasión | 4 categorías; cada "Ver más" filtra el catálogo |
| Nuestros favoritos | Catálogo con filtros y "Ver todos" (4 → 8 productos) |
| Personaliza | Configurador con vista previa en vivo del pastel |
| Nosotros | Sello de la marca, diferenciadores e historia |
| Opiniones | Testimonios escritos "por los perros" |
| Contacto | Newsletter + datos de contacto |

## Funcionalidad

- **Carrito** con cantidades, persistencia en `localStorage` y cierre del pedido por WhatsApp.
- **Personalizador**: nombre, tamaño, cubierta, decoración y manchas laterales. La vista previa SVG
  se actualiza al instante y el total se recalcula (las manchas suman $60). El pedido sale armado
  por WhatsApp.
- **Filtros** de catálogo por categoría, sin recargar.
- **Newsletter** con validación de correo.
- Menú móvil, header pegajoso con enlace activo y animaciones de entrada al hacer scroll.

## Diseño

- Paleta: crema `#F1EDE6`, tinta `#14110F`, menta `#CFE0D4`, tan `#DFC49A`.
- Tipografías (Google Fonts): Cormorant Garamond (títulos), Inter (texto), Caveat (manuscrita).
- Todas las imágenes son SVG dibujados a mano en el mismo estilo de línea, así que el sitio pesa
  poco y se ve nítido en cualquier pantalla. Cuando haya fotografía real de producto, se sustituyen
  las ilustraciones de las tarjetas por `<img>` dentro de `.card__media`.

## Antes de publicar

Estos datos son de ejemplo y hay que reemplazarlos con los reales:

- `script.js` → `WHATSAPP` (número de la tienda) y `FREE_SHIPPING` (mínimo de envío gratis).
- `script.js` → arreglo `PRODUCTS`: nombres, descripciones y precios.
- `index.html` → teléfono, correo, zona de entrega y enlaces de Instagram/Facebook.
- `index.html` → páginas de Términos y condiciones y Aviso de privacidad (hoy apuntan a `#`).

## Desarrollo

No requiere instalación. Para verlo en local:

```bash
cd beto-pasteles
python3 -m http.server 8000
# http://localhost:8000
```
