import Constants from "expo-constants";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Estudiante = {
  id: number;
  cedula: string;
  nombre: string;
  correo: string;
  celular: string;
  materia: string;
};

export default function NotasScreen() {
  const [cedula, setCedula] = useState("");
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [notas, setNotas] = useState({
    nota1: "",
    nota2: "",
    nota3: "",
    nota4: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const buscarEstudiante = async () => {
    setMensaje("");
    setError("");
    setEstudiante(null);

    if (!cedula) {
      setError("// error: cédula");
      return;
    }

    setLoading(true);
    try {
      const apiUrl =
        process.env.EXPO_PUBLIC_API_URL ||
        Constants.expoConfig?.extra?.apiUrl ||
        "";

      const res = await fetch(
        `${apiUrl}buscar-estudiante?cedula=${encodeURIComponent(
          cedula,
        )}`,
      );

      const data = await res.json();

      if (res.ok && data.estudiante) {
        setEstudiante(data.estudiante);
      } else {
        setError(`// error: ${data.error || "no encontrado"}`);
      }
    } catch {
      setError("// error: conexión fallida");
    }

    setLoading(false);
  };

  const registrarNotas = async () => {
    setMensaje("");
    setError("");

    if (!estudiante) {
      setError("// error: busque el estudiante primero");
      return;
    }

    const n1 = parseFloat(notas.nota1);
    const n2 = parseFloat(notas.nota2);
    const n3 = parseFloat(notas.nota3);
    const n4 = parseFloat(notas.nota4);

    if ([n1, n2, n3, n4].some(isNaN)) {
      setError("// error: ingrese las 4 notas");
      return;
    }

    setLoading(true);

    try {
      const apiUrl =
        process.env.EXPO_PUBLIC_API_URL ||
        Constants.expoConfig?.extra?.apiUrl ||
        "";

      const res = await fetch(`${apiUrl}notas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        estudiante_id: estudiante?.id,
        materia: estudiante?.materia,
        nota1: n1,
        nota2: n2,
        nota3: n3,
        nota4: n4,
      }),
      });

      const data = await res.json();

      if (res.status === 201) {
        setMensaje(
          `// notas registradas ✓ definitiva: ${data.notas.definitiva}`,
        );
        setNotas({ nota1: "", nota2: "", nota3: "", nota4: "" });
      } else {
        setError(`// error: ${data.error || "error al registrar"}`);
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
        <Text style={styles.prompt}>{">"} notas.js</Text>
        <Text style={styles.title}>registrar_notas()</Text>
        <View style={styles.divider} />
      </View>

      {/* Buscar estudiante */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>{"/* buscar estudiante */"}</Text>

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
            value={estudiante?.nombre ?? ""}
            editable={false}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={buscarEstudiante}
          disabled={loading}
        >
          <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
            {loading ? "[ buscando... ]" : "[ BUSCAR ]"}
          </Text>
        </TouchableOpacity>
      </View>

        {/* Resultado */}
        {estudiante && (
          <View style={styles.resultBox}>
            <Text style={styles.resultHeader}>{"// estudiante encontrado"}</Text>

            <Text style={styles.resultLine}>
              <Text style={styles.key}>nombre: </Text>
              <Text style={styles.val}>{estudiante?.nombre}</Text>
            </Text>

            <Text style={styles.resultLine}>
              <Text style={styles.key}>cedula: </Text>
              <Text style={styles.val}>{estudiante?.cedula}</Text>
            </Text>

            <Text style={styles.resultLine}>
              <Text style={styles.key}>materia: </Text>
              <Text style={styles.val}>{estudiante?.materia}</Text>
            </Text>
          </View>
        )}
      {/* Notas */}
      {estudiante && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{"/* ingresar notas */"}</Text>

          {["nota1", "nota2", "nota3", "nota4"].map((key, i) => (
            <View key={key} style={styles.fieldGroup}>
              <Text style={styles.label}>{`// nota${i + 1}`}</Text>
              <TextInput
                style={styles.input}
                placeholder="0.0"
                placeholderTextColor="#3a4a3a"
                value={notas[key as keyof typeof notas]}
                onChangeText={(v) => setNotas((n) => ({ ...n, [key]: v }))}
                keyboardType="numeric"
              />
            </View>
          ))}

          <TouchableOpacity
            style={styles.button}
            onPress={registrarNotas}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "[ ejecutando... ]" : "[ REGISTRAR NOTAS ]"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Mensajes */}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b0b0b" },
  content: { padding: 24, paddingTop: 60 },

  header: { marginBottom: 32 },

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
  },

  divider: { height: 1, backgroundColor: "#1f1f1f" },

  section: { marginBottom: 24 },

  sectionLabel: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#666666",
    marginBottom: 16,
  },

  fieldGroup: { marginBottom: 16 },

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
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
  },

  buttonSecondary: {
    borderColor: "#666666",
  },

  buttonText: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },

  buttonTextSecondary: {
    color: "#aaaaaa",
  },

  resultBox: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
  },

  resultHeader: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#888888",
    marginBottom: 10,
  },

  resultLine: {
    fontFamily: "monospace",
    fontSize: 13,
    marginBottom: 4,
  },

  key: { color: "#aaaaaa" },
  val: { color: "#ffffff" },

  successBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#140f1f",
    borderLeftWidth: 3,
    borderLeftColor: "#a855f7", // morado
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
  },

  errorText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#ff9999",
  },
});
