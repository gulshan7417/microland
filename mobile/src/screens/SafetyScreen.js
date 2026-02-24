import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, Alert, TextInput, Button } from "react-native";
import {
  getCaregiverSettings,
  setBiometricEnabled,
  setCaregiverPin,
  isBiometricAvailable,
  authenticateCaregiver
} from "../security/caregiverLock";

export function SafetyScreen() {
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [caregiverLock, setCaregiverLockState] = useState(false);
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const settings = await getCaregiverSettings();
        setBiometricEnabledState(settings.biometricEnabled);
        setCaregiverLockState(settings.hasPin);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleToggleBiometric(value) {
    if (!value) {
      setBiometricEnabledState(false);
      await setBiometricEnabled(false);
      return;
    }

    const available = await isBiometricAvailable();
    if (!available) {
      Alert.alert(
        "Biometrics not available",
        "This device does not have enrolled biometrics. Add Face/Touch ID or fingerprint in system settings first."
      );
      return;
    }

    const result = await authenticateCaregiver("Enable biometric unlock");
    if (!result.success) {
      Alert.alert("Not enabled", "Biometric unlock was not confirmed.");
      return;
    }

    setBiometricEnabledState(true);
    await setBiometricEnabled(true);
  }

  async function handleSavePin() {
    if (!pin) {
      await setCaregiverPin("");
      setCaregiverLockState(false);
      Alert.alert("Caregiver lock disabled", "PIN cleared.");
      return;
    }
    if (pin.length < 4) {
      Alert.alert("PIN too short", "Use at least 4 digits.");
      return;
    }
    await setCaregiverPin(pin);
    setCaregiverLockState(true);
    Alert.alert("Caregiver lock set", "PIN saved on this device.");
  }

  if (loading) {
    return (
      <View style={styles.screen}>
        <Text>Loading safety settings…</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Safety & caregiver lock</Text>
        <Text style={styles.subtitle}>
          Use biometrics or a PIN so only a caregiver can change medicines or schedules.
          Elderly patients can still mark doses as taken.
        </Text>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Biometric unlock</Text>
            <Text style={styles.rowSubtitle}>Face / fingerprint on this device.</Text>
          </View>
          <Switch value={biometricEnabled} onValueChange={handleToggleBiometric} />
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.rowTitle}>Caregiver PIN</Text>
            <Text style={styles.rowSubtitle}>
              Set a numeric PIN on this device. Clearing the PIN disables caregiver lock.
            </Text>
          </View>
        </View>

        <TextInput
          style={styles.pinInput}
          value={pin}
          onChangeText={setPin}
          keyboardType="number-pad"
          placeholder={caregiverLock ? "Update PIN (leave empty to clear)" : "Set a 4+ digit PIN"}
          maxLength={8}
        />
        <Button title="Save PIN" onPress={handleSavePin} />
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
    marginBottom: 16
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600"
  },
  rowSubtitle: {
    fontSize: 12,
    color: "#6b7280"
  },
  pinInput: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginVertical: 8,
    backgroundColor: "#f9fafb"
  }
});

