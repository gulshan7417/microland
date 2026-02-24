import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { useAuth } from "../AuthContext";

export function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  function Card({ title, subtitle, color, onPress }) {
    return (
      <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.appTitle}>Medicine Companion</Text>
          {user && (
            <Text style={styles.appSubtitle}>
              Logged in as <Text style={{ fontWeight: "600" }}>{user.name}</Text>
            </Text>
          )}
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Card
        title="Daily medicines"
        subtitle="Track medicines, dose timing, and simple reminders."
        color="#2563eb"
        onPress={() => navigation.navigate("Medicines")}
      />

      <Card
        title="AI schedule assistant"
        subtitle='“I have BP + diabetes meds—make a simple schedule + precautions.”'
        color="#0f766e"
        onPress={() => navigation.navigate("Schedule")}
      />

      <Card
        title="Missed-dose alerts"
        subtitle="See taken vs missed doses, and gentle follow‑ups."
        color="#f97316"
        onPress={() => navigation.navigate("Alerts")}
      />

      <Card
        title="Refill reminders"
        subtitle="Track remaining days and nudge before medicines run out."
        color="#7c3aed"
        onPress={() => navigation.navigate("Refills")}
      />

      <Card
        title="Safety & caregiver lock"
        subtitle="Biometrics / PIN for caregiver-only changes and warnings."
        color="#b91c1c"
        onPress={() => navigation.navigate("Safety")}
      />

      <Card
        title="Voice & offline support"
        subtitle="Add meds by voice and keep schedule available offline."
        color="#059669"
        onPress={() => navigation.navigate("VoiceOffline")}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#0b1220"
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f9fafb",
    marginBottom: 4
  },
  appSubtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 2
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderColor: "#4b5563",
    borderWidth: 1
  },
  logoutText: {
    color: "#e5e7eb",
    fontSize: 13
  },
  card: {
    backgroundColor: "#020617",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 4
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#9ca3af"
  }
});

