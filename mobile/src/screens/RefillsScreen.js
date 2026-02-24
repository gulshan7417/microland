import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function RefillsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Refill reminders</Text>
        <Text style={styles.subtitle}>
          The full product would track how many days of each medicine are left, and warn
          the caregiver a few days before running out.
        </Text>
        <Text style={styles.info}>
          • Paracetamol — 5 days left — reminder set for 2 days before{"\n"}
          • Metformin — 12 days left — no reminder yet
        </Text>
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
    padding: 16
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4
  },
  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 12
  },
  info: {
    fontSize: 14,
    color: "#374151"
  }
});

