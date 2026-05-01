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
  const [cedula, setCedula] = useState("");
  const [result, setResult] = useState<ConsultaResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const consultarNotas = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const apiUrl =
        process.env.EXPO_PUBLIC_API_URL ||
        Constants.expoConfig?.extra?.apiUrl ||
        "";
      const res = await fetch(
        `${apiUrl}notas?cedula=${encodeURIComponent(cedula)}`,
      );
      if (!res.ok) {
        const data = await res.json();
        setError(`// error: ${data.error || "error al consultar"}`);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResult(data);
    } catch {
      setError("// error: conexión fallida");
    }
    setLoading(false);
  };

  const getColor = (def: number) => {
    if (def >= 3.5) return "#00ff41";
    if (def >= 3.0) return "#ffcc00";
    return "#ff3333";
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.prompt}>{">"} consulta.js</Text>
        <Text style={styles.title}>consultar_notas()</Text>
        <View style={styles.divider} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>
          {"/* parámetros de búsqueda */"}
        </Text>
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
          style={styles.button}
          onPress={consultarNotas}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "[ consultando... ]" : "[ CONSULTAR ]"}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {result && (
        <View>
          {/* Estudiante info */}
          <View style={styles.resultBox}>
            <Text style={styles.sectionLabel}>
              {"/* datos del estudiante */"}
            </Text>
            <Text style={styles.resultLine}>
              <Text style={styles.key}>nombre: </Text>
              <Text style={styles.val}>{result.estudiante.nombre}</Text>
            </Text>
            <Text style={styles.resultLine}>
              <Text style={styles.key}>cedula: </Text>
              <Text style={styles.val}>{result.estudiante.cedula}</Text>
            </Text>
            <Text style={styles.resultLine}>
              <Text style={styles.key}>correo: </Text>
              <Text style={styles.val}>{result.estudiante.correo}</Text>
            </Text>
            <Text style={styles.resultLine}>
              <Text style={styles.key}>celular: </Text>
              <Text style={styles.val}>{result.estudiante.celular}</Text>
            </Text>
          </View>

          {/* Notas */}
          <Text style={styles.sectionLabel}>{"/* historial de notas */"}</Text>
          {result.notas.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyText}>{"// sin notas registradas"}</Text>
            </View>
          ) : (
            result.notas.map((item, i) => (
              <View key={i} style={styles.notaCard}>
                <View style={styles.notaHeader}>
                  <Text style={styles.notaMateria}>{item.materia}</Text>
                  <Text
                    style={[
                      styles.notaDef,
                      { color: getColor(item.definitiva) },
                    ]}
                  >
                    {item.definitiva?.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.notaRow}>
                  {[item.nota1, item.nota2, item.nota3, item.nota4].map(
                    (n, j) => (
                      <View key={j} style={styles.notaItem}>
                        <Text style={styles.notaItemLabel}>{`n${j + 1}`}</Text>
                        <Text style={styles.notaItemVal}>{n}</Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      )}
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
    textShadowColor: "#ffffff33",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  divider: { height: 1, backgroundColor: "#1f1f1f" },

  section: { marginBottom: 24 },

  sectionLabel: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#666666",
    marginBottom: 16,
    fontStyle: "italic",
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
    borderColor: "#d6d3d3",
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
  },

  buttonText: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#ffffff73",
    fontWeight: "bold",
    letterSpacing: 2,
  },

  resultBox: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 4,
    padding: 16,
    marginBottom: 24,
  },

  resultLine: {
    fontFamily: "monospace",
    fontSize: 13,
    marginBottom: 4,
  },

  key: { color: "#aaaaaa" },
  val: { color: "#ffffff" },

  notaCard: {
    backgroundColor: "#121212",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderRadius: 4,
    padding: 16,
    marginBottom: 12,
  },

  notaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  notaMateria: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  },

  notaDef: {
    fontFamily: "monospace",
    fontSize: 22,
    fontWeight: "bold",
    color: "#c084fc", // morado suave
    textShadowColor: "#c084fc55",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  notaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  notaItem: {
    alignItems: "center",
    flex: 1,
  },

  notaItemLabel: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#888888",
    marginBottom: 2,
  },

  notaItemVal: {
    fontFamily: "monospace",
    fontSize: 16,
    color: "#dddddd",
  },

  emptyBox: {
    padding: 20,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    borderStyle: "dashed",
    borderRadius: 4,
    alignItems: "center",
  },

  emptyText: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "#777777",
  },

  errorBox: {
    marginTop: 8,
    marginBottom: 16,
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
