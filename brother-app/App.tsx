import { StatusBar } from 'expo-status-bar';
import { useFonts, VT323_400Regular } from '@expo-google-fonts/vt323';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({ VT323_400Regular });
  const [messages, setMessages] = useState([
    { id: 'intro', text: 'Talk to me. What’s the move today?', isBrother: true },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const apiBaseUrl = useMemo(() => {
    return (
      process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '') ??
      'https://brother-app.onrender.com'
    );
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    if (!apiBaseUrl) {
      setError('Set EXPO_PUBLIC_API_URL to your Render API URL.');
      return;
    }

    setError('');
    setIsSending(true);
    setInput('');

    const userMessage = { id: `user-${Date.now()}`, text: trimmed, isBrother: false };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const apiError = data && typeof data.error === 'string' ? data.error : 'Server error';
        throw new Error(`${apiError} (${response.status})`);
      }

      const replyText = typeof data.reply === 'string' ? data.reply : 'No reply.';

      setMessages((prev) => [
        ...prev,
        { id: `brother-${Date.now()}`, text: replyText, isBrother: true },
      ]);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Something went wrong.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BROTHER</Text>
        <Text style={styles.headerSubtitle}>Straight-dope advice · 16-bit mode</Text>
      </View>

      <ScrollView contentContainerStyle={styles.messages}>
        {messages.map((msg) => (
          <View
            key={msg.id}
            style={[styles.bubbleWrap, msg.isBrother ? styles.bubbleRight : styles.bubbleLeft]}
          >
            <LinearGradient
              colors={msg.isBrother ? ['#00FF41', '#008F11'] : ['#2A2D35', '#1B1E24']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.bubble, msg.isBrother ? styles.brotherGlow : styles.userBubble]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Talk to Brother..."
          placeholderTextColor="#3B404A"
          value={input}
          onChangeText={setInput}
          editable={!isSending}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isSending}>
          {isSending ? (
            <ActivityIndicator color="#00FF41" />
          ) : (
            <Text style={styles.sendIcon}>➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1117',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F242E',
  },
  headerTitle: {
    color: '#E0E0E0',
    fontFamily: 'VT323_400Regular',
    fontSize: 26,
    letterSpacing: 2,
  },
  headerSubtitle: {
    marginTop: 8,
    color: '#7A8190',
    fontFamily: 'VT323_400Regular',
    fontSize: 14,
  },
  messages: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  bubbleWrap: {
    maxWidth: '82%',
  },
  bubbleLeft: {
    alignSelf: 'flex-start',
  },
  bubbleRight: {
    alignSelf: 'flex-end',
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 2,
  },
  brotherGlow: {
    borderColor: '#00FF41',
    shadowColor: '#00FF41',
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
  userBubble: {
    borderColor: '#3A3F48',
  },
  messageText: {
    color: '#E0E0E0',
    fontFamily: 'VT323_400Regular',
    fontSize: 18,
    lineHeight: 22,
  },
  errorText: {
    color: '#FF6B00',
    fontFamily: 'VT323_400Regular',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#141820',
    borderTopWidth: 1,
    borderTopColor: '#1F242E',
  },
  input: {
    flex: 1,
    backgroundColor: '#0D0F14',
    borderWidth: 1,
    borderColor: '#262B33',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#00FF41',
    fontFamily: 'VT323_400Regular',
    fontSize: 18,
  },
  sendButton: {
    marginLeft: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00FF41',
  },
  sendIcon: {
    color: '#00FF41',
    fontSize: 20,
  },
});
