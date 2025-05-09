

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen">
        <div className="max-w-screen-xl mx-auto px-4">{children}</div>
      </body>
    </html>
  );
}