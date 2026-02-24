import React, { useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Button, Alert, TextInput, NativeModules } from "react-native";
import { api } from "../api/client";

function normalizeTime(raw) {
  if (!raw) return "";
  const s = String(raw).trim().toLowerCase();

  // 08:30, 8:30, 8 : 30
  const hhmm = s.match(/^(\d{1,2})\s*:\s*(\d{2})\s*(am|pm)?$/i);
  if (hhmm) {
    let h = parseInt(hhmm[1], 10);
    const m = parseInt(hhmm[2], 10);
    const ap = hhmm[3];
    if (ap) {
      const isPm = ap.toLowerCase() === "pm";
      if (h === 12) h = isPm ? 12 : 0;
      else if (isPm) h += 12;
    }
    if (Number.isNaN(h) || Number.isNaN(m)) return "";
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  // "8 am" / "8pm"
  const ham = s.match(/^(\d{1,2})\s*(am|pm)$/i);
  if (ham) {
    let h = parseInt(ham[1], 10);
    const isPm = ham[2].toLowerCase() === "pm";
    if (h === 12) h = isPm ? 12 : 0;
    else if (isPm) h += 12;
    return `${String(h).padStart(2, "0")}:00`;
  }

  return "";
}

function parseMedicineCommand(text) {
  // Supports examples like:
  // "Add Paracetamol 500mg at 8 AM for 5 days"
  const str = String(text || "").trim();
  if (!str) return null;

  const nameMatch = str.match(/add\s+(.+?)(\s+\d|\s+at\s+)/i);
  const doseMatch = str.match(/(\d+\s*(mg|mcg|ml))/i);
  const timeMatch = str.match(/\bat\s+([0-9:\s]+(am|pm)?)/i) || str.match(/(\d{1,2}\s*(am|pm))/i);
  const durationMatch = str.match(/for\s+(\d+\s*days?)/i);

  const name = nameMatch ? nameMatch[1].trim() : "";
  const dosage = doseMatch ? doseMatch[1].replace(/\s+/g, "") : "";
  const time = normalizeTime(timeMatch ? timeMatch[1] : "");
  const duration = durationMatch ? durationMatch[1].trim() : "7 days";

  if (!name || !dosage || !time) return null;
  return { name, dosage, time, duration };
}

export function VoiceOfflineScreen() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [saving, setSaving] = useState(false);

  const voiceRef = useRef(null);

  const voiceModule = useMemo(() => {
    try {
      // Lazy-require so Expo Go doesn't crash at import time.
      const mod = require("@react-native-voice/voice");
      return mod?.default || mod;
    } catch {
      return null;
    }
  }, []);

  const voiceAvailable = useMemo(() => {
    // In Expo Go, the native module isn't present even if JS is.
    return Boolean(voiceModule) && Boolean(NativeModules.Voice);
  }, [voiceModule]);

  useEffect(() => {
    if (!voiceModule) return;
    voiceRef.current = voiceModule;

    try {
      voiceModule.onSpeechStart = () => setListening(true);
      voiceModule.onSpeechEnd = () => setListening(false);
      voiceModule.onSpeechError = (e) => {
        setListening(false);
        const msg = e?.error?.message || "Speech recognition error";
        Alert.alert("Voice error", msg);
      };
      voiceModule.onSpeechResults = (e) => {
        const first = e?.value?.[0];
        if (first) setTranscript(first);
      };
    } catch {
      // ignore
    }

    return () => {
      try {
        voiceModule.destroy();
        voiceModule.removeAllListeners();
      } catch {
        // ignore
      }
    };
  }, [voiceModule]);

  function showSetupHelp() {
    Alert.alert(
      "Voice setup",
      "This feature needs a Development Build (not Expo Go) because it uses the device microphone.\n\nRun a dev build with EAS, then open the app again."
    );
  }

  async function startListening() {
    if (!voiceAvailable) return showSetupHelp();
    try {
      setTranscript("");
      await voiceRef.current.start("en-US");
    } catch (e) {
      Alert.alert("Voice error", e?.message || "Could not start listening");
    }
  }

  async function stopListening() {
    try {
      await voiceRef.current.stop();
      setListening(false);
    } catch {
      setListening(false);
    }
  }

  async function handleSave() {
    const parsed = parseMedicineCommand(transcript);
    if (!parsed) {
      Alert.alert(
        "Could not understand",
        'Say something like: "Add Paracetamol 500mg at 8 AM for 5 days".'
      );
      return;
    }

    try {
      setSaving(true);
      await api.post("/medicines", parsed);
      Alert.alert("Saved", `Added "${parsed.name}" at ${parsed.time}.`);
      setTranscript("");
    } catch (e) {
      const msg = e.response?.data?.message || e.message || "Failed to save medicine";
      Alert.alert("Error", msg);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Voice input</Text>
        <Text style={styles.subtitle}>
          Tap “Start listening”, speak your instruction, then save. Example:{"\n"}
          Add Paracetamol 500mg at 8 AM for 5 days
        </Text>

        {!voiceAvailable ? (
          <Text style={styles.warning}>
            Voice is not available in Expo Go. Build a Development Build to enable in‑app
            microphone voice input.
          </Text>
        ) : null}

        <View style={styles.row}>
          <View style={styles.buttonWrap}>
            <Button
              title={listening ? "Listening…" : "Start listening"}
              onPress={startListening}
              color="#0f766e"
              disabled={saving || listening}
            />
          </View>
          <View style={styles.buttonWrap}>
            <Button
              title="Stop"
              onPress={stopListening}
              color="#6b7280"
              disabled={saving || !listening}
            />
          </View>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Your speech will appear here…"
          value={transcript}
          onChangeText={setTranscript}
          multiline
        />

        <View style={{ marginTop: 10 }}>
          <Button
            title={saving ? "Saving…" : "Save medicine"}
            onPress={handleSave}
            color="#2563eb"
            disabled={saving || !transcript.trim()}
          />
        </View>

        <Text style={styles.info}>
          Offline mode: the app can cache the latest AI schedule and daily medicines so
          they remain visible without internet. Updates sync when you come back online.
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
  warning: {
    fontSize: 13,
    color: "#b91c1c",
    marginBottom: 12
  },
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12
  },
  buttonWrap: {
    flex: 1
  },
  input: {
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minHeight: 80,
    backgroundColor: "#f9fafb"
  },
  info: {
    marginTop: 16,
    fontSize: 14,
    color: "#374151"
  }
});

