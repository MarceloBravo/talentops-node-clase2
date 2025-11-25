
/**
 * Registra un mensaje informativo en la consola.
 * @param {string} mensaje - El mensaje a mostrar.
 */
function logInfo(mensaje) {
    console.log(`INFO: ${mensaje}`);
}

/**
 * Registra un mensaje de error en la consola.
 * @param {string} mensaje - El mensaje de error a mostrar.
 */
function logError(mensaje) {
    console.error(`ERROR: ${mensaje}`);
}

module.exports = {
    logInfo,
    logError
};
