import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function AlertsScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Missed‑dose alerts</Text>
        <Text style={styles.subtitle}>
          In this demo, the backend tracks taken vs missed doses. This screen would show
          today's timeline and which doses were missed, with gentle follow‑up messages.
        </Text>
        <Text style={styles.info}>
          • Example: 08:00 BP pill — status: taken{"\n"}
          • Example: 20:00 cholesterol pill — status: missed (alert sent)
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

