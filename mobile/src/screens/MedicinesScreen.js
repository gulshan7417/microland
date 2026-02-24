import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Button, StyleSheet } from "react-native";
import { fetchMedicines } from "../api/client";

export function MedicinesScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [meds, setMeds] = useState([]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchMedicines();
      setMeds(data);
    } catch (e) {
      setError(e.message || "Failed to load medicines");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  const hasMeds = meds && meds.length > 0;

  return (
    <View style={styles.screen}>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily medicines</Text>
        <Text style={styles.cardSubtitle}>
          Add simple reminders for each medicine and time.
        </Text>

        <View style={styles.primaryButtonWrapper}>
          <Button
            title="Add medicine"
            color="#2563eb"
            onPress={() => navigation.navigate("AddMedicine", { onCreated: load })}
          />
        </View>

        {!hasMeds ? (
          <Text style={styles.emptyText}>
            No medicines added yet. Add your first reminder above.
          </Text>
        ) : (
          <FlatList
            style={{ marginTop: 12 }}
            data={meds}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.medicineRow}>
                <View>
                  <Text style={styles.medicineTime}>{item.time}</Text>
                  <Text style={styles.medicineName}>{item.name}</Text>
                  <Text style={styles.medicineMeta}>
                    {item.dosage} • {item.duration}
                  </Text>
                </View>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.bottomButtonWrapper}>
        <Button
          title="Generate AI schedule & precautions"
          color="#0f766e"
          onPress={() => navigation.navigate("Schedule")}
        />
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6"
  },
  error: {
    color: "#b91c1c",
    marginBottom: 8
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
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 12
  },
  primaryButtonWrapper: {
    marginBottom: 8
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: "#4b5563"
  },
  medicineRow: {
    paddingVertical: 10,
    borderBottomColor: "#e5e7eb",
    borderBottomWidth: 1
  },
  medicineTime: {
    fontSize: 13,
    color: "#6b7280"
  },
  medicineName: {
    fontSize: 16,
    fontWeight: "600"
  },
  medicineMeta: {
    fontSize: 13,
    color: "#6b7280"
  },
  bottomButtonWrapper: {
    marginTop: 16
  }
});

