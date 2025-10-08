export const metadata = {
  title: 'Flex Reviews Dashboard',
  description: 'Simple reviews dashboard and property page'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-gray-800 bg-black/30">
          <div className="container py-4 flex items-center justify-between">
            <a href="/" className="text-lg font-semibold">Flex Reviews</a>
            <nav className="text-sm text-gray-400">
              <a className="hover:text-white" href="/">Dashboard</a>
            </nav>
          </div>
        </header>
        <main className="container py-6">{children}</main>
        <footer className="container py-10 text-xs text-gray-500">
          Demo app for assessment.
        </footer>
      </body>
    </html>
  );
}
