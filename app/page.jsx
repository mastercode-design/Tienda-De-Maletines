import { kv } from '@vercel/kv'
import { createProductsDAL } from '@/lib/dal/products'

// ESTAS 3 LÍNEAS MATAN EL CACHÉ PARA SIEMPRE
export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function HomePage() {
  // LEE DIRECTO DE KV - 0% ERRORES DE FETCH
  const db = kv
  const dal = createProductsDAL({ db })
  const productos = await dal.getAll() || []

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* HEADER */}
      <header className="border-b border-gray-800 p-6 sticky top-0 bg-black/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-wider">
              IMPERIO <span className="text-yellow-400">JG19</span>
            </h1>
            <p className="text-gray-400 text-xs md:text-sm tracking-widest">MALETINES PREMIUM</p>
          </div>
          <a 
            href="https://instagram.com" 
            target="_blank"
            className="text-sm text-gray-400 hover:text-yellow-400 transition-colors"
          >
            INSTAGRAM
          </a>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="bg-gradient-to-r from-yellow-400/10 to-transparent border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            COLECCIÓN <span className="text-yellow-400">2026</span>
          </h2>
          <p className="text-gray-400">Diseños exclusivos. Stock limitado.</p>
        </div>
      </section>

      {/* GRID DE PRODUCTOS */}
      <main className="max-w-7xl mx-auto p-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productos.map((producto) => (
            <div 
              key={producto.id} 
              className="group bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-xl overflow-hidden hover:border-yellow-400/50 transition-all duration-300 hover:scale-105"
            >
              {/* IMAGEN */}
              <div className="h-72 bg-white relative overflow-hidden">
                {producto.imagen ? (
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-900">
                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                
                {/* BADGE ULTIMAS UNIDADES */}
                <div className="absolute top-4 left-4">
                  <span className="bg-yellow-400 text-black text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                    ÚLTIMAS 1
                  </span>
                </div>

                {/* BADGE NUEVO */}
                <div className="absolute top-4 right-4">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    NUEVO
                  </span>
                </div>
              </div>

              {/* INFO */}
              <div className="p-5 bg-gradient-to-b from-gray-900/80 to-black">
                <h3 className="text-lg font-bold mb-1 line-clamp-1">{producto.nombre}</h3>
                <p className="text-gray-500 text-xs mb-3">SPRAYGROUND</p>
                
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-3xl font-black text-yellow-400">
                      ${Number(producto.precio).toLocaleString('es-CO')}
                    </p>
                    <p className="text-xs text-gray-600 line-through">
                      ${Math.round(Number(producto.precio) * 1.3).toLocaleString('es-CO')}
                    </p>
                  </div>
                </div>

                <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-3 rounded-lg transition-all duration-200 active:scale-95 shadow-lg shadow-yellow-400/20">
                  AGREGAR AL CARRITO
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SIN PRODUCTOS */}
        {productos.length === 0 && (
          <div className="text-center py-32">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-xl mb-2">No hay productos disponibles</p>
            <p className="text-gray-700 text-sm">Vuelve pronto para ver la nueva colección</p>
          </div>
        )}
      </main>

      {/* CARRITO FLOTANTE - NO TAPA NADA */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="bg-yellow-400 hover:bg-yellow-300 text-black font-black px-6 py-4 rounded-full shadow-2xl shadow-yellow-400/30 flex items-center gap-3 transition-all hover:scale-110">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>CARRITO</span>
          <span className="bg-black text-yellow-400 rounded-full w-6 h-6 flex items-center justify-center text-sm">0</span>
        </button>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-gray-800 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600 text-sm">
          <p>© 2026 IMPERIO JG19. Todos los derechos reservados.</p>
          <p className="mt-2">Envíos a toda Colombia 🇨🇴</p>
        </div>
      </footer>
    </div>
  )
}