import Constants from 'expo-constants';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

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
    if (!cedula || !nombre) { setError('// error: cédula y nombre requeridos'); return; }
    setLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || '';
      const res = await fetch(`${apiUrl}buscar-estudiante?cedula=${encodeURIComponent(cedula)}&nombre=${encodeURIComponent(nombre)}`);
      const data = await res.json();
      if (res.ok && data.estudiante) {
        setEstudiante(data.estudiante);
      } else {
        setError(`// error: ${data.error || 'no encontrado'}`);
      }
    } catch {
      setError('// error: conexión fallida');
    }
    setLoading(false);
  };

  const calcularDefinitiva = async () => {
    setMensaje(''); setError('');
    if (!estudiante) { setError('// error: busque el estudiante primero'); return; }
    const n1 = parseFloat(notas.nota1), n2 = parseFloat(notas.nota2);
    const n3 = parseFloat(notas.nota3), n4 = parseFloat(notas.nota4);
    if ([n1, n2, n3, n4].some(isNaN)) { setError('// error: ingrese las 4 notas'); return; }
    setLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || '';
      const res = await fetch(`${apiUrl}definitiva?estudiante_id=${estudiante.id}&materia=${encodeURIComponent(estudiante.materia)}`);
      const data = await res.json();
      if (res.ok && typeof data.definitiva === 'number') {
        setDefinitiva(data.definitiva);
      } else {
        setDefinitiva(Number(((n1 + n2 + n3 + n4) / 4).toFixed(2)));
      }
    } catch {
      setDefinitiva(Number(((n1 + n2 + n3 + n4) / 4).toFixed(2)));
    }
    setLoading(false);
  };

  const registrarNotas = async () => {
    setMensaje(''); setError('');
    if (!estudiante) { setError('// error: busque el estudiante primero'); return; }
    const n1 = parseFloat(notas.nota1), n2 = parseFloat(notas.nota2);
    const n3 = parseFloat(notas.nota3), n4 = parseFloat(notas.nota4);
    if ([n1, n2, n3, n4].some(isNaN)) { setError('// error: ingrese las 4 notas'); return; }
    setLoading(true);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || '';
      const res = await fetch(`${apiUrl}notas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estudiante_id: estudiante.id, materia: estudiante.materia, nota1: n1, nota2: n2, nota3: n3, nota4: n4 })
      });
      const data = await res.json();
      if (res.status === 201) {
        setMensaje('// notas registradas con éxito ✓');
        setNotas({ nota1: '', nota2: '', nota3: '', nota4: '' });
        setDefinitiva(null);
      } else {
        setError(`// error: ${data.error || 'error al registrar'}`);
      }
    } catch {
      setError('// error: conexión fallida');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.prompt}>{'>'} notas.js</Text>
        <Text style={styles.title}>registrar_notas()</Text>
        <View style={styles.divider} />
      </View>

      {/* Buscar estudiante */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{'/* buscar estudiante */'}</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{'// cedula'}</Text>
          <TextInput style={styles.input} placeholder="0000000000" placeholderTextColor="#3a4a3a"
            value={cedula} onChangeText={setCedula} keyboardType="numeric" />
        </View>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{'// nombre'}</Text>
          <TextInput style={styles.input} placeholder="Juan Pérez" placeholderTextColor="#3a4a3a"
            value={nombre} onChangeText={setNombre} />
        </View>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]} onPress={buscarEstudiante} disabled={loading}>
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {loading ? '[ buscando... ]' : '[ BUSCAR ]'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resultado estudiante */}
      {estudiante && (
        <View style={styles.resultBox}>
          <Text style={styles.resultHeader}>{'// estudiante encontrado'}</Text>
          <Text style={styles.resultLine}><Text style={styles.key}>nombre: </Text><Text style={styles.val}>"{estudiante.nombre}"</Text></Text>
          <Text style={styles.resultLine}><Text style={styles.key}>cedula: </Text><Text style={styles.val}>"{estudiante.cedula}"</Text></Text>
          <Text style={styles.resultLine}><Text style={styles.key}>materia: </Text><Text style={styles.val}>"{estudiante.materia}"</Text></Text>
        </View>
      )}

      {/* Notas */}
      {estudiante && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{'/* ingresar notas */'}</Text>
          {['nota1', 'nota2', 'nota3', 'nota4'].map((key, i) => (
            <View key={key} style={styles.fieldGroup}>
              <Text style={styles.label}>{`// nota${i + 1}`}</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#3a4a3a"
                value={notas[key as keyof typeof notas]}
                onChangeText={v => setNotas(n => ({ ...n, [key]: v }))}
                keyboardType="numeric"
              />
            </View>
          ))}

          {definitiva !== null && (
            <View style={styles.definitivaBox}>
              <Text style={styles.definitivaLabel}>{'// definitiva'}</Text>
              <Text style={styles.definitivaVal}>{definitiva}</Text>
            </View>
          )}

          <TouchableOpacity style={[styles.button, styles.buttonSecondary, { marginBottom: 12 }]} onPress={calcularDefinitiva} disabled={loading}>
            <Text style={[styles.buttonText, styles.buttonTextSecondary]}>[ CALCULAR ]</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={registrarNotas} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? '[ ejecutando... ]' : '[ REGISTRAR NOTAS ]'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {mensaje ? <View style={styles.successBox}><Text style={styles.successText}>{mensaje}</Text></View> : null}
      {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0f0a' },
  content: { padding: 24, paddingTop: 60 },
  header: { marginBottom: 32 },
  prompt: { fontFamily: 'monospace', fontSize: 12, color: '#4a7c4a', marginBottom: 4 },
  title: { fontFamily: 'monospace', fontSize: 22, color: '#00ff41', fontWeight: 'bold', marginBottom: 16,
    textShadowColor: '#00ff4155', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  divider: { height: 1, backgroundColor: '#1a2e1a' },
  section: { marginBottom: 24 },
  sectionLabel: { fontFamily: 'monospace', fontSize: 12, color: '#2a5a2a', marginBottom: 16, fontStyle: 'italic' },
  fieldGroup: { marginBottom: 16 },
  label: { fontFamily: 'monospace', fontSize: 12, color: '#4a7c4a', marginBottom: 6 },
  input: { fontFamily: 'monospace', fontSize: 14, color: '#00ff41', backgroundColor: '#0d160d',
    borderWidth: 1, borderColor: '#1a3a1a', borderRadius: 4, padding: 12 },
  button: { backgroundColor: '#001a00', borderWidth: 1, borderColor: '#00ff41', borderRadius: 4, padding: 16, alignItems: 'center' },
  buttonSecondary: { borderColor: '#2a5a2a', marginBottom: 0 },
  buttonText: { fontFamily: 'monospace', fontSize: 14, color: '#00ff41', fontWeight: 'bold', letterSpacing: 2 },
  buttonTextSecondary: { color: '#4a9a4a' },
  resultBox: { backgroundColor: '#0d160d', borderWidth: 1, borderColor: '#1a3a1a', borderRadius: 4, padding: 16, marginBottom: 24 },
  resultHeader: { fontFamily: 'monospace', fontSize: 12, color: '#2a5a2a', marginBottom: 10, fontStyle: 'italic' },
  resultLine: { fontFamily: 'monospace', fontSize: 13, marginBottom: 4 },
  key: { color: '#4a7c4a' },
  val: { color: '#00ff41' },
  definitivaBox: { backgroundColor: '#001a00', borderWidth: 1, borderColor: '#00ff41', borderRadius: 4, padding: 16, marginBottom: 16, alignItems: 'center' },
  definitivaLabel: { fontFamily: 'monospace', fontSize: 12, color: '#4a7c4a', marginBottom: 4 },
  definitivaVal: { fontFamily: 'monospace', fontSize: 32, color: '#00ff41', fontWeight: 'bold',
    textShadowColor: '#00ff4155', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  successBox: { marginTop: 16, padding: 12, backgroundColor: '#001a00', borderLeftWidth: 3, borderLeftColor: '#00ff41', borderRadius: 2 },
  successText: { fontFamily: 'monospace', fontSize: 13, color: '#00ff41' },
  errorBox: { marginTop: 16, padding: 12, backgroundColor: '#1a0000', borderLeftWidth: 3, borderLeftColor: '#ff3333', borderRadius: 2 },
  errorText: { fontFamily: 'monospace', fontSize: 13, color: '#ff3333' },
});