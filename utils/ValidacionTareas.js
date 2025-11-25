/**
 * Clase contenedora de validaciones estáticas para tareas.
 */
class ValidacionTareas {
    static validaciones = [];

    /**
     * Valida que el ID sea una cadena no vacía.
     * @param {string} id - Identificador de la tarea.
     * @throws {Error} Si el ID no es una cadena válida.
     */
    static validarId(id) {
        if (typeof id !== 'string' || id.trim() === '') {
            throw new Error('El ID debe ser una cadena no vacía');
        }
    }

    /**
     * Valida que el título sea una cadena no vacía.
     * @param {string} titulo - Título de la tarea.
     * @throws {Error} Si el título no es una cadena válida.
     */
    static validarTitulo(titulo) {
        if (typeof titulo !== 'string' || titulo.trim() === '') {
            throw new Error('El título debe ser una cadena no vacía');
        }
    }

    /**
 * Valida que la prioridad sea una de las permitidas.
 * @param {string} prioridad - Prioridad de la tarea ('baja', 'media', 'alta').
 * @throws {Error} Si la prioridad no es válida.
 */
    static validarPrioridad(prioridad) {
        const prioridadesValidas = ['baja', 'media', 'alta'];
        if (!prioridadesValidas.includes(prioridad)) {
            throw new Error('Prioridad inválida');
        }
    }

    /**
     * Valida que el campo completada sea booleano.
     * @param {boolean} completada - Estado de completado de la tarea.
     * @throws {Error} Si completada no es booleano.
     */
    static validarCompletada(completada) {
        if (completada && typeof completada !== 'boolean') {
            throw new Error('El estado de completada debe ser un booleano');
        }
    }

}

/**
 * Valida una tarea completa usando los métodos estáticos.
 * @param {Object} tarea - Objeto tarea a validar.
 * @returns {boolean} true si la tarea es válida, false si hay errores.
 */
function validarTarea(tarea) {
    try {
        ValidacionTareas.validarId(tarea.id)
        ValidacionTareas.validarTitulo(tarea.titulo);
        ValidacionTareas.validarPrioridad(tarea.prioridad);
        ValidacionTareas.validarCompletada(tarea.completada);
        return true;
    } catch (error) {
        ValidacionTareas.validaciones.push({
            resultado: false,
            mensaje: error.message
        });
        return false;
    }
}

/**
 * Obtiene la lista de errores de validación acumulados.
 * @returns {Array<Object>} Arreglo de objetos con resultado y mensaje de error.
 */
function getErroresValidaciones() {
    return ValidacionTareas.validaciones;
}

module.exports = {
    validarTarea,
    getErroresValidaciones
};