"use client"
import { useState, useEffect } from 'react'

export default function TiendaMaletines() {
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroPrecio, setFiltroPrecio] = useState('todos')
  const [imagenModal, setImagenModal] = useState(null)
  const [notificacion, setNotificacion] = useState('')

  useEffect(() => {
    const maletines = [
      { id: 1, nombre: 'Maleta Deportiva', precio: 210000, imagen: '/maleta.jpg', stock: 2 },
      { id: 2, nombre: 'Maletin Monastery', precio: 170000, imagen: '/monastery.jpg', stock: 0 },
      { id: 3, nombre: 'Maletin Tiburon', precio: 170000, imagen: '/tiburon.jpg', stock: 0 },
      { id: 4, nombre: 'Conjunto Blanco', precio: 300000, imagen: '/conjuntonblanco.jpg', stock: 1 },
      { id: 5, nombre: 'Canguro o carriel de cuero', precio: 80000, imagen: '/peque.jpg', stock: 1 },
      { id: 6, nombre: 'Tiburon aleta', precio: 170000, imagen: '/tibu.jpg', stock: 1 },
      { id: 7, nombre: 'Maleta deportiva negra', precio: 210000, imagen: '/negra.jpg', stock: 1 },

    ]
    setProductos(maletines)
    setCargando(false)
  }, [])

  const productosFiltrados = productos.filter(p => {
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    const coincidePrecio = filtroPrecio === 'todos' || 
      (filtroPrecio === 'barato' && p.precio < 200000) ||
      (filtroPrecio === 'premium' && p.precio >= 200000)
    return coincideBusqueda && coincidePrecio
  })

  function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.id === producto.id)
    if (existe) {
      setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item))
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
    }
    setNotificacion(`✨ ${producto.nombre} agregado`)
    setTimeout(() => setNotificacion(''), 2000)
  }

  function quitarDelCarrito(id) {
    setCarrito(carrito.filter(item => item.id !== id))
  }

  function cambiarCantidad(id, nuevaCantidad) {
    if (nuevaCantidad === 0) {
      quitarDelCarrito(id)
      return
    }
    setCarrito(carrito.map(item => id === id ? { ...item, cantidad: nuevaCantidad } : item))
  }

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  function comprarPorWhatsApp() {
    const numeroWhatsApp = "573151101628"
    let mensaje = "Hola! Quiero comprar estos maletines:\n\n"
    carrito.forEach(item => {
      mensaje += `• ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString('es-CO')}\n`
    })
    mensaje += `\n*TOTAL: $${total.toLocaleString('es-CO')}*`
    mensaje += `\n\nMi nombre es:`
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl bg-gradient-to-br from-blue-900 to-purple-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">Cargando maletines...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {notificacion && (
        <div className="fixed top-4 right-4 bg-gradient-to-r from-green-400 to-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 animate-bounce font-bold">
          {notificacion}
        </div>
      )}

      {imagenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setImagenModal(null)}>
          <img src={imagenModal} className="max-w-4xl max-h-full rounded-2xl shadow-2xl ring-4 ring-white" />
          <button className="absolute top-4 right-4 text-white text-5xl font-bold hover:scale-125 transition">×</button>
        </div>
      )}

      <header className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white p-6 shadow-2xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              Tu Tienda de Maletines
            </h1>
            <p className="text-blue-200 mt-2 text-lg font-semibold animate-pulse">⚡ Calidad y estilo pa llevar todo ⚡</p>
          </div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-5 py-3 rounded-full font-black text-xl shadow-lg hover:scale-110 transition">
            🛒 {totalItems}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            ✨ Nuestros Maletines ✨
          </h2>
          
          <input 
            type="text"
            placeholder="🔍 Busca tu maletín ideal..."
            className="w-full p-4 border-3 border-purple-300 rounded-xl mb-4 focus:border-pink-500 focus:ring-4 focus:ring-pink-200 outline-none text-lg font-semibold shadow-md transition"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <div className="flex gap-3 mb-6 flex-wrap">
            <button onClick={() => setFiltroPrecio('todos')} className={`px-5 py-3 rounded-xl font-black transition hover:scale-105 ${filtroPrecio === 'todos' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`}>
              🌟 Todos
            </button>
            <button onClick={() => setFiltroPrecio('barato')} className={`px-5 py-3 rounded-xl font-black transition hover:scale-105 ${filtroPrecio === 'barato' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`}>
              💸 Menos de $200k
            </button>
            <button onClick={() => setFiltroPrecio('premium')} className={`px-5 py-3 rounded-xl font-black transition hover:scale-105 ${filtroPrecio === 'premium' ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100 shadow'}`}>
              👑 Premium +$200k
            </button>
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">No encontramos maletines con "{busqueda}" 😢</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {productosFiltrados.map(producto => (
                <div key={producto.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-purple-300">
                  <div className="relative">
                    <img src={producto.imagen} alt={producto.nombre} onClick={() => setImagenModal(producto.imagen)} className="w-full h-56 object-cover cursor-pointer hover:opacity-90 transition hover:scale-105" />
                    {producto.stock === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                        <span className="text-white text-3xl font-black bg-gradient-to-r from-red-500 to-pink-600 px-6 py-2 rounded-xl animate-pulse">AGOTADO</span>
                      </div>
                    )}
                    {producto.stock > 0 && producto.stock < 4 && (
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-black shadow-lg animate-bounce">
                        🔥 ¡Últimas {producto.stock}!
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-black mb-2 bg-gradient-to-r from-gray-800 to-blue-900 bg-clip-text text-transparent">{producto.nombre}</h3>
                    <p className="text-sm font-bold text-orange-600 mb-3 animate-pulse">
                      👀 {Math.floor(Math.random() * 15) + 5} personas vieron esto hoy
                    </p>
                    <p className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2">
                      ${producto.precio.toLocaleString('es-CO')}
                    </p>
                    <p className="text-sm font-bold text-purple-600 mb-4">
                      {producto.stock > 0 ?` ✅ ${producto.stock} disponibles` : '❌ Sin stock'}
                    </p>
                    <button 
                      onClick={() => agregarAlCarrito(producto)}
                      disabled={producto.stock === 0}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 active:scale-95 text-white py-4 rounded-xl font-black text-lg shadow-lg hover:shadow-2xl transition duration-150"
                    >
                      {producto.stock > 0 ? '🛒 Agregar al carrito' : '😢 Agotado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-white to-blue-50 border-4 border-purple-500 rounded-2xl shadow-2xl p-6 h-fit sticky top-28">
          <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🛒 Tu Carrito ({totalItems})
          </h2>
          
          {carrito.length === 0 ? (
            <p className="text-gray-600 text-center py-8 font-bold text-lg">Tu carrito está vacío 🥺</p>
          ) : (
            <>
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {carrito.map(item => (
                  <div key={item.id} className="pb-4 border-b-2 border-purple-200 bg-white rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{item.nombre}</p>
                        <p className="text-sm font-semibold text-blue-600">${item.precio.toLocaleString('es-CO')} c/u</p>
                      </div>
                      <button onClick={() => quitarDelCarrito(item.id)} className="text-red-500 hover:text-red-700 font-black text-2xl hover:scale-125 transition">✕</button>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 w-9 h-9 rounded-lg font-black transition hover:scale-110">-</button>
                      <span className="font-black text-lg w-8 text-center">{item.cantidad}</span>
                      <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)} className="bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 w-9 h-9 rounded-lg font-black transition hover:scale-110">+</button>
                      <p className="ml-auto font-black text-lg text-green-600">${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t-4 border-purple-300">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-black text-gray-800">Total:</span>
                  <span className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    ${total.toLocaleString('es-CO')}
                  </span>
                </div>
                <button onClick={comprarPorWhatsApp} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 active:scale-95 text-white py-5 rounded-xl font-black text-xl shadow-2xl hover:shadow-green-500/50 transition">
                  📱 Pedir por WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <footer className="bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 text-white p-8 mt-12 text-center">
        <p className="text-xl font-bold bg-gradient-to-r from-yellow-300 to-pink-400 bg-clip-text text-transparent">© 2026 Tu Tienda de Maletines - Cali, Colombia 🇨🇴</p>
      </footer>
    </div>
  )
}
