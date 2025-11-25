// archivo: index.js

const GestorTareas = require('./services/gestor-tareas');

async function demostrarSistemaModular() {
  console.log('🚀 DEMOSTRACIÓN: SISTEMA MODULAR DE GESTIÓN DE TAREAS\n');

  // Inicializar el gestor
  const gestor = new GestorTareas();
  await gestor.inicializar();

  console.log('📊 ESTADO INICIAL:');
  console.log(gestor.obtenerEstadisticas());

  // Crear algunas tareas
  console.log('\n📝 CREANDO TAREAS:');
  gestor.crearTarea('Aprender Node.js', 'Completar tutoriales de fundamentos', 'alta');
  gestor.crearTarea('Practicar módulos', 'Crear sistema modular', 'media');
  gestor.crearTarea('Hacer ejercicio', '30 minutos de cardio', 'baja');
  gestor.crearTarea('Revisar código', 'Code review del proyecto', 'alta');

  await gestor.guardar();

  console.log('\n📊 ESTADO DESPUÉS DE CREAR:');
  console.log(gestor.obtenerEstadisticas());

  // Completar algunas tareas
  console.log('\n✅ COMPLETANDO TAREAS:');
  const tareas = gestor.obtenerTodasTareas({ completada: false });
  if (tareas.length > 0) {
    await gestor.completarTarea(tareas[0].id);
    await gestor.completarTarea(tareas[1].id);
  }

  console.log('\n📋 TAREAS PENDIENTES:');
  const pendientes = gestor.obtenerTodasTareas({ completada: false });
  pendientes.forEach(tarea => {
    console.log(`- ${tarea.titulo} (${tarea.prioridad})`);
  });

  console.log('\n📋 TAREAS COMPLETADAS:');
  const completadas = gestor.obtenerTodasTareas({ completada: true });
  completadas.forEach(tarea => {
    console.log(`- ${tarea.titulo} (${tarea.prioridad})`);
  });

  console.log('\n📊 ESTADÍSTICAS FINALES:');
  console.log(gestor.obtenerEstadisticas());

  console.log('\n🎯 Sistema modular completado exitosamente!');
}

// Ejecutar demostración
demostrarSistemaModular().catch(error => {
  console.error('❌ Error en la demostración:', error.message);
});