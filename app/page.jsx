const comprimirImagen = (file) => {
    return new Promise((resolve) => {
      if (file.size < 500000) { // Si pesa menos de 500KB, no comprimir
        resolve(file)
        return
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 1200
          const scaleSize = Math.min(MAX_WIDTH / img.width, 1)
          canvas.width = img.width * scaleSize
          canvas.height = img.height * scaleSize

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

          canvas.toBlob((blob) => {
            if (!blob) {
              resolve(file) // Si falla, sube original
              return
            }
            const nuevoArchivo = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(nuevoArchivo)
          }, 'image/jpeg', 0.8)
        }
      }
    })
  }