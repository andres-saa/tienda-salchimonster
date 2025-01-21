// Función para formatear un número como pesos colombianos
function formatoPesosColombianos(numero) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(numero);
  }
  

  export {formatoPesosColombianos}