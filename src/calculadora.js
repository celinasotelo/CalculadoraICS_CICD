function calcularPromedio(parcial1, parcial2, parcial3) {
  const notas = [parcial1, parcial2, parcial3];

  if (!notas.every((nota) => typeof nota === 'number' && !Number.isNaN(nota))) {
    throw new Error('Las notas deben ser números');
  }

  if (!notas.every((nota) => nota >= 0 && nota <= 10)) {
    throw new Error('Las notas deben estar entre 0 y 10');
  }

  const promedio = Math.round((notas[0] + notas[1] + notas[2]) / 3);
  const aprobado = notas.every((nota) => nota >= 6);

  return {
    promedio,
    aprobado,
  };
}

export { calcularPromedio };
