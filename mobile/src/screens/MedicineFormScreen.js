import React, { useState } from "react";
import { View, Text, TextInput, Button, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { api } from "../api/client";

export function MedicineFormScreen({ navigation, route }) {
  const { onCreated } = route.params || {};
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    if (!name || !dosage || !time || !duration) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/medicines", { name, dosage, time, duration });
      if (onCreated) {
        onCreated();
      }
      navigation.goBack();
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to add medicine";
      setError(msg);
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Add medicine</Text>
        <Text style={styles.subtitle}>
          Keep it simple: name, dose, time, and how long to take it.
        </Text>

        <Text style={styles.label}>Name</Text>
        <TextInput
          placeholder="e.g. Paracetamol"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Dosage</Text>
        <TextInput
          placeholder="e.g. 500mg"
          value={dosage}
          onChangeText={setDosage}
          style={styles.input}
        />

        <Text style={styles.label}>Time (HH:MM, 24h)</Text>
        <TextInput
          placeholder="08:00"
          value={time}
          onChangeText={setTime}
          style={styles.input}
        />

        <Text style={styles.label}>Duration</Text>
        <TextInput
          placeholder="e.g. 7 days"
          value={duration}
          onChangeText={setDuration}
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ marginTop: 8 }}>
            <Button title="Save medicine" color="#2563eb" onPress={handleSave} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f3f4f6"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 16
  },
  label: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4
  },
  input: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 12,
    backgroundColor: "#f9fafb"
  },
  error: {
    color: "#b91c1c",
    marginBottom: 8
  }
});
