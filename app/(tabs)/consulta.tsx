

import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';

type Nota = {
  materia: string;
  nota1: number;
  nota2: number;
  nota3: number;
  nota4: number;
  definitiva: number;
};

type Estudiante = {
  id: number;
  cedula: string;
  nombre: string;
  correo: string;
  celular: string;
  materia: string;
};

type ConsultaResult = {
  estudiante: Estudiante;
  notas: Nota[];
};

export default function ConsultaScreen() {
  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [result, setResult] = useState<ConsultaResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const consultarNotas = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl || '';
      const res = await fetch(`${apiUrl}notas?cedula=${encodeURIComponent(cedula)}&nombre=${encodeURIComponent(nombre)}`);
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error al consultar');
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError('Error de red');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Consultar Notas</Text>
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
      <Button title={loading ? 'Consultando...' : 'Consultar'} onPress={consultarNotas} disabled={loading} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Estudiante:</Text>
          <Text>Nombre: {result.estudiante.nombre}</Text>
          <Text>Cédula: {result.estudiante.cedula}</Text>
          <Text>Correo: {result.estudiante.correo}</Text>
          <Text>Celular: {result.estudiante.celular}</Text>
          <Text style={styles.resultTitle}>Notas:</Text>
          <FlatList
            data={result.notas}
            keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View style={styles.notaBox}>
                <Text>Materia: {item.materia}</Text>
                <Text>Nota 1: {item.nota1}</Text>
                <Text>Nota 2: {item.nota2}</Text>
                <Text>Nota 3: {item.nota3}</Text>
                <Text>Nota 4: {item.nota4}</Text>
                <Text>Definitiva: {item.definitiva}</Text>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, marginBottom: 12 },
  error: { color: 'red', marginTop: 10 },
  resultBox: { marginTop: 20, padding: 12, backgroundColor: '#f2f2f2', borderRadius: 8 },
  resultTitle: { fontWeight: 'bold', marginTop: 8 },
  notaBox: { marginTop: 10, padding: 8, backgroundColor: '#e6e6e6', borderRadius: 6 },
});
