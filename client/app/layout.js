import './globals.css';

export const metadata = {
  title: 'Open Dots — Self-Hosted AI Workspace',
  description: 'A self-hosted AI workspace for chat, tools, and governed computer tasks.',
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
