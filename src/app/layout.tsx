import type { Metadata } from "next";
import { Passion_One, DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
export const runtime = "edge";

const passionOne = Passion_One({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-passion'
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  style: "normal",
  variable: '--dm-sans'
})

export const metadata: Metadata = {
  title: "Trmit!",
  description: "Acortador de links",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en" suppressHydrationWarning
      className={`${dmSans.className} ${passionOne.variable} h-full antialiased`}
    >
      <body className="antialiased bg-white text-zinc-900 dark:bg-[#161616] dark:text-white transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
