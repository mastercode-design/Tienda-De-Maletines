"use client"
import { useState, useEffect } from 'react'

export default function TiendaMaletines() {
  const [productos, setProductos] = useState([])
  const [carrito, setCarrito] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [imagenModal, setImagenModal] = useState(null)
  const [notificacion, setNotificacion] = useState('')

  useEffect(() => {
    fetch('/api/productos')
      .then(res => res.json())
      .then(data => {
        setProductos(Array.isArray(data) ? data : [])
        setCargando(false)
      })
      .catch(() => {
        setProductos([])
        setCargando(false)
      })
  }, [])

  const productosFiltrados = (productos || []).filter(p => 
    p?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  )

  function agregarAlCarrito(producto) {
    const existe = carrito.find(item => item.id === producto.id)
    if (existe) {
      setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item))
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }])
    }
    setNotificacion(`Agregado: ${producto.nombre}`)
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
    setCarrito(carrito.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item))
  }

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0)

  function comprarPorWhatsApp() {
    const numeroWhatsApp = "573053680666"
    let mensaje = "Hola ImperioJG19, quiero comprar:\n\n"
    carrito.forEach(item => {
      mensaje += `• ${item.nombre} x${item.cantidad} = $${(item.precio * item.cantidad).toLocaleString('es-CO')}\n`
    })
    mensaje += ` \n*TOTAL: $${total.toLocaleString('es-CO')}*`
    mensaje += `\n\nNombre completo:`
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-500 text-sm tracking-[0.3em] uppercase">Cargando</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {notificacion && (
        <div className="fixed top-6 right-6 bg-white text-black px-6 py-3 z-50 text-sm uppercase tracking-wider">
          {notificacion}
        </div>
      )}

      {imagenModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" onClick={() => setImagenModal(null)}>
          <img src={imagenModal} className="max-w-5xl max-h-full object-contain" />
          <button className="absolute top-8 right-8 text-white text-3xl font-thin">×</button>
        </div>
      )}

      {/* HEADER */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-thin tracking-[0.2em] uppercase">
              IMPERIO <span className="text-yellow-500">JG19</span>
            </h1>
            <p className="text-white/40 text-xs tracking-[0.3em] uppercase mt-1">Maletines Premium</p>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href="https://instagram.com/IMPERIOJG19"
              target="_blank"
              className="text-white/60 hover:text-yellow-500 transition text-sm uppercase tracking-wider"
            >
              Instagram
            </a>
            <div className="border border-yellow-500/30 px-4 py-2 text-sm tracking-wider">
              {totalItems} ITEMS
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* PRODUCTOS */}
        <div className="lg:col-span-3">
          <div className="mb-12">
            <h2 className="text-5xl font-thin mb-2 tracking-tight">Colección</h2>
            <div className="w-20 h-[1px] bg-yellow-500 mb-8"></div>
            
            <input 
              type="text"
              placeholder="Buscar..."
              className="w-full bg-transparent border-b border-white/20 px-0 py-3 focus:border-yellow-500 outline-none text-lg font-light placeholder:text-white/30 transition"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {productosFiltrados.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-white/40 text-sm uppercase tracking-[0.3em]">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
              {productosFiltrados.map(producto => (
                <div key={producto.id} className="group bg-[#111111] border border-white/5 hover:border-yellow-500/30 transition duration-500">
                  <div className="relative overflow-hidden aspect-square">
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre} 
                      onClick={() => setImagenModal(producto.imagen)} 
                      className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition duration-700" 
                    />
                    {producto.stock === 0 && (
                      <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
                        <span className="text-white text-sm uppercase tracking-[0.3em] border border-white px-6 py-2">Agotado</span>
                      </div>
                    )}
                    {producto.stock > 0 && producto.stock < 3 && (
                      <div className="absolute top-4 left-4 bg-yellow-500 text-black px-3 py-1 text-[10px] uppercase tracking-widest">
                        Últimas {producto.stock}
                      </div>
                    )}
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-light mb-3 tracking-wide">{producto.nombre}</h3>
                    <p className="text-3xl font-thin text-yellow-500 mb-6 tracking-tight" suppressHydrationWarning>
                      ${producto.precio.toLocaleString('es-CO')}
                    </p>
                    <button 
                      onClick={() => agregarAlCarrito(producto)}
                      disabled={producto.stock === 0}
                      className="w-full border border-white/20 hover:border-yellow-500 hover:bg-yellow-500 hover:text-black disabled:border-white/10 disabled:text-white/30 text-white py-4 text-sm uppercase tracking-[0.3em] transition duration-300"
                    >
                      {producto.stock > 0 ? 'Agregar' : 'Agotado'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CARRITO */}
        <div className="lg:sticky lg:top-28 h-fit">
          <div className="border border-white/10 bg-[#111111] p-8">
            <h2 className="text-xl font-thin mb-8 uppercase tracking-[0.3em] border-b border-white/10 pb-4">
              Carrito
            </h2>
            
            {carrito.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-12 uppercase tracking-wider">Vacío</p>
            ) : (
              <>
                <div className="space-y-6 mb-8 max-h-96 overflow-y-auto">
                  {carrito.map(item => (
                    <div key={item.id} className="pb-6 border-b border-white/5">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-4">
                          <p className="font-light text-sm">{item.nombre}</p>
                          <p className="text-xs text-white/40 mt-1" suppressHydrationWarning>${item.precio.toLocaleString('es-CO')}</p>
                        </div>
                        <button onClick={() => quitarDelCarrito(item.id)} className="text-white/40 hover:text-yellow-500 text-xl font-thin">×</button>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => cambiarCantidad(item.id, item.cantidad - 1)} className="border border-white/20 w-8 h-8 text-sm hover:border-yellow-500 transition">-</button>
                        <span className="text-sm w-6 text-center">{item.cantidad}</span>
                        <button onClick={() => cambiarCantidad(item.id, item.cantidad + 1)} className="border border-white/20 w-8 h-8 text-sm hover:border-yellow-500 transition">+</button>
                        <p className="ml-auto text-sm text-yellow-500" suppressHydrationWarning>${(item.precio * item.cantidad).toLocaleString('es-CO')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="pt-6 border-t border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm uppercase tracking-[0.3em] text-white/60">Total</span>
                    <span className="text-2xl font-thin text-yellow-500" suppressHydrationWarning>
                      ${total.toLocaleString('es-CO')}
                    </span>
                  </div>
                  <button onClick={comprarPorWhatsApp} className="w-full bg-yellow-500 hover:bg-yellow-400 text-black py-4 text-sm uppercase tracking-[0.3em] transition">
                    WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <p className="text-white/40 text-xs uppercase tracking-[0.3em]">2026 IMPERIOJG19, Cali-Colombia</p>
        </div>
      </footer>
    </div>
  )
}