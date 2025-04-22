
# 🎬 Netflix Filter Panel

Una extensión de navegador que te permite **filtrar películas y series en Netflix** por estado: vistas, no vistas, favoritas y más. Diseñada como una interfaz flotante sencilla y eficiente, completamente hecha con **React + Vite**.

---

## 🚀 Funcionalidades (versión MVP)
- ✅ Popup React básico accesible desde el icono.
- ✅ Estructura preparada para inyección en Netflix.
- ⚙️ Preparado para guardar datos localmente (en próximos días).

---

## 🧠 Tecnologías utilizadas
- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- Manifest V3 para extensiones de Chrome/Edge

---

## 🛠 Instalación para desarrollo

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/netflix-extension.git
cd netflix-extension
```

2. Instala dependencias:
```bash
npm install
```

3. Compila el proyecto:
```bash
npm run build
```

4. Carga la extensión en Chrome/Edge:
- Ve a `chrome://extensions/`
- Activa **Modo desarrollador**
- Haz clic en **“Cargar descomprimida”**
- Selecciona la carpeta `/dist`

---

## 📂 Estructura del proyecto
```
src/
├── popup.jsx        → Popup React mostrado desde el icono
├── inject.js        → Código inyectado directamente en Netflix (Día 2)
├── background.js    → Service Worker para lógica en segundo plano

public/
└── icon.png         → Icono de la extensión

popup.html           → HTML para el popup
manifest.json        → Configuración de la extensión
vite.config.js       → Configuración del build
```

---

## 🧪 En desarrollo
Próximas funciones:
- Filtro dentro de Netflix
- Marcar contenido automáticamente como visto
- Estadísticas personales
- Sincronización en la nube (Firebase o similar)

---


## 🧑‍💻 Autor
Desarrollado por emepuchades — 2025