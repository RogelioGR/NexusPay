# NexusPay 💸

**NexusPay** (anteriormente EndyOS Pay) es una aplicación móvil de finanzas personales diseñada para ofrecer un control absoluto, visual y proactivo sobre compromisos financieros recurrentes. Construida con React Native y Expo, te permite anticipar lo que tienes que pagar y organizar lo que te deben mes a mes sin fricciones.

---

## ✨ Características Principales

*   **📊 Panel de Resumen Dinámico:** Visualiza en tiempo real tu flujo mensual con tres indicadores clave: **Comprometido** (total a pagar), **Pagado** y saldo **Pendiente**.
*   **📅 Calendario Financiero Inteligente:** Cuadrícula mensual interactiva que marca los días de cobro. Utiliza un semáforo visual (Verde = Todo pagado, Naranja = Pendiente) para conocer tu estado financiero de un vistazo.
*   **🔄 Gestión de Suscripciones y Plazos:** Registra gastos fijos infinitos (streaming, gimnasio) y compras a meses. La app calcula automáticamente el progreso, el costo total y el mes exacto de finalización.
*   **🤝 Módulo de Deudas Compartidas:** Lleva el control del dinero prestado o gastos divididos. Genera un "ticket" digital detallado que puedes compartir directamente por WhatsApp u otras redes.
*   **🎨 Altamente Personalizable:** Interfaz moderna con soporte para Modo Oscuro/Claro y selección de colores de acento (Índigo, Esmeralda, Rosa, Ámbar, Cielo).
*   **🔒 Privacidad Local:** Todos los datos se almacenan localmente en tu dispositivo mediante `AsyncStorage`. Incluye opciones para exportar copias de seguridad en formato JSON.

---

## 🛠️ Tecnologías Utilizadas

*   **Framework:** [React Native](https://reactnative.dev/) con [Expo](https://expo.dev/) (Expo Router).
*   **Estilos:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS integrado nativamente).
*   **Iconografía:** `@expo/vector-icons` (FontAwesome6).
*   **Almacenamiento:** `@react-native-async-storage/async-storage`.
*   **UI/UX:** Componentes interactivos (`Pressable`, `Modal`), uso intensivo de `SafeAreaView` para muescas y barra de navegación nativa (Android/iOS).

---

## 📂 Estructura del Proyecto

```text
my-expo-app/
├── app/                  # Navegación y pantallas principales (Expo Router)
│   ├── _layout.tsx       # Bottom Navigation Tabs
│   ├── index.tsx         # Pantalla de Inicio (Resumen y Calendario)
│   ├── debts.tsx         # Pantalla de Deudas Compartidas
│   └── settings.tsx      # Pantalla de Ajustes y Personalización
├── src/
│   ├── components/       # Componentes UI reutilizables (Modales, Tarjetas, Header)
│   ├── context/          # Context API (ThemeContext, AppContext)
│   ├── lib/              # Funciones core (Storage, Theme builders)
│   └── utils/            # Utilidades de formato (Fechas, Monedas)
├── global.css            # Variables y directivas de Tailwind CSS
├── tailwind.config.js    # Configuración de NativeWind
└── package.json          # Dependencias y scripts

<img width="472" height="1024" alt="image" src="https://github.com/user-attachments/assets/597bcc94-c709-46f4-ae87-d260d1205b78" />
