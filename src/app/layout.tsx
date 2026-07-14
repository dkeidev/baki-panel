import "@app/globals.css";
import Providers from "@app/providers";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const htmlClassName = `${GeistSans.variable} ${GeistMono.variable} h-full antialiased scroll-smooth`;
  return (
    <html
      lang="es"
      className={htmlClassName}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <main className="flex grow flex-col w-full">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
