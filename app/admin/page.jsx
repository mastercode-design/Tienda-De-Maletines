'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setCargando(true);
    try {
      const res = await fetch('/api/productos');
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.log(error);
    }
    setCargando(false);
  };

  const crearProducto = async (e) => {
    e.preventDefault();
    if (!imagen) return alert('Sube una imagen');
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append('file', imagen);
      const resUpload = await fetch('/api/upload', { method: 'POST', body: formData });
      const { url } = await resUpload.json();

      const nuevoProducto = {
        id: Date.now(),
        nombre,
        precio: Number(precio),
        stock: Number(stock),
        imagen: url
      };

      await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      });

      setNombre(''); setPrecio(''); setStock(''); setImagen(null); e.target.reset();
      cargarProductos();
    } catch (error) {
      console.log(error); alert('Error al crear producto');
    }
    setSubiendo(false);
  };

  const eliminarProducto = async (id, nombre) => {
    if (!confirm(`¿Borrar "${nombre}"?`)) return;
    try {
      const res = await fetch(`/api/productos/${id}`, { method: 'DELETE' });
      if (res.ok) cargarProductos();
    } catch (error) {
      console.log(error);
    }
  };

  if (cargando) return <div className="min-h-screen bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center text-white text-xl">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
          Panel Admin - Tienda de Maletines
        </h1>

        {/* FORM CON COLOR */}
        <form onSubmit={crearProducto} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl mb-10 border border-white/20 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white">Agregar Producto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nombre del producto"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="bg-slate-800/50 border border-purple-500/50 p-3 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 outline-none"
              required
            />
            <input
              type="number"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="bg-slate-800/50 border border-purple-500/50 p-3 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 outline-none"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="bg-slate-800/50 border border-purple-500/50 p-3 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 outline-none"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files[0])}
              className="bg-slate-800/50 border border-purple-500/50 p-3 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-500 file:text-white hover:file:bg-pink-600"
              required
            />
          </div>
          <button
            type="submit"
            disabled={subiendo}
            className="mt-6 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-bold disabled:opacity-50 shadow-lg shadow-pink-500/50 transition-all"
          >
            {subiendo? 'Guardando...' : 'Guardar Producto'}
          </button>
        </form>

        {/* LISTA CON COLOR */}
        <h2 className="text-2xl font-bold mb-6 text-white">Productos Actuales: <span className="text-cyan-400">{productos.length}</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <div key={producto.id} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-xl hover:scale-105 transition-all">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="w-full h-52 object-cover rounded-xl mb-4"
              />
              <h3 className="font-bold text-xl text-white">{producto.nombre}</h3>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">${producto.precio}</p>
              <p className="text-sm text-gray-300 mb-4">Stock: {producto.stock}</p>
              <button
                onClick={() => eliminarProducto(producto.id, producto.nombre)}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg w-full font-bold shadow-lg shadow-red-500/30"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>

        {productos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No hay productos. Crea el primero arriba.</p>
          </div>
        )}
      </div>
    </div>
  );
}