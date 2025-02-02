import { defineStore } from 'pinia'
import { URI } from '../service/conection'

export const usecartStore = defineStore('salchimonster-cart-new', {
  persist: {
    key: 'salchimonster-cart-new',
    storage: localStorage,
    paths: ['cart', 'last_order', 'menu'],
  },
  state: () => ({
    currentProduct: {},
    currentSection: {},
    currentVideoIndex: 0,
    currentVideoTime: 0,

    visibles: {
      currentProduct: false,
      addAdditionToCart: false,
      last_order: '',
    },

    cart: [],
    last_order: '',
    sending_order: false,
    was_reserva: false,
    menu: {}
  }),

  getters: {
    cartTotal(state) {
      return state.cart.reduce((acc, item) => acc + item.pedido_precio, 0)
    },
    // Getter para verificar si existe un producto por ID en el carrito
    isProductInCart: (state) => (productId) => {
      return state.cart.some((item) => {
        return item.pedido_productoid === productId
      })
    },

    // (Esta parecía repetida en tu código original)
    isProductInCart2: (state) => (productId) => {
      return state.cart.products?.some((product) => {
        return product.product.productogeneral_id === productId
      })
    },

    // Ejemplo de getter para calcular el total de un producto fuera de las actions
    getProductTotal: () => (product, additionalItems = [], quantity = 1) => {
      // Si el combo ya tiene su precio final, NO sumamos sus "sub-productos"
      // sino que solo usamos el precio general y los adicionales.
      let total = 0
      const productBasePrice = parseFloat(product.productogeneral_precio) || 0
      total += productBasePrice * quantity

      // Adicionales (si aplica)
      if (additionalItems && additionalItems.length > 0) {
        additionalItems.forEach(ad => {
          const adPrice    = parseFloat(ad.price) || 0
          const adQuantity = parseFloat(ad.quantity) || 1
          total += adPrice * adQuantity
        })
      }

      return total
    },
  },

  actions: {
    // Manejo de videos (mantén lo tuyo)
    setCurrentVideoIndex(index) {
      this.currentVideoIndex = index
    },
    setCurrentVideoTime(time) {
      this.currentVideoTime = time
    },

    // Manejo de visibilidad y currentProduct
    setCurrentProduct(product) {
      this.currentProduct = product
    },
    setVisible(item, status) {
      this.visibles[item] = status
    },

    // Helpers para combos y productos
    getProductId(product) {
      if (product.producto_id) {
        return product.producto_id
      } else if (
        product.lista_presentacion &&
        product.lista_presentacion.length > 0 &&
        product.lista_presentacion[0].producto_id
      ) {
        return product.lista_presentacion[0].producto_id
      } else {
        console.error('No valid product ID found for product:', product)
        return null
      }
    },

    getProductPrice(product) {
      // Si el combo ya está en productogeneral_precio, lo usamos directamente
      const generalPrice      = parseFloat(product.productogeneral_precio)
      const presentationPrice = parseFloat(product.lista_presentacion?.[0]?.producto_precio)
      return generalPrice || presentationPrice || 0
    },

    /**
     * Cálculo centralizado del precio total
     * NOTA: Ya NO sumamos combos, asumiendo que el "combo" ya tiene
     * su precio completo en productogeneral_precio.
     */
    calculateTotalPrice(product, quantity, modificadores = []) {
      // 1. Precio base del producto (combo o no combo)
      const basePrice = this.getProductPrice(product)
      let total = basePrice * quantity

      // 2. Sumamos solamente modificadores (adicionales)
      modificadores.forEach((mod) => {
        const modPrice    = parseFloat(mod.pedido_precio) || 0
        const modQuantity = parseFloat(mod.modificadorseleccion_cantidad) || 0
        total += modPrice * modQuantity
      })

      return total
    },

    // Agregar producto al carrito
    addProductToCart(product, quantity = 1, additionalItems = []) {
      // Creamos una "firma" que represente el producto y sus adicionales
      const signatureObject = {
        productId: this.getProductId(product),
        additions: additionalItems.map(ad => ({
          group_id: ad.group_id,
          id: ad.id,
          quantity: ad.quantity
        }))
      }
      const signatureString = JSON.stringify(signatureObject)

      // Buscar si ya existe en el carrito
      const existingProductIndex = this.cart.findIndex(
        (item) => item.signature === signatureString
      )

      if (existingProductIndex !== -1) {
        // Ya existe: actualizar
        const existingItem = this.cart[existingProductIndex]
        existingItem.pedido_cantidad += quantity

        // Mezclar modificadores
        additionalItems.forEach((newMod) => {
          const modIndex = existingItem.modificadorseleccionList.findIndex((oldMod) => {
            return (
              oldMod.modificador_id === newMod.group_id &&
              oldMod.modificadorseleccion_id === newMod.id &&
              oldMod.pedido_productoid === newMod.parent_id
            )
          })

          if (modIndex !== -1) {
            // sumamos la cantidad
            existingItem.modificadorseleccionList[modIndex].modificadorseleccion_cantidad +=
              parseFloat(newMod.quantity) || 0
          } else {
            // agregamos
            existingItem.modificadorseleccionList.push({
              modificadorseleccion_cantidad: parseFloat(newMod.quantity) || 1,
              pedido_precio: parseFloat(newMod.price) || 0,
              modificador_id: newMod.group_id,
              modificadorseleccion_id: newMod.id,
              modificador_nombre: newMod.name,
              pedido_productoid: newMod.parent_id,
            })
          }
        })

        // Recalcular el total
        const recalculatedPrice = this.calculateTotalPrice(
          product,
          existingItem.pedido_cantidad,
          existingItem.modificadorseleccionList
        )
        existingItem.pedido_precio = recalculatedPrice

        this.cart[existingProductIndex] = existingItem
        console.log('Producto actualizado en el carrito:', existingItem)

      } else {
        // Nuevo producto
        const lista_productocombo = product.lista_productobase
          ? product.lista_productobase.map((comboItem) => ({
              pedido_productoid: parseInt(comboItem.producto_id),
              pedido_cantidad: parseFloat(comboItem.productocombo_cantidad) || 1,
              pedido_precio: parseFloat(comboItem.productocombo_precio) || 0,
              pedido_nombre: comboItem.producto_descripcion
            }))
          : []

        const modificadorseleccionList = additionalItems.map((ad) => ({
          modificadorseleccion_cantidad: parseFloat(ad.quantity) || 1,
          pedido_precio: parseFloat(ad.price) || 0,
          modificador_id: ad.group_id,
          modificadorseleccion_id: ad.id,
          modificador_nombre: ad.name,
          pedido_productoid: ad.parent_id,
        }))

        const pedidoCantidad = parseFloat(quantity) || 1

        // Calculamos precio total (SIN sumar combo items manualmente)
        const totalPrice = this.calculateTotalPrice(
          product,
          pedidoCantidad,
          modificadorseleccionList
        )

        const pedido = {
          signature: signatureString,
          pedido_productoid: this.getProductId(product),
          pedido_cantidad: pedidoCantidad,
          pedido_precio: totalPrice,
          pedido_base_price: this.getProductPrice(product),
          pedido_escombo: product.productogeneral_escombo,
          productogeneral_urlimagen: product.productogeneral_urlimagen,
          pedido_nombre_producto: product.productogeneral_descripcion,

          // Se guarda por si quieres mostrar la composición del combo,
          // pero NO se usa para incrementar el precio en "calculateTotalPrice"
          lista_productocombo,
          modificadorseleccionList
        }

        this.cart.push(pedido)
        console.log('Producto agregado al carrito:', pedido)
      }
    },

    removeProductFromCart(signature) {
      const index = this.cart.findIndex(item => item.signature === signature)
      if (index !== -1) {
        this.cart.splice(index, 1)
        console.log(`Producto con signature ${signature} eliminado del carrito.`)
      } else {
        console.warn(`Producto con signature ${signature} no encontrado en el carrito.`)
      }
    },

    // Decrementar la cantidad de un producto
    decrementProduct(signature) {
      const itemIndex = this.cart.findIndex((item) => item.signature === signature)
      if (itemIndex === -1) return

      const currentItem = this.cart[itemIndex]
      if (currentItem.pedido_cantidad <= 1) {
        // Si bajamos a 0, lo sacamos del carrito
        this.cart.splice(itemIndex, 1)
        return
      }

      const oldQuantity = currentItem.pedido_cantidad
      currentItem.pedido_cantidad -= 1

      // Ajustar modificadores de forma proporcional
      currentItem.modificadorseleccionList.forEach((mod) => {
        const adPorProducto = mod.modificadorseleccion_cantidad / oldQuantity
        mod.modificadorseleccion_cantidad = Math.round(
          adPorProducto * currentItem.pedido_cantidad
        )
      })

      // Recalcular
      // Como en la firma solo guardamos IDs, usamos currentProduct si coincide
      const parsedSignature = JSON.parse(currentItem.signature)
      let productToUse = this.currentProduct
      if (this.getProductId(productToUse) !== parsedSignature.productId) {
        console.warn('No coincide la ID del combo en currentProduct, precio podría no recalcularse bien.')
      }

      currentItem.pedido_precio = this.calculateTotalPrice(
        productToUse,
        currentItem.pedido_cantidad,
        currentItem.modificadorseleccionList
      )

      this.cart[itemIndex] = currentItem
    },

    // Incrementar la cantidad de un producto
    incrementProduct(signature) {
      const itemIndex = this.cart.findIndex((item) => item.signature === signature)
      if (itemIndex === -1) return

      const currentItem = this.cart[itemIndex]
      const oldQuantity = currentItem.pedido_cantidad

      currentItem.pedido_cantidad += 1

      // Ajustar modificadores de forma proporcional
      currentItem.modificadorseleccionList.forEach((mod) => {
        const adPorProducto = mod.modificadorseleccion_cantidad / oldQuantity
        mod.modificadorseleccion_cantidad = Math.round(
          adPorProducto * currentItem.pedido_cantidad
        )
      })

      // Recalcular
      const parsedSignature = JSON.parse(currentItem.signature)
      let productToUse = this.currentProduct
      if (this.getProductId(productToUse) !== parsedSignature.productId) {
        console.warn('No coincide la ID en currentProduct, precio podría no recalcularse bien.')
      }

      currentItem.pedido_precio = this.calculateTotalPrice(
        productToUse,
        currentItem.pedido_cantidad,
        currentItem.modificadorseleccionList
      )

      this.cart[itemIndex] = currentItem
    },

    // Incrementar la cantidad de un adicional específico
    incrementAdditional(signature, additionalItem) {
      const itemIndex = this.cart.findIndex((item) => item.signature === signature)
      if (itemIndex === -1) return

      const currentItem = this.cart[itemIndex]

      // 1. Buscar el modificador
      const modIndex = currentItem.modificadorseleccionList.findIndex((mod) => mod === additionalItem)

      // 2. Ajustar la cantidad
      if (modIndex !== -1) {
        // Sumar 1
        currentItem.modificadorseleccionList[modIndex].modificadorseleccion_cantidad += 1
      } else {
        // Si no existe, lo creamos con 1
        currentItem.modificadorseleccionList.push({
          modificadorseleccion_cantidad: 1,
          pedido_precio: parseFloat(additionalItem.price) || 0,
          modificador_id: additionalItem.group_id,
          modificadorseleccion_id: additionalItem.id,
          modificador_nombre: additionalItem.name,
          pedido_productoid: additionalItem.parent_id,
        })
      }

      // 3. Recalcular
      const parsedSignature = JSON.parse(currentItem.signature)
      let productToUse = this.currentProduct
      if (this.getProductId(productToUse) !== parsedSignature.productId) {
        console.warn('No coincide la ID en currentProduct, precio podría no recalcularse bien.')
      }

      currentItem.pedido_precio = this.calculateTotalPrice(
        productToUse,
        currentItem.pedido_cantidad,
        currentItem.modificadorseleccionList
      )

      this.cart[itemIndex] = currentItem
    },

    // Decrementar la cantidad de un adicional específico
    decrementAdditional(signature, additionalItem) {
      const itemIndex = this.cart.findIndex((item) => item.signature === signature)
      if (itemIndex === -1) return

      const currentItem = this.cart[itemIndex]

      const modIndex = currentItem.modificadorseleccionList.findIndex((mod) => mod === additionalItem)
      if (modIndex !== -1) {
        currentItem.modificadorseleccionList[modIndex].modificadorseleccion_cantidad -= 1

        // Eliminar si llega a 0
        if (currentItem.modificadorseleccionList[modIndex].modificadorseleccion_cantidad <= 0) {
          currentItem.modificadorseleccionList.splice(modIndex, 1)
        }
      }

      const parsedSignature = JSON.parse(currentItem.signature)
      let productToUse = this.currentProduct
      if (this.getProductId(productToUse) !== parsedSignature.productId) {
        console.warn('No coincide la ID en currentProduct, precio podría no recalcularse bien.')
      }

      currentItem.pedido_precio = this.calculateTotalPrice(
        productToUse,
        currentItem.pedido_cantidad,
        currentItem.modificadorseleccionList
      )

      this.cart[itemIndex] = currentItem
    },

    // ------------------------------------------------------------------------------------
    // Las siguientes acciones se mantienen tal cual estaban, vacías o a tu conveniencia.
    // ------------------------------------------------------------------------------------
    incrementAdditionQuantity(additionId) {},
    removeAdditionCompletelyFromCart(additionId) {},
    decrementAdditionQuantity(additionId) {},
    addAdditionalItem(productId, additionalItem) {},
    removeAdditionalItem(productId, additionalItemId) {},
    groupAdditionalItems(additionalItems) {},
    calculateProductTotal(product, quantity, additionalItems) {},
    removeProductInstance(productId) {},
    calculateCartTotal() {},
    addAdditionToCart(addition) {},
    removeAdditionFromCart(additionId) {},
  },
})
