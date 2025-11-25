// archivo: services/gestor-tareas.js
const { validarTarea, getErroresValidaciones } = require('../utils/ValidacionTareas');
const { logInfo, logError } = require('../utils/log');
const Exportador = require('../utils/exportador');

const Tarea = require('../models/tarea');
const Almacenamiento = require('../lib/almacenamiento');

class GestorTareas {
  constructor() {
    this.exportador = new Exportador();
    this.almacenamiento = new Almacenamiento('tareas.json');
    this.tareas = new Map();
  }

  async inicializar() {
    logInfo('Inicializando gestor de tareas');
    const datos = await this.almacenamiento.cargar();
    if (datos.tareas) {
      datos.tareas.forEach(tareaData => {
        logInfo(`Cargando tarea: ${tareaData.titulo}`);
        if (!validarTarea(tareaData)) next();
        const tarea = new Tarea(
          tareaData.id,
          tareaData.titulo,
          tareaData.descripcion,
          tareaData.prioridad
        );
        if (tareaData.completada) {
          tarea.completar();
        }
        this.tareas.set(tarea.id, tarea);
      });
    }
    logInfo(`📋 Cargadas ${this.tareas.size} tareas`);

    getErroresValidaciones().forEach(validacion => {
      logError(`- ${validacion.mensaje}`);
    });

  }

  async guardar() {
    logInfo('Guardando tareas');
    const tareasArray = Array.from(this.tareas.values()).map(tarea => tarea.obtenerInformacion());
    this.almacenamiento.actualizarDatos({ tareas: tareasArray });
    await this.almacenamiento.guardar();

    logInfo('Guardando tareas en formato JSON y CSV');
    await this.exportador.exportarJSON(tareasArray, 'export.json');
    await this.exportador.exportarCSV(tareasArray, 'export.csv');
    logInfo('Tareas guardadas');
  }

  crearTarea(titulo, descripcion = '', prioridad = 'media') {
    logInfo(`Creando tarea: ${titulo}`);
    const id = Date.now().toString();

    if (!validarTarea({ id, titulo, descripcion, prioridad })) {
      throw new Error(getErroresValidaciones().map(v => v.mensaje).join('\n') || 'Error al crear la tarea');
    }

    const tarea = new Tarea(id, titulo, descripcion, prioridad);
    this.tareas.set(id, tarea);
    logInfo(`✅ Tarea creada: "${titulo}"`);
    return tarea;
  }

  obtenerTarea(id) {
    logInfo(`Obteniendo tarea: ${id}`);
    return this.tareas.get(id);
  }

  obtenerTodasTareas(filtro = {}) {
    logInfo('Obteniendo todas las tareas');
    let tareas = Array.from(this.tareas.values());

    if (filtro.completada !== undefined) {
      tareas = tareas.filter(t => t.completada === filtro.completada);
    }

    if (filtro.prioridad) {
      tareas = tareas.filter(t => t.prioridad === filtro.prioridad);
    }

    logInfo(`Obteniendo ${tareas.length} tareas`);
    return tareas;
  }

  async completarTarea(id) {
    logInfo(`Completando tarea: ${id}`);
    const tarea = this.tareas.get(id);
    if (!tarea) {
      throw new Error(`Tarea con ID ${id} no encontrada`);
    }

    tarea.completar();
    await this.guardar();
    logInfo(`✅ Tarea completada: "${tarea.titulo}"`);
    return tarea;
  }

  async actualizarTarea(id, datos) {
    logInfo(`Actualizando tarea: ${id}`);
    const tarea = this.tareas.get(id);
    if (!tarea) {
      throw new Error(`Tarea con ID ${id} no encontrada`);
    }

    if (!validarTarea({ ...tarea, ...datos })) {
      throw new Error(getErroresValidaciones().map(v => v.mensaje).join('\n') || 'Error al actualizar la tarea');
    }

    tarea.actualizar(datos);
    await this.guardar();
    logInfo(`📝 Tarea actualizada: "${tarea.titulo}"`);
    return tarea;
  }

  async eliminarTarea(id) {
    logInfo(`Eliminando tarea: ${id}`);
    const tarea = this.tareas.get(id);
    if (!tarea) {
      throw new Error(`Tarea con ID ${id} no encontrada`);
    }

    this.tareas.delete(id);
    await this.guardar();
    logInfo(`🗑️ Tarea eliminada: "${tarea.titulo}"`);
    return tarea;
  }

  obtenerEstadisticas() {
    logInfo('Obteniendo estadísticas');
    const tareas = Array.from(this.tareas.values());
    const total = tareas.length;
    const completadas = tareas.filter(t => t.completada).length;
    const pendientes = total - completadas;

    const porPrioridad = tareas.reduce((acc, tarea) => {
      acc[tarea.prioridad] = (acc[tarea.prioridad] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      completadas,
      pendientes,
      porPrioridad
    };
  }
}

module.exports = GestorTareas;