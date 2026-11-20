import { Cormorant_Garamond, Onest } from "next/font/google";

// Both have Ө ө Ү ү (checked in the Google Fonts cmap).
/** Text, buttons and the big tight headlines: a clean 2026 grotesk. */
export const onest = Onest({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["400", "500", "600", "700"], variable: "--font-onest", display: "swap" });
/** One italic accent word per headline, like the gold serif of the Dr.Rashel and Estelin logos. */
export const cormorant = Cormorant_Garamond({ subsets: ["latin", "cyrillic", "cyrillic-ext"], weight: ["500", "600"], style: ["italic"], variable: "--font-cormorant", display: "swap" });
