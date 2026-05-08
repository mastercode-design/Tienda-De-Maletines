export function createProductsDAL({ db }) {
  return {
    getAll: async () => {
      // LEE DE LA KEY 'productos' - MISMA QUE USA TU DELETE
      return await db.get('productos') || []
    },
    
    create: async (producto) => {
      const productos = await db.get('productos') || []
      productos.push(producto)
      await db.set('productos', productos)
      return producto
    },
    
    delete: async (id) => {
      const productos = await db.get('productos') || []
      const nuevosProductos = productos.filter(p => String(p.id) !== String(id))
      await db.set('productos', nuevosProductos)
      return true
    }
  }
}