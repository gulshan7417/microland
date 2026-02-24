import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { api } from "../api/client";
import { useAuth } from "../AuthContext";

export function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", {
        name,
        age: Number(age),
        conditions: [],
        email,
        password
      });
      login(res.data.token, res.data.user);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Registration failed";
      setError(msg);
      Alert.alert("Registration failed", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Create an account</Text>
        <Text style={styles.subtitle}>
          Set up a simple caregiver account to manage medicines.
        </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="e.g. Caregiver name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          placeholder="e.g. 21"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ marginTop: 8 }}>
            <Button title="Sign up" color="#2563eb" onPress={handleRegister} />
          </View>
        )}

        <TouchableOpacity
          style={{ marginTop: 16, alignItems: "center" }}
          onPress={() => navigation.replace("Login")}
        >
          <Text style={styles.switchText}>Already have an account? Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#0b1220"
  },
  card: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 4,
    textAlign: "center"
  },
  subtitle: {
    fontSize: 13,
    color: "#9ca3af",
    marginBottom: 20,
    textAlign: "center"
  },
  label: {
    fontSize: 13,
    color: "#e5e7eb",
    marginBottom: 4
  },
  input: {
    borderColor: "#1f2937",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: "#020617",
    color: "#f9fafb"
  },
  error: {
    color: "#f97316",
    marginBottom: 8
  },
  switchText: {
    fontSize: 13,
    color: "#93c5fd"
  }
});

