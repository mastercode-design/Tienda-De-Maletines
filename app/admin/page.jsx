'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  // Formulario
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState(null);

  // Cargar productos al abrir
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
      alert('Error cargando productos');
    }
    setCargando(false);
  };

  const crearProducto = async (e) => {
    e.preventDefault();
    if (!imagen) return alert('Sube una imagen');

    setSubiendo(true);

    try {
      // 1. Subir imagen a Vercel Blob
      const formData = new FormData();
      formData.append('file', imagen);

      const resUpload = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const { url } = await resUpload.json();

      // 2. Guardar producto en KV
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

      alert('Producto creado');
      // Limpiar form
      setNombre('');
      setPrecio('');
      setStock('');
      setImagen(null);
      e.target.reset();
      cargarProductos();

    } catch (error) {
      console.log(error);
      alert('Error al crear producto');
    }
    setSubiendo(false);
  };

  const eliminarProducto = async (id, nombre) => {
    if (!confirm(`¿Borrar "${nombre}"? Esta acción no se puede deshacer.`)) return;

    try {
      const res = await fetch(`/api/productos/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        alert('Producto eliminado');
        cargarProductos();
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      console.log(error);
      alert('Error al eliminar');
    }
  };

  if (cargando) return <div className="p-8">Cargando...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Panel Admin - Tienda de Maletines</h1>

      {/* FORMULARIO CREAR */}
      <form onSubmit={crearProducto} className="bg-gray-100 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Agregar Producto</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImagen(e.target.files[0])}
            className="border p-2 rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={subiendo}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded disabled:bg-gray-400"
        >
          {subiendo? 'Guardando...' : 'Guardar Producto'}
        </button>
      </form>

      {/* LISTA DE PRODUCTOS */}
      <h2 className="text-xl font-bold mb-4">Productos Actuales: {productos.length}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div key={producto.id} className="border rounded-lg p-4 shadow">
            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="w-full h-48 object-cover rounded mb-3"
            />
            <h3 className="font-bold text-lg">{producto.nombre}</h3>
            <p className="text-gray-600">${producto.precio}</p>
            <p className="text-sm text-gray-500">Stock: {producto.stock}</p>
            <button
              onClick={() => eliminarProducto(producto.id, producto.nombre)}
              className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded w-full"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {productos.length === 0 && (
        <p className="text-gray-500 text-center py-8">No hay productos. Crea el primero arriba.</p>
      )}
    </div>
  );
}