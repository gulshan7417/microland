import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { api } from "../api/client";
import { useAuth } from "../AuthContext";

export function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      // Setting the token in context will cause RootNavigator to switch
      // from the Login stack to the Medicines stack automatically.
      login(res.data.token, res.data.user);
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Login failed";
      setError(msg);
      Alert.alert("Login failed", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>
          Log in to manage daily medicines and gentle AI schedules.
        </Text>

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
            <Button title="Log in" color="#2563eb" onPress={handleLogin} />
          </View>
        )}

        <TouchableOpacity
          style={{ marginTop: 16, alignItems: "center" }}
          onPress={() => navigation.replace("Register")}
        >
          <Text style={styles.switchText}>New here? Create an account</Text>
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

