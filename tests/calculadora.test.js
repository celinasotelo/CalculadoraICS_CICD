const { calcularPromedio } = require('../src/calculadora');

describe('calcularPromedio', () => {
  test('TC-01: 7, 8, 9 => promedio 8, aprobado true', () => {
    expect(calcularPromedio(7, 8, 9)).toEqual({ promedio: 8, aprobado: true });
  });

  test('TC-02: 6, 6, 6 => promedio 6, aprobado true', () => {
    expect(calcularPromedio(6, 6, 6)).toEqual({ promedio: 8, aprobado: true });
  });

  test('TC-03: 5, 8, 9 => promedio 7, aprobado false', () => {
    expect(calcularPromedio(5, 8, 9)).toEqual({ promedio: 7, aprobado: false });
  });

  test('TC-04: 7, 5, 9 => promedio 7, aprobado false', () => {
    expect(calcularPromedio(7, 5, 9)).toEqual({ promedio: 7, aprobado: false });
  });

  test('TC-05: 7, 8, 5 => promedio 7, aprobado false', () => {
    expect(calcularPromedio(7, 8, 5)).toEqual({ promedio: 7, aprobado: false });
  });

  test('TC-06: 0, 0, 0 => promedio 0, aprobado false', () => {
    expect(calcularPromedio(0, 0, 0)).toEqual({ promedio: 0, aprobado: false });
  });

  test('TC-07: 10, 10, 10 => promedio 10, aprobado true', () => {
    expect(calcularPromedio(10, 10, 10)).toEqual({ promedio: 10, aprobado: true });
  });

  test('TC-08: 5, 5, 5 => promedio 5, aprobado false', () => {
    expect(calcularPromedio(5, 5, 5)).toEqual({ promedio: 5, aprobado: false });
  });

  test('TC-09: 6, 6, 5 => promedio 6, aprobado false', () => {
    expect(calcularPromedio(6, 6, 5)).toEqual({ promedio: 6, aprobado: false });
  });

  test('TC-10: 7.5, 8.3, 6.2 => promedio 7, aprobado true', () => {
    expect(calcularPromedio(7.5, 8.3, 6.2)).toEqual({ promedio: 7, aprobado: true });
  });

  test('TV-01: -1, 7, 8 => error rango', () => {
    expect(() => calcularPromedio(-1, 7, 8)).toThrow('Las notas deben estar entre 0 y 10');
  });

  test('TV-02: 11, 7, 8 => error rango', () => {
    expect(() => calcularPromedio(11, 7, 8)).toThrow('Las notas deben estar entre 0 y 10');
  });

  test('TV-03: 7, 7, 11 => error rango', () => {
    expect(() => calcularPromedio(7, 7, 11)).toThrow('Las notas deben estar entre 0 y 10');
  });

  test('TV-04: "abc", 7, 8 => error tipo', () => {
    expect(() => calcularPromedio('abc', 7, 8)).toThrow('Las notas deben ser números');
  });

  test('TV-05: null, 7, 8 => error tipo', () => {
    expect(() => calcularPromedio(null, 7, 8)).toThrow('Las notas deben ser números');
  });

  test('TV-06: undefined, undefined, undefined => error tipo', () => {
    expect(() => calcularPromedio(undefined, undefined, undefined)).toThrow('Las notas deben ser números');
  });
});
