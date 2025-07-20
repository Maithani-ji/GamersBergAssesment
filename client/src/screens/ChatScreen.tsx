import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  FlatList,
 
  Alert,
} from 'react-native';
import socket from '../utils/socket';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;


type Message = {
  id: number;
  username: string;
  text: string;
  timestamp: string;
};

export default function ChatScreen({ route }: ChatScreenProps): React.ReactElement{
  const { username } = route.params || { username: 'Guest' };
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList<Message>>(null);

  const [loading, setLoading] = useState(true);

  const sendMessage = () => {
    if (!input.trim()) {
      Alert.alert('Cannot send empty message');
      return;
    }
    
    socket.emit('send_message', { username, text: input });
    setInput('');
    Keyboard.dismiss();
  };

  const lazyLoad = () => {
    return setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    socket.connect();

    socket.on('message_history', (history: Message[]) => {
      setMessages(history);
      timeout = lazyLoad();
    });

    socket.on('receive_message', (msg: Message) => {
   
      setMessages(prev => [msg, ...prev]);
    });

    socket.emit('send_message', {
      username: 'system',
      text: `${username} joined the chat`,
      timestamp: new Date().toISOString(),
    });

    return () => {
      clearTimeout(timeout);
      socket.emit('send_message', {
        username: 'system',
        text: `${username} left the chat`,
        timestamp: new Date().toISOString(),
      });
      socket.off('message_history');
      socket.off('receive_message');
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      // When FlatList is `inverted`, the "latest" message is at the top of the data array,
      // which corresponds to offset: 0 in the FlatList.
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [messages]);

  const renderItem = ({ item }: { item: Message }) => {
    if (item.username === 'system') {
      return (
        <View style={styles.systemMessageWrapper}>
          <Text style={styles.systemMessageText}>{item.text}</Text>
        </View>
      );
    }

    return (
      <View style={styles.messageCard}>
        <Text
          style={[
            styles.messageMeta,
            {
              color: item.username === username ? 'green' : 'black',
              fontWeight: 'bold',
            },
          ]}
        >
          {item.username === username ? 'You' : item.username} •{' '}
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  if (loading) {
    return <ActivityIndicator size="large" color="black" style={{ paddingTop: '50%' }} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {!loading && (
        <FlatList
          ref={flatListRef}
          data={messages}
      
          keyExtractor={(item,index) => index.toString()}
          renderItem={renderItem}
          inverted
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
        />
      )}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message..."
          onSubmitEditing={sendMessage}
          returnKeyType="send"
        />
        {input.trim().length > 0 && (
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={styles.sendText}>Send</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2' },
  messageList: {
    flexGrow: 1,
    padding: 10,
  },
  messageCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  messageMeta: {
    fontSize: 12,
    color: '#555',
    marginBottom: 4,
    fontWeight: '500',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#fff',
    paddingBottom: 30,
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  systemMessageWrapper: {
    alignItems: 'center',
    marginVertical: 6,
  },
  systemMessageText: {
    color: '#888',
    fontSize: 13,
    fontStyle: 'italic',
  },
});
