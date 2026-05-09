import { CartProvider } from './context/CartContext'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Tienda de Maletines',
  description: 'Los mejores maletines de Colombia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <footer className="bg-gray-800 text-white p-8 mt-16 text-center">
            <a>
              href="https://instagram.com/@IMPERIOJG19" // 
              target="_blank"
              className="text-xl hover:text-pink-400"
            
              Síguenos en Instagram @tu_usuario
            </a>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}