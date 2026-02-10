# RideShare - Premium Urban Mobility

![License](https://img.shields.io/badge/License-MIT-blue.svg) ![Next.js](https://img.shields.io/badge/Next.js-14.0-black.svg?logo=next.js&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg?logo=tailwind-css&logoColor=white)

> **Experience the future of urban transport. A seamless, AI-powered ride-hailing platform designed for luxury and efficiency.**

## 📌 Introduction

**RideShare** is a next-generation transportation platform that redefines the booking experience. Built with a "dark-mode first" philosophy, it combines the aesthetic of Uber Black with cutting-edge AI integration. 

Beyond standard booking, RideShare utilizes a sophisticated, SSR-compatible mapping system, live ride simulation state machines, and a premium glassmorphic UI.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server Actions)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) v4, [Shadcn UI](https://ui.shadcn.com/), [Lucide React](https://lucide.dev/)
- **AI Engine:** Azure OpenAI (GPT-4o)
- **Maps & Geocoding:** Leaflet, React-Leaflet, OpenStreetMap, Leaflet-Routing-Machine
- **State Management:** React Context API + Custom Hooks
- **Payments:** Stripe Elements (Simulated Environment)
- **Authentication:** Custom Auth Context (JWT ready)

---

## ✨ Key Features

### 💎 Premium User Experience
- **Monochromatic Aesthetic:** High-contrast Black & White design with subtle "Aurora" gradients.
- **Micro-Interactions:** Smooth Framer Motion transitions and responsive glassmorphism cards.

### 🤖 Dual-Mode AI Assistant
- **Support Mode:** General FAQ and app assistance.
- **Driver Mode:** Simulates a conversation with your driver, once a ride is active. The AI is aware of the ride status (Finding -> Arriving -> In Progress) and responds specifically to your trip details.

### 🚗 Live Ride Simulation
- **Real-time Lifecycle:** Visual progress bar tracking the ride negotiation, driver assignment, arrival, and journey completion.
- **Contextual State:** The map and chat interface update dynamically as the ride progresses through its state machine.

### 📍 Smart Location Services
- **Timeline Input:** Custom-built pickup/dropoff selector with vertical timeline connector.
- **Debounced Search:** Efficient address lookup using OpenStreetMap geocoding.
- **Interactive Map:** Dynamic routing and marker adjustment compatible with Next.js SSR.

### 💲 Dynamic Pricing Engine
- Calculates estimated fares based on real-time distance metrics.
- Multi-tier selection: Economy, Comfort, and Luxury options.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js v18.0.0 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dilpreet579/FJ-FE-R2-Dilpreet-NIT-Delhi
   cd fj-fe-r2-dilpreet-nit-delhi
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and populate it with the following keys:

   | Variable | Description |
   | :--- | :--- |
   | `AZURE_OPENAI_API_KEY` | Key for Azure OpenAI Service |
   | `AZURE_OPENAI_ENDPOINT` | Endpoint URL for your deployment |
   | `AZURE_OPENAI_DEPLOYMENT` | Model deployment name (e.g., gpt-4o) |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Publishable Key |
   | `STRIPE_SECRET_KEY` | Stripe Secret Key |

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📂 Project Structure

```bash
\fj-fe-r2-dilpreet-nit-delhi
├── app/                  # Next.js App Router pages & API routes
│   ├── api/chat/         # AI Chat endpoint (Driver/Support logic)
│   ├── book/             # Ride booking flow page
│   ├── layout.tsx        # Root layout with providers
│   └── page.tsx          # Landing page (Hero, Reviews, Footer)
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn UI primitives (buttons, cards, inputs)
│   ├── ChatWidget.tsx    # Floating AI chat interface
│   ├── Map.tsx           # Leaflet map implementation
│   └── RideInputPanel.tsx # Address search & vehicle selection
├── context/              # Global state (Auth, Ride Status)
├── hooks/                # Custom hooks (e.g., use-toast)
├── lib/                  # Utility functions
└── public/               # Static assets
```

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.