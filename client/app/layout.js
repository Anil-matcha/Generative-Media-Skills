import './globals.css';

export const metadata = {
  title: 'Open Dots — Open-Source Alternative to OpenAI Dots',
  description: 'Open-source alternative to OpenAI Dots: a self-hosted AI workspace for chat, tools, approvals, connectors, and computer tasks.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body className="bg-background text-foreground antialiased select-none" suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
