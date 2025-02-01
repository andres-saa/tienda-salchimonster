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
    currentSection:{},
    currentVideoIndex: 0,
    currentVideoTime: 0,


    visibles: {
      currentProduct: false,
      addAdditionToCart: false,
      last_order: '',
    },
    cart: []
      ,
    last_order: '',
    sending_order: false,
    was_reserva: false,
    menu: {}
     
  
  }),

  getters: {
 
    cartTotal(state) {
      return state.cart.reduce((acc, item) => acc + item.pedido_precio, 0)
    },
    // Ejemplo de getter para saber si existe un producto por ID en el carrito
    isProductInCart: (state) => (productId) => {
      return state.cart.some((item) => {
        // Podrías comparar con tu lógica, aquí se compara con pedido_productoid
        return item.pedido_productoid === productId
      })
    },

    totalAdditions: (state) => {
      
    },
    isProductInCart: (state) => (productId) => {
      return state.cart.products.some((product) => product.product.productogeneral_id === productId)
    },
    getProductTotal: () => (product, additionalItems = [], quantity = 1) => {
        let total = 0
        
        // Ejemplo: si tu producto tiene un campo "productogeneral_precio"
        // o necesitas parsear un precio con tu método getProductPrice(product).
        const productBasePrice = parseFloat(product.productogeneral_precio) || 0
        total += productBasePrice * quantity
  
        // Si el producto es un combo y tiene lista de productos base:
        if (product.lista_productobase && product.lista_productobase.length > 0) {
          product.lista_productobase.forEach(comboItem => {
            const comboItemPrice = parseFloat(comboItem.productocombo_precio) || 0
            const comboItemQty   = parseInt(comboItem.productocombo_cantidad) || 0
            total += comboItemPrice * comboItemQty
          })
        }
  
        // Adicionales
        if (additionalItems && additionalItems.length > 0) {
          additionalItems.forEach(ad => {
            const adPrice    = parseFloat(ad.price) || 0
            const adQuantity = parseInt(ad.quantity) || 1
            total += adPrice * adQuantity
          })
        }
  
        return total
      },

  },

  actions: {
    incrementAdditionQuantity(additionId) {
    
    },
     setCurrentVideoIndex(index) {
      this.currentVideoIndex = index;
    },
    setCurrentVideoTime(time) {
        this.currentVideoTime = time;
      },
    
    removeAdditionCompletelyFromCart(additionId) {
     
    },

    decrementAdditionQuantity(additionId) {
   
    },

    setCurrentProduct(product) {
      this.currentProduct = product
    },

    setVisible(item, status) {
      this.visibles[item] = status
    },
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
          return null // Or throw an error if appropriate
        }
      },

      addProductToCart(product, quantity = 1, additionalItems = []) {
        // 1. Generar la signature
        const signatureObject = { product, additionalItems };
        const signatureString = JSON.stringify(signatureObject);
      
        // 2. Buscar si ya existe un producto con la misma signature
        const existingProductIndex = this.cart.findIndex(
          (item) => item.signature === signatureString
        );
      
        // 3. Si existe, actualizarlo
        if (existingProductIndex !== -1) {
          // Obtener el producto existente del carrito
          const existingItem = this.cart[existingProductIndex];
      
          // Aumentar la cantidad del producto base
          existingItem.pedido_cantidad += quantity;
      
          // Aumentar/mezclar modificadores
          additionalItems.forEach((newMod) => {
            // Buscamos si el modificador ya existe en la lista
            const modIndex = existingItem.modificadorseleccionList.findIndex((oldMod) => {
              // Aquí podrías matchear por ID de grupo y ID del modificador
              return (
                oldMod.modificador_id === newMod.group_id &&
                oldMod.modificadorseleccion_id === newMod.id &&
                oldMod.pedido_productoid === newMod.parent_id
              );
            });
      
            // Si ya existe el modificador, actualizamos cantidad y precio
            if (modIndex !== -1) {
              existingItem.modificadorseleccionList[modIndex].modificadorseleccion_cantidad += Number(newMod.quantity);
              // Opcionalmente, si deseas sumar precio en vez de reemplazarlo:
              existingItem.modificadorseleccionList[modIndex].pedido_precio += Number(newMod.price);
            } else {
              // Si no existe, lo agregamos
              existingItem.modificadorseleccionList.push({
                modificadorseleccion_cantidad: Number(newMod.quantity),
                pedido_precio: Number(newMod.price),
                modificador_id: newMod.group_id,
                modificadorseleccion_id: newMod.id,
                modificador_nombre: newMod.name,
                pedido_productoid: newMod.parent_id,
              });
            }
          });
      
          // 4. Recalcular el total para el existingItem
          const recalculatedPrice = this.calculateTotalPrice(
            product,
            existingItem.pedido_cantidad,
            existingItem.modificadorseleccionList,
            existingItem.lista_productocombo
          );
      
          existingItem.pedido_precio = recalculatedPrice;
      
          // Actualizamos el item en el carrito
          this.cart[existingProductIndex] = existingItem;
      
          // (Opcional) Mostrar en consola
          console.log('Producto actualizado en el carrito:', existingItem);
      
        } else {
          // 5. Si NO existe el producto, lo agregamos como nuevo
          const basePrice = parseFloat(this.getProductPrice(product)) || 0;
          let totalPrice = basePrice * quantity;
      
          // Sumar el costo de los nuevos modificadores
          additionalItems.forEach((ad) => {
            const modifierPrice = parseFloat(ad.price) || 0;
            const modifierQuantity = parseInt(ad.quantity) || 1;
            totalPrice += modifierPrice * modifierQuantity;
          });
      
          // Sumar combos si aplica
          const lista_productocombo = product.lista_productobase
            ? product.lista_productobase.map((comboItem) => {
                return {
                  pedido_productoid: parseInt(comboItem.producto_id),
                  pedido_cantidad: parseInt(comboItem.productocombo_cantidad),
                  pedido_precio: parseFloat(comboItem.productocombo_precio),
                  pedido_nombre: comboItem.producto_descripcion,
                };
              })
            : [];
      
          if (product.lista_productobase) {
            product.lista_productobase.forEach((comboItem) => {
              const comboItemPrice = parseFloat(comboItem.productocombo_precio) || 0;
              const comboItemQuantity = parseInt(comboItem.productocombo_cantidad) || 1;
              totalPrice += comboItemPrice * comboItemQuantity;
            });
          }
      
          // Crear el nuevo pedido
          const pedido = {
            // guardamos la misma firma para futuras comparaciones
            signature: signatureString,
      
            pedido_productoid: this.getProductId(product),
            pedido_cantidad: quantity,
            pedido_precio: totalPrice,
            pedido_base_price: parseInt(this.getProductPrice(product)) || 0,
            pedido_escombo: product.productogeneral_escombo,
            productogeneral_urlimagen:product.productogeneral_urlimagen,
            pedido_nombre_producto: product.productogeneral_descripcion,
      
            lista_productocombo,

            modificadorseleccionList: additionalItems.map((ad) => ({
              modificadorseleccion_cantidad: Number(ad.quantity),
              pedido_precio: Number(ad.price),
              modificador_id: ad.group_id,
              modificadorseleccion_id: ad.id,
              modificador_nombre: ad.name,
              pedido_productoid: ad.parent_id,
            })),
          };
      
          this.cart.push(pedido);
          console.log('Producto agregado al carrito:', pedido);
        }
      },


      removeProductFromCart(signature) {
        const index = this.cart.findIndex(item => item.signature === signature);
        if (index !== -1) {
          this.cart.splice(index, 1);
          console.log(`Producto con signature ${signature} eliminado del carrito.`);
        } else {
          console.warn(`Producto con signature ${signature} no encontrado en el carrito.`);
        }
      },

      calculateTotalPrice(product, quantity, modificadores = [], lista_productocombo = []) {
        // Precio base
        const basePrice = parseFloat(this.getProductPrice(product)) || 0;
        let total = basePrice * quantity;
      
        // Sumamos modificadores
        modificadores.forEach((mod) => {
          // mod.pedido_precio ya está en número,
          // mod.modificadorseleccion_cantidad es la cantidad de ese modificador
          const modPrice = mod.pedido_precio || 0;
          const modQuantity = mod.modificadorseleccion_cantidad || 1;
          total += modPrice * modQuantity;
        });
      
        // Sumamos combos
        if (lista_productocombo?.length) {
          lista_productocombo.forEach((comboItem) => {
            const comboItemPrice = parseFloat(comboItem.pedido_precio) || 0;
            const comboItemQuantity = parseInt(comboItem.pedido_cantidad) || 1;
            total += comboItemPrice * comboItemQuantity;
          });
        }
      
        // Opcional: limitar a 2 decimales
        // total = parseFloat(total.toFixed(2));
        return total;
      },

      getProductPrice(product) {
        const generalPrice = product.productogeneral_precio
        const presentationPrice = product.lista_presentacion?.[0]?.producto_precio
        return generalPrice !== undefined ? generalPrice : (presentationPrice || 0)
      },

      



    decrementProduct(signature) {
        const itemIndex = this.cart.findIndex((item) => item.signature === signature);
        if (itemIndex === -1) return;
      
        const currentItem = this.cart[itemIndex];
      
        // Si solo queda 1 producto, lo removemos del carrito
        if (currentItem.pedido_cantidad <= 1) {
          this.cart.splice(itemIndex, 1);
          return;
        }
      
        // Guardamos la cantidad actual de productos (antes de decrementar)
        const oldQuantity = currentItem.pedido_cantidad;
      
        // Decrementamos la cantidad base en 1
        currentItem.pedido_cantidad -= 1;
      
        // Ajustamos los adicionales de forma proporcional
        currentItem.modificadorseleccionList.forEach((mod) => {
          // Calcular cuántos "adicionales por producto" había
          const adicionalesPorProducto = mod.modificadorseleccion_cantidad / oldQuantity;
      
          // La nueva cantidad total de ese adicional será:
          // (adicionalesPorProducto) * (nueva cantidad de productos)
          const newModQuantity = adicionalesPorProducto * currentItem.pedido_cantidad;
      
          // Redondea o aplica parseInt según desees (para evitar decimales)
          mod.modificadorseleccion_cantidad = Math.round(newModQuantity);
        });
      
        // Recalculamos el precio total con la nueva cantidad y modificadores
        const { product } = JSON.parse(currentItem.signature);
        currentItem.pedido_precio = this.calculateTotalPrice(
          product,
          currentItem.pedido_cantidad,
          currentItem.modificadorseleccionList,
          currentItem.lista_productocombo
        );
      
        // Guardamos los cambios en el carrito
        this.cart[itemIndex] = currentItem;
      }
,      


incrementAdditional(signature, additionalItem) {
    const itemIndex = this.cart.findIndex((item) => item.signature === signature);
    if (itemIndex === -1) return;
  
    const currentItem = this.cart[itemIndex];
  
    // === 1. Buscar el modificador en la lista ===
    const modIndex = currentItem.modificadorseleccionList.findIndex((mod) => {
      return (
        mod === additionalItem
         );
    });
  
    // === 2. Si ya existe el modificador, incrementamos la cantidad en "pedido_cantidad" ===
    if (modIndex !== -1) {
      currentItem.modificadorseleccionList[modIndex].modificadorseleccion_cantidad +=
        currentItem.pedido_cantidad;
    } else {
      // === 3. Si no existe, lo agregamos con cantidad = pedido_cantidad ===
      currentItem.modificadorseleccionList.push({
        modificadorseleccion_cantidad: currentItem.pedido_cantidad,
        pedido_precio: parseFloat(additionalItem.price) || 0,
        modificador_id: additionalItem.group_id,
        modificadorseleccion_id: additionalItem.id,
        modificador_nombre: additionalItem.name,
        pedido_productoid: additionalItem.parent_id,
      });
    }
  
    // === 4. Recalcular el precio total ===
    const { product } = JSON.parse(currentItem.signature);
  
    currentItem.pedido_precio = this.calculateTotalPrice(
      product,
      currentItem.pedido_cantidad,
      currentItem.modificadorseleccionList,
      currentItem.lista_productocombo
    );
  
    this.cart[itemIndex] = currentItem;
  },
  
    
      // -------------------------------------------------------
      // 4. Decrementar la cantidad de un adicional específico
      //    basado en la signature del producto.
      // -------------------------------------------------------
      decrementAdditional(signature, additionalItem) {
        const itemIndex = this.cart.findIndex((item) => item.signature === signature);
        if (itemIndex === -1) return;
      
        const currentItem = this.cart[itemIndex];
      
        // 1. Buscar el modificador en la lista
        const modIndex = currentItem.modificadorseleccionList.findIndex((mod) => {
          return (
            mod === additionalItem
          );
        });
      
        // 2. Si lo encontramos, decrementamos la cantidad
        if (modIndex !== -1) {
          const mod = currentItem.modificadorseleccionList[modIndex];
      
          // Restamos "pedido_cantidad" a la cantidad del modificador
          mod.modificadorseleccion_cantidad -= currentItem.pedido_cantidad;
      
          // Si llega a 0 o menos, lo quitamos de la lista
          if (mod.modificadorseleccion_cantidad <= 0) {
            currentItem.modificadorseleccionList.splice(modIndex, 1);
          }
        }
      
        // 3. Recalcular el precio total
        const { product } = JSON.parse(currentItem.signature);
        currentItem.pedido_precio = this.calculateTotalPrice(
          product,
          currentItem.pedido_cantidad,
          currentItem.modificadorseleccionList,
          currentItem.lista_productocombo
        );
      
        // 4. Guardamos los cambios
        this.cart[itemIndex] = currentItem;
      },
      
    





      incrementProduct(signature) {
        const itemIndex = this.cart.findIndex((item) => item.signature === signature);
        if (itemIndex === -1) return;
      
        const currentItem = this.cart[itemIndex];
        // Guardar la cantidad actual de productos antes de incrementarla
        const oldQuantity = currentItem.pedido_cantidad;
      
        // Incrementar la cantidad del producto en 1
        currentItem.pedido_cantidad += 1;
      
        // Ajustar los adicionales de forma proporcional
        currentItem.modificadorseleccionList.forEach((mod) => {
          // adicionalesPorProducto = cantidadActualMod / oldQuantity
          const adicionalesPorProducto = mod.modificadorseleccion_cantidad / oldQuantity;
      
          // Nueva cantidad total del adicional
          mod.modificadorseleccion_cantidad = Math.round(
            adicionalesPorProducto * currentItem.pedido_cantidad
          );
        });
      
        // Recalcular el precio total con la nueva cantidad y modificadores
        const { product } = JSON.parse(currentItem.signature);
        currentItem.pedido_precio = this.calculateTotalPrice(
          product,
          currentItem.pedido_cantidad,
          currentItem.modificadorseleccionList,
          currentItem.lista_productocombo
        );
      
        // Guardamos los cambios en el carrito
        this.cart[itemIndex] = currentItem;
      },
      
    
      // -------------------------------------------------------
      // 2. Decrementar la cantidad de un producto (signature)
      //    Si la cantidad del producto llega a 0, se elimina del carrito
      // -------------------------------------------------------
     

    addAdditionalItem(productId, additionalItem) {
      
    },
    removeAdditionalItem(productId, additionalItemId) {
     
    },
    groupAdditionalItems(additionalItems) {
     
    },
    calculateProductTotal(product, quantity, additionalItems) {
     
    },
    removeProductInstance(productId) {
      
    },
    calculateCartTotal() {
     
    },

    addAdditionToCart(addition) {
     
    },
    removeAdditionFromCart(additionId) {
      
    },
  },
})
