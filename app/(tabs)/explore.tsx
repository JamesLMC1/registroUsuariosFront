
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

type Estudiante = {
  id: number;
  cedula: string;
  nombre: string;
  correo: string;
  celular: string;
  materia: string;
};

export default function NotasScreen() {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [notas, setNotas] = useState({ nota1: '', nota2: '', nota3: '', nota4: '' });
  const [definitiva, setDefinitiva] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const buscarEstudiante = async () => {
    setMensaje(''); setError(''); setEstudiante(null);
    if (!cedula || !nombre) {
      setError('Ingrese cédula y nombre');
      return;
    }
    setLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || '';
      const res = await fetch(`${apiUrl}/buscar-estudiante?cedula=${encodeURIComponent(cedula)}&nombre=${encodeURIComponent(nombre)}`);
      const data = await res.json();
      if (res.ok && data.estudiante) {
        setEstudiante(data.estudiante);
      } else {
        setError(data.error || 'No encontrado');
      }
    } catch {
      setError('Error de red');
    }
    setLoading(false);
  };

  const calcularDefinitiva = async () => {
    setMensaje(''); setError('');
    if (!estudiante) {
      setError('Primero busque el estudiante');
      return;
    }
    const n1 = parseFloat(notas.nota1);
    const n2 = parseFloat(notas.nota2);
    const n3 = parseFloat(notas.nota3);
    const n4 = parseFloat(notas.nota4);
    if ([n1, n2, n3, n4].some(isNaN)) {
      setError('Ingrese las 4 notas');
      return;
    }
    setLoading(true);
    try {
      // Se puede calcular localmente, pero también se puede consultar al backend si se desea
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || '';
      const res = await fetch(`${apiUrl}/definitiva?estudiante_id=${estudiante.id}&materia=${encodeURIComponent(estudiante.materia)}`);
      const data = await res.json();
      if (res.ok && typeof data.definitiva === 'number') {
        setDefinitiva(data.definitiva);
      } else {
        // Si no hay notas previas, calcular localmente
        const def = (n1 + n2 + n3 + n4) / 4;
        setDefinitiva(Number(def.toFixed(2)));
      }
    } catch {
      // Si hay error, calcular localmente
      const def = (n1 + n2 + n3 + n4) / 4;
      setDefinitiva(Number(def.toFixed(2)));
    }
    setLoading(false);
  };

  const registrarNotas = async () => {
    setMensaje(''); setError('');
    if (!estudiante) {
      setError('Primero busque el estudiante');
      return;
    }
    const n1 = parseFloat(notas.nota1);
    const n2 = parseFloat(notas.nota2);
    const n3 = parseFloat(notas.nota3);
    const n4 = parseFloat(notas.nota4);
    if ([n1, n2, n3, n4].some(isNaN)) {
      setError('Ingrese las 4 notas');
      return;
    }
    setLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || '';
      const res = await fetch(`${apiUrl}/notas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estudiante_id: estudiante.id,
          materia: estudiante.materia,
          nota1: n1,
          nota2: n2,
          nota3: n3,
          nota4: n4
        })
      });
      const data = await res.json();
      if (res.status === 201) {
        setMensaje('Notas registradas correctamente');
        setNotas({ nota1: '', nota2: '', nota3: '', nota4: '' });
        setDefinitiva(null);
      } else {
        setError(data.error || 'Error al registrar notas');
      }
    } catch {
      setError('Error de red');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Notas</Text>
      {/* Buscar estudiante */}
      <TextInput
        style={styles.input}
        placeholder="Cédula"
        value={cedula}
        onChangeText={setCedula}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <Button title={loading ? 'Buscando...' : 'Buscar Estudiante'} onPress={buscarEstudiante} disabled={loading} />
      {estudiante && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Estudiante:</Text>
          <Text>Nombre: {estudiante.nombre}</Text>
          <Text>Cédula: {estudiante.cedula}</Text>
          <Text>Materia: {estudiante.materia}</Text>
        </View>
      )}
      {/* Inputs de notas */}
      {estudiante && (
        <View style={styles.notasBox}>
          <TextInput
            style={styles.input}
            placeholder="Nota 1"
            value={notas.nota1}
            onChangeText={v => setNotas(n => ({ ...n, nota1: v }))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nota 2"
            value={notas.nota2}
            onChangeText={v => setNotas(n => ({ ...n, nota2: v }))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nota 3"
            value={notas.nota3}
            onChangeText={v => setNotas(n => ({ ...n, nota3: v }))}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Nota 4"
            value={notas.nota4}
            onChangeText={v => setNotas(n => ({ ...n, nota4: v }))}
            keyboardType="numeric"
          />
          <Button title="Calcular Definitiva" onPress={calcularDefinitiva} />
          {definitiva !== null && (
            <Text style={styles.definitiva}>Definitiva: {definitiva}</Text>
          )}
          <Button title={loading ? 'Registrando...' : 'Registrar Notas'} onPress={registrarNotas} disabled={loading} />
        </View>
      )}
      {mensaje ? <Text style={styles.success}>{mensaje}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12 },
  resultBox: { marginTop: 20, padding: 12, backgroundColor: '#f2f2f2', borderRadius: 8 },
  resultTitle: { fontWeight: 'bold', marginTop: 8 },
  notasBox: { marginTop: 20 },
  definitiva: { fontWeight: 'bold', color: '#007b00', marginVertical: 10, textAlign: 'center' },
  error: { color: 'red', marginTop: 10, textAlign: 'center' },
  success: { color: 'green', marginTop: 10, textAlign: 'center' },
});
