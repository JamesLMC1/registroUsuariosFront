import Constants from "expo-constants";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegistroScreen() {
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [celular, setCelular] = useState("");
  const [materia, setMateria] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const registrarEstudiante = async () => {
    setMensaje("");
    setError("");
    setLoading(true);
    try {
      const apiUrl =
        process.env.EXPO_PUBLIC_API_URL ||
        Constants.expoConfig?.extra?.apiUrl ||
        "";
      const res = await fetch(`${apiUrl}estudiantes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cedula, nombre, correo, celular, materia }),
      });
      const data = await res.json();
      if (res.status === 201) {
        setMensaje("// estudiante registrado con éxito ✓");
        setCedula("");
        setNombre("");
        setCorreo("");
        setCelular("");
        setMateria("");
      } else {
        setError(`// error: ${data.error || "Error al registrar"}`);
      }
    } catch {
      setError("// error: conexión fallida");
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.prompt}>{">"} registro.js</Text>
        <Text style={styles.title}>nuevo_estudiante()</Text>
        <View style={styles.divider} />
      </View>

      {/* Form */}
      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{"// cedula"}</Text>
          <TextInput
            style={styles.input}
            placeholder="0000000000"
            placeholderTextColor="#3a4a3a"
            value={cedula}
            onChangeText={setCedula}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{"// nombre"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan Pérez"
            placeholderTextColor="#3a4a3a"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{"// correo"}</Text>
          <TextInput
            style={styles.input}
            placeholder="juan@email.com"
            placeholderTextColor="#3a4a3a"
            value={correo}
            onChangeText={setCorreo}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{"// celular"}</Text>
          <TextInput
            style={styles.input}
            placeholder="3001234567"
            placeholderTextColor="#3a4a3a"
            value={celular}
            onChangeText={setCelular}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>{"// materia"}</Text>
          <TextInput
            style={styles.input}
            placeholder="Matemáticas"
            placeholderTextColor="#3a4a3a"
            value={materia}
            onChangeText={setMateria}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={registrarEstudiante}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "[ ejecutando... ]" : "[ REGISTRAR ]"}
          </Text>
        </TouchableOpacity>

        {mensaje ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{mensaje}</Text>
          </View>
        ) : null}

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0b0b",
  },

  content: {
    padding: 24,
    paddingTop: 60,
  },

  header: {
    marginBottom: 32,
  },

  prompt: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#888888",
    marginBottom: 4,
  },

  title: {
    fontFamily: "monospace",
    fontSize: 22,
    color: "#ffffff",
    fontWeight: "bold",
    marginBottom: 16,
    textShadowColor: "#ffffff33",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "#1f1f1f",
  },

  form: {
    gap: 4,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  label: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#aaaaaa",
    marginBottom: 6,
  },

  input: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#ffffff",
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 4,
    padding: 12,
  },

  button: {
    marginTop: 24,
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
  },

  buttonDisabled: {
    borderColor: "#555555",
  },

  buttonText: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
    letterSpacing: 2,
  },

  successBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#140f1f",
    borderLeftWidth: 3,
    borderLeftColor: "#a855f7",
    borderRadius: 2,
  },

  successText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#e9d5ff",
  },

  errorBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#1a0d0d",
    borderLeftWidth: 3,
    borderLeftColor: "#ff4d4d",
    borderRadius: 2,
  },

  errorText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#ff9999",
  },
});
