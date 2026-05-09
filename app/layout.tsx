import { CartProvider } from './context/CartContext'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Imperio JG19 - Maletines Premium',
  description: 'Los mejores maletines de Colombia',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>
          {children}
          
          <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                
                <div>
                  <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Imperio JG19
                  </h3>
                  <p className="text-gray-300">Diseños exclusivos y calidad premium</p>
                  <p className="text-gray-400 mt-2">📍 Cali, Colombia</p>
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-4">Síguenos</h4>
                  <a
                    href="https://instagram.com/ImperioJG19" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg"
                  >
                    📸 Instagram @ImperioJG19
                  </a>
                </div>

                <div>
                  <h4 className="text-xl font-bold mb-4">Contacto Directo</h4>
                  <a
                    href="https://wa.me/573053680666" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg"
                  >
                    💬 WhatsApp: 305 3680666
                  </a>
                </div>
              </div>
              
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>© 2026 Imperio JG19. Todos los derechos reservados.</p>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  )
}