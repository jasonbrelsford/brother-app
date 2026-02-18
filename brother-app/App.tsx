import { StatusBar } from 'expo-status-bar';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { LinearGradient } from 'expo-linear-gradient';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({ PressStart2P_400Regular });
  const messages = [
    { id: 1, text: 'You still whining about being alone?', isBrother: true },
    { id: 2, text: "Yeah man, it's rough.", isBrother: false },
    {
      id: 3,
      text: "Then stop complaining and go meet some brothers. There's a lifting crew in Saint Paul tonight. Reply YES.",
      isBrother: true,
    },
  ];

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BROTHER</Text>
        <Text style={styles.headerSubtitle}>Straight-dope advice · 8-bit mode</Text>
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

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Talk to Brother..."
          placeholderTextColor="#3B404A"
        />
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendIcon}>➤</Text>
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
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 18,
    letterSpacing: 1,
  },
  headerSubtitle: {
    marginTop: 8,
    color: '#7A8190',
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 10,
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
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
    lineHeight: 20,
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
    fontFamily: 'PressStart2P_400Regular',
    fontSize: 12,
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
    fontSize: 18,
  },
  },
});
