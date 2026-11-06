# MANDO G — PRESS KIT OFICIAL & PANEL ADMINISTRABLE (CMS)

Plataforma oficial del Press Kit de **Mando G**, artista de hip hop bilingüe (Ecatepec, Estado de México / South Omaha, Nebraska) bajo el sello independiente **2Sik Music**.

Diseñada para conservar el 100% de la identidad gráfica urbana (estética oscura, muros de pósters, grano analógico, tipografías callejeras, stickers, cintas y vinilo giratorio) integrando un CMS profesional que permite administrar todo el contenido público sin necesidad de programar ni realizar despliegues manuales.

---

## 🚀 TECNOLOGÍAS UTILIZADAS

- **Framework:** Next.js 14 (App Router, Server Components y Route Handlers)
- **Lenguaje:** TypeScript / JavaScript moderno
- **Estilos:** Tailwind CSS con paleta personalizada (`noir`, `carbon`, `selva`, `oro`, `hueso`) y animaciones nativas
- **Efectos e Interactividad:** GSAP & ScrollTrigger, Spotlight visual en bloques, Lightbox editorial, ecualizador dinámico y cursor personalizado
- **Autenticación & Seguridad:** 
  - Sesiones seguras en servidor con cookies `httpOnly`, `SameSite=Lax` y firma criptográfica
  - Contraseñas con hashing de alta seguridad (bcrypt)
  - Sistema de códigos de invitación temporales con vencimiento y revocación inmediata
  - Protección de rutas y endpoints administrativos
- **Base de Datos & Almacenamiento:**
  - Integración nativa con **Supabase** (PostgreSQL + Supabase Storage bucket `presskit-media`)
  - Compatibilidad con **Vercel Blob**
  - Adaptador de persistencia resiliente con fallback automático para desarrollo local y builds sin conexión

---

## 📁 ESTRUCTURA DEL PROYECTO

```
├── app/
│   ├── layout.tsx              # Tipografías, SEO dinámico y SVG defs
│   ├── globals.css             # Estilos urbanos, muro, cintas, sellos y grano
│   ├── page.tsx                # Página pública del Press Kit (SSR)
│   ├── admin/
│   │   ├── page.tsx            # Panel de control CMS multi-sección
│   │   ├── login/page.tsx      # Inicio de sesión seguro
│   │   ├── register/page.tsx   # Registro mediante código de invitación
│   │   └── setup/page.tsx      # Configuración del primer administrador
│   └── api/
│       ├── auth/               # Login, logout, setup, me, registro
│       ├── admin/              # Contenido, borrador, versiones, invites, media
│       ├── content/            # API pública de contenido publicado
│       └── upload/             # Subida y optimización de medios
├── components/
│   ├── public/                 # Efectos interactivos, cursor, lightbox, audio/video
│   └── admin/                  # Formularios, biblioteca multimedia, versiones
├── lib/
│   ├── db.ts                   # Adaptador de persistencia (Supabase / local)
│   ├── auth.ts                 # Hashing bcrypt y gestión de sesiones
│   ├── storage.ts              # Subida a Supabase Storage / Vercel Blob
│   ├── supabase.ts             # Cliente de Supabase
│   └── initial-data.ts         # Contenido original oficial de Mando G
├── supabase/
│   └── schema.sql              # Script SQL para tablas y bucket de Supabase
└── types/
    └── presskit.ts             # Tipado TypeScript del CMS
```

---

## 🛠️ INSTALACIÓN Y EJECUCIÓN LOCAL

1. Clonar el repositorio y acceder al directorio:
   ```bash
   git clone https://github.com/dyann1984/mando-g.git
   cd "mando-g"
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) para ver el sitio público y [http://localhost:3000/admin](http://localhost:3000/admin) para el panel de administración.

4. Compilar para producción:
   ```bash
   npm run build
   npm start
   ```

---

## ⚙️ CONFIGURACIÓN DE VARIABLES DE ENTORNO

Copia el archivo `.env.example` a `.env.local` o configúralas en la consola de **Vercel**:

```env
# Clave secreta para firmar sesiones administrativas (genera una cadena aleatoria)
AUTH_SECRET="tu_clave_secreta_super_segura"

# Supabase (PostgreSQL + Storage)
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key"
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"
SUPABASE_STORAGE_BUCKET="presskit-media"

# Opcional: Vercel Blob
# BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

> **Nota:** En Supabase, ejecuta el script ubicado en `supabase/schema.sql` en el Editor SQL de Supabase para crear automáticamente las tablas y el bucket de almacenamiento público.

---

## 📖 MANUAL DE USO PARA MANDO G & EQUIPO (SIN PROGRAMAR)

### 1. Acceso al Panel de Administración
- Entra a: `https://tu-dominio.vercel.app/admin`
- Durante la primera apertura, el sistema te solicitará crear tu **Administrador Maestro** (usuario, correo y contraseña segura de mínimo 8 caracteres).
- En accesos posteriores, simplemente inicia sesión con tus credenciales.

### 2. Guardar Borrador vs. Publicar en Vivo
- Mientras editas fotografías o textos, puedes presionar **Guardar Borrador** tantas veces como desees sin alterar lo que ven tus fans y promotores.
- Cuando estés satisfecho con los cambios, presiona el botón dorado **Publicar en Vivo**. Los cambios se reflejarán inmediatamente en la web pública.

### 3. Subir y Cambiar Fotografías
1. Ve a la pestaña **Galería de Fotos** o **Portada & Hero**.
2. Presiona el botón **Cambiar Foto** o **Añadir Fotografía**.
3. Se abrirá la **Biblioteca Multimedia**. Puedes arrastrar fotos desde tu computadora o celular, o seleccionarlas desde tu galería.
4. Escribe el pie de foto (caption) y selecciona su categoría.
5. Puedes mover fotos hacia arriba o hacia abajo con las flechas de ordenación.

### 4. Cambiar Videos
1. Ve a la pestaña **Videos Oficiales**.
2. Pega el enlace de YouTube del video nuevo. El sistema detecta automáticamente la portada oficial.
3. Si lo prefieres, también puedes subir un video MP4 directamente desde tu dispositivo.
4. Pulsa **Publicar en Vivo**.

### 5. Actualizar Fechas de Shows / Conciertos
1. Ve a la pestaña **Shows & Eventos**.
2. Edita los eventos existentes o pulsa **Añadir Evento**.
3. Configura mes, año, ciudad, recinto y enlace para compra de boletos o acreditación de prensa.
4. Puedes marcar un show con la casilla **Destacado** para resaltarlo con el botón dorado oficial.

### 6. Invitar a Nuevos Administradores o Managers
1. Ve a la pestaña **Invitaciones & Admins**.
2. Selecciona la vigencia del código (24 horas, 7 días o 30 días) y pulsa **Crear Invitación**.
3. Copia el enlace generado y compártelo con la persona. Al abrirlo, podrá crear su propio usuario y contraseña.
4. Puedes revocar cualquier invitación en cualquier momento con un solo clic.

### 7. Recuperar Versiones Anteriores (Rollback)
- Si cometiste un error o quieres volver a una versión anterior del Press Kit, ve a la pestaña **Historial de Versiones** y pulsa **Restaurar en Vivo** o **Cargar en Borrador**.

---

## 🛡️ SEGURIDAD IMPLEMENTADA

- No existen códigos de acceso embebidos en el frontend.
- Todas las rutas `/api/admin/*` y `/api/upload` verifican la sesión en servidor mediante cookies seguras `httpOnly`.
- Validación estricta de extensiones y tamaños de archivo (imágenes hasta 15MB, videos hasta 50MB, documentos hasta 25MB).
- Códigos de invitación protegidos contra reutilización y con caducidad por tiempo.
