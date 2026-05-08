export const revalidate = 0 // ← Desactiva caché de Next.js en esta página

export default async function HomePage() {
  // FETCH SIN CACHÉ - Siempre trae datos frescos de KV
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/productos`, { 
    cache: 'no-store', // ← Mata el caché del fetch
    next: { revalidate: 0 } // ← Doble seguro contra caché
  })
  
  const productos = await res.json()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-5xl font-black tracking-wider">
              IMPERIO <span className="text-yellow-400">JG19</span>
            </h1>
            <p className="text-gray-400 text-sm tracking-widest">MALETINES PREMIUM</p>
          </div>
          <nav className="text-sm text-gray-400 hover:text-white">
            INSTAGRAM
          </nav>
        </div>
      </header>

      {/* PRODUCTOS */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div 
              key={producto.id} 
              className="bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-lg overflow-hidden"
            >
              {/* IMAGEN */}
              <div className="h-64 bg-gray-900 relative">
                {producto.imagen ? (
                  <img 
                    src={producto.imagen} 
                    alt={producto.nombre}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    Sin imagen
                  </div>
                )}
                {/* ETIQUETA ULTIMAS */}
                <div className="absolute bottom-4 left-4">
                  <span className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded">
                    ULTIMAS 1
                  </span>
                </div>
              </div>

              {/* INFO */}
              <div className="p-6 bg-gradient-to-b from-gray-900/50 to-black">
                <h3 className="text-xl font-bold mb-2">{producto.nombre}</h3>
                <p className="text-3xl font-black text-yellow-400 mb-4">
                  ${Number(producto.precio).toLocaleString('es-CO')}
                </p>
                <button className="w-full border border-gray-600 hover:bg-white hover:text-black text-white font-bold py-3 rounded transition-all duration-200">
                  AGREGAR
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* SI NO HAY PRODUCTOS */}
        {productos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No hay productos disponibles</p>
          </div>
        )}
      </main>

      {/* CARRITO LATERAL - Si lo tienes */}
      <aside className="fixed right-0 top-0 h-screen w-80 bg-gray-900 border-l border-gray-800 p-6 hidden lg:block">
        <h2 className="text-2xl font-black mb-6">CARRITO</h2>
        <p className="text-gray-500 text-center mt-20">VACÍO</p>
      </aside>
    </div>
  )
}