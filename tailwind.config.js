/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      // Keyframe ve animasyon tanımlarını "extend" içine ekliyoruz
      keyframes: {
        // 1) Glow animasyonu
        glow: {
          "0%, 100%": {
            textShadow: "0 0 1px rgba(255, 255, 255, 0.7)",
          },
          "50%": {
            textShadow: "0 0 30px rgba(255, 255, 255, 1)",
          },
        },
        // 2) Animated gradient background (opsiyonel örnek)
        "bg-slide": {
          "0%": {
            backgroundPosition: "0% 50%",
          },
          "50%": {
            backgroundPosition: "100% 50%",
          },
          "100%": {
            backgroundPosition: "0% 50%",
          },
        },
      },
      animation: {
        // Keyframe "glow" ile 2sn aralıksız tekrarlayan loop
        "glow-loop": "glow 4s infinite ease-in-out",
        // Arka planın yatay eksende yumuşakça hareket ettiği animasyon
        "bg-slide-loop": "bg-slide 5s infinite alternate ease-in-out",
      },
    },
  },
  plugins: [],
};
