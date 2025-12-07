import { useState } from 'react';

/**
 * Hook personalizado para simular operaciones de pago
 * 
 * ESTADOS POSIBLES:
 * - 'success': Pago completado exitosamente
 * - 'declined': Pago rechazado (fondos insuficientes, tarjeta bloqueada, etc.)
 * - 'requires_action': Requiere autenticación 3D Secure
 * - 'network_error': Error de conexión/servidor
 * 
 * MODO DE PRUEBA:
 * Para controlar manualmente el resultado, cambia la variable FORCE_RESULT:
 * - null: comportamiento aleatorio (por defecto)
 * - 'success': siempre exitoso
 * - 'declined': siempre rechazado
 * - 'requires_action': siempre requiere 3DS
 * - 'network_error': siempre falla con error de red
 */

// ⚙️ CONFIGURACIÓN DE PRUEBAS
const FORCE_RESULT = null; // Cambia a 'success', 'declined', 'requires_action', 'network_error' o null

const useMockPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Simula la creación de una orden de pago
   * @param {Object} orderData - Datos de la orden (amount, currency, description)
   * @returns {Promise<Object>} Orden creada con ID
   */
  const createOrder = async (orderData) => {
    setIsProcessing(true);
    setError(null);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
          
          const order = {
            id: orderId,
            amount: orderData.amount,
            currency: orderData.currency,
            description: orderData.description || 'Suscripción Knowly Plus',
            status: 'created',
            createdAt: new Date().toISOString()
          };

          console.log('✅ Orden creada:', order);
          setIsProcessing(false);
          resolve(order);
        } catch (err) {
          setIsProcessing(false);
          setError('Error al crear la orden');
          reject(err);
        }
      }, 800); // Simula latencia de red
    });
  };

  /**
   * Simula la confirmación del pago
   * @param {string} orderId - ID de la orden a procesar
   * @param {Object} paymentMethod - Método de pago seleccionado
   * @returns {Promise<Object>} Resultado del pago
   */
  const confirmPayment = async (orderId, paymentMethod = {}) => {
    setIsProcessing(true);
    setError(null);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Determinar resultado (forzado o aleatorio)
        let result;
        
        if (FORCE_RESULT) {
          result = FORCE_RESULT;
        } else {
          // Distribución aleatoria realista:
          // 70% success, 15% declined, 10% requires_action, 5% network_error
          const random = Math.random();
          if (random < 0.70) result = 'success';
          else if (random < 0.85) result = 'declined';
          else if (random < 0.95) result = 'requires_action';
          else result = 'network_error';
        }

        console.log('🎲 Resultado del pago:', result);

        // Procesar según el resultado
        switch (result) {
          case 'success': {
            const successResponse = {
              status: 'success',
              transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
              orderId: orderId,
              amount: paymentMethod.amount || '69.99',
              currency: paymentMethod.currency || 'MXN',
              paymentMethod: paymentMethod.type || 'card',
              timestamp: new Date().toISOString(),
              message: 'Pago procesado exitosamente'
            };
            console.log('✅ Pago exitoso:', successResponse);
            setIsProcessing(false);
            resolve(successResponse);
            break;
          }

          case 'declined': {
            const declinedError = {
              status: 'declined',
              code: 'PAYMENT_DECLINED',
              message: 'Tu pago fue rechazado. Por favor, verifica tus datos o intenta con otro método de pago.',
              details: getRandomDeclineReason(),
              orderId: orderId
            };
            console.log('❌ Pago rechazado:', declinedError);
            setIsProcessing(false);
            setError(declinedError.message);
            reject(declinedError);
            break;
          }

          case 'requires_action': {
            const actionResponse = {
              status: 'requires_action',
              action: '3d_secure',
              orderId: orderId,
              message: 'Se requiere autenticación adicional',
              redirectUrl: '/3ds-challenge' // Simulado
            };
            console.log('🔐 Requiere 3D Secure:', actionResponse);
            setIsProcessing(false);
            resolve(actionResponse);
            break;
          }

          case 'network_error': {
            const networkError = {
              status: 'error',
              code: 'NETWORK_ERROR',
              message: 'Error de conexión. Por favor, verifica tu conexión a internet e intenta nuevamente.',
              orderId: orderId
            };
            console.log('🌐 Error de red:', networkError);
            setIsProcessing(false);
            setError(networkError.message);
            reject(networkError);
            break;
          }

          default:
            reject(new Error('Estado desconocido'));
        }
      }, 2000); // Simula procesamiento del pago (2 segundos)
    });
  };

  /**
   * Simula autenticación 3D Secure
   * @param {string} orderId - ID de la orden
   * @param {string} code - Código de verificación
   * @returns {Promise<Object>} Resultado de la autenticación
   */
  const verify3DSecure = async (orderId, code) => {
    setIsProcessing(true);
    setError(null);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Códigos válidos de prueba
        const validCodes = ['123456', '000000', '111111'];
        
        if (validCodes.includes(code)) {
          const successResponse = {
            status: 'success',
            transactionId: `TXN-3DS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            orderId: orderId,
            verified: true,
            timestamp: new Date().toISOString(),
            message: 'Autenticación 3D Secure exitosa'
          };
          console.log('✅ 3DS verificado:', successResponse);
          setIsProcessing(false);
          resolve(successResponse);
        } else {
          const errorResponse = {
            status: 'failed',
            code: '3DS_FAILED',
            message: 'Código de verificación incorrecto',
            orderId: orderId
          };
          console.log('❌ 3DS fallido:', errorResponse);
          setIsProcessing(false);
          setError(errorResponse.message);
          reject(errorResponse);
        }
      }, 1500);
    });
  };

  /**
   * Resetea el estado del hook
   */
  const reset = () => {
    setIsProcessing(false);
    setError(null);
  };

  return {
    createOrder,
    confirmPayment,
    verify3DSecure,
    isProcessing,
    error,
    reset
  };
};

export default useMockPayment;

// Helpers

/**
 * Retorna una razón aleatoria de rechazo de pago
 */
function getRandomDeclineReason() {
  const reasons = [
    'Fondos insuficientes',
    'Tarjeta bloqueada por el banco',
    'Límite de transacción excedido',
    'Tarjeta vencida',
    'Información de pago incorrecta',
    'Transacción sospechosa detectada'
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
}

/**
 * GUÍA DE USO:
 * 
 * 1. Importar el hook:
 *    import useMockPayment from './useMockPayment';
 * 
 * 2. Usar en tu componente:
 *    const { createOrder, confirmPayment, isProcessing, error } = useMockPayment();
 * 
 * 3. Crear orden:
 *    const order = await createOrder({ amount: '69.99', currency: 'MXN' });
 * 
 * 4. Confirmar pago:
 *    const result = await confirmPayment(order.id, { type: 'card' });
 * 
 * 5. Manejar resultados:
 *    - Si result.status === 'success' → Pago exitoso
 *    - Si result.status === 'requires_action' → Mostrar 3DS
 *    - Si catch error → Pago rechazado o error de red
 * 
 * CÓDIGOS 3DS VÁLIDOS PARA PRUEBAS:
 * - 123456
 * - 000000
 * - 111111
 */