import { Anton, Inter, JetBrains_Mono } from "next/font/google";

// Hood Cats Online identity — a bold "wanted poster" stencil display (Anton),
// unused elsewhere in the hub (distinct from Titan One / Fredoka / Cinzel /
// Orbitron / Bangers / Bungee / Baloo / Bricolage / Space Grotesk).
export const display = Anton({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});
export const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
});
