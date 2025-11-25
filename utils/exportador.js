const { logInfo, logError } = require('../utils/log');
const path = require('path');
const fs = require('fs/promises');


/**
 * Clase responsable de exportar datos a formatos JSON y CSV.
 */
class Exportador {
    constructor() {
    }

    /**
 * Exporta datos a un archivo JSON.
 * @param {any} datos - Datos a serializar en JSON.
 * @param {string} [nombreArchivo='datos.jason'] - Nombre del archivo de salida.
 * @throws {Error} Si ocurre un error al escribir el archivo.
 */
    async exportarJSON(datos, nombreArchivo = 'datos.jason') {
        try {
            const archivo = this.#nombrarArchivo(nombreArchivo);
            await fs.mkdir(path.dirname(archivo), { recursive: true });
            const contenido = JSON.stringify(datos, null, 2);
            logInfo(`📄 Contenido JSON: ${archivo}`);
            await fs.writeFile(archivo, contenido, 'utf8');
            logInfo('💾 JSON guardado exitosamente ');
        } catch (error) {
            logError(`Error al guardar datos JSON: ${error.message}`);
            throw new Error(`Error al guardar datos JSON: ${error.message}`);
        }
    }

    /**
     * Exporta datos a un archivo CSV.
     * @param {Array<Object>} datos - Arreglo de objetos a convertir en CSV.
     * @param {string} [nombreArchivo='datos.csv'] - Nombre del archivo de salida.
     * @throws {Error} Si ocurre un error al escribir el archivo.
     */
    async exportarCSV(datos, nombreArchivo = 'datos.csv') {
        try {
            const archivo = this.#nombrarArchivo(nombreArchivo);
            await fs.mkdir(path.dirname(archivo), { recursive: true });

            const keys = Object.keys(datos[0]); // encabezados
            const encabezado = keys.join(',');       // "col1,col2,col3"
            const filas = datos.map(obj =>
                keys.map(k => obj[k]).join(',')
            );
            const contenido = [encabezado, ...filas].join('\n');
            await fs.writeFile(archivo, contenido, 'utf8');

            logInfo('💾 CSV guardado exitosamente');
        } catch (error) {
            logError(`Error al guardar datos CSV: ${error.message}`);
            throw new Error(`Error al guardar datos CSV: ${error.message}`);
        }
    }


    /**
     * Genera la ruta completa del archivo a exportar.
     * @private
     * @param {string} archivo - Nombre del archivo con extensión.
     * @returns {string} Ruta absoluta del archivo dentro del directorio data.
     * @throws {Error} Si el nombre del archivo es inválido o la extensión no es soportada.
     */
    #nombrarArchivo(archivo) {
        try {
            if (!archivo) {
                logError('El archivo es obligatorio');
                throw new Error('El nombre del archivo es obligatorio');
            }
            const extension = path.extname(archivo);
            if (extension !== '.json' && extension !== '.csv') {
                logError('El tipo de archivo debe ser JSON o CSV');
                throw new Error('El tipo de archivo debe ser JSON o CSV');
            }
            return path.join(__dirname, '..', 'data', archivo);
        } catch (error) {
            logError(`Error al nombrar archivo: ${error.message}`);
            throw new Error(`Error al nombrar archivo: ${error.message}`);
        }
    }
}

module.exports = Exportador;
