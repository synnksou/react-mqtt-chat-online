import { useState } from 'react';
import { Container, Flex } from '@chakra-ui/react';
import mqtt from 'mqtt';
import Login from './components/Login';
import Chat from './components/Chat';
import Layout from './components/Layout';

const client = mqtt.connect(
  'wss://6bb60973616b45f3917851ac49512f88.s2.eu.hivemq.cloud:8884/mqtt',
  {
    username: 'efficomAntoine',
    password: 'password59@',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false,
    },
    rejectUnauthorized: false,
  },
);

console.log('Client subscribed ');

function App() {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const handleConnect = username => {
    setUsername(username);
    client.subscribe('chat', { qos: 1 });
  };

  /*   const handleMessageChange = event => {
    setMessage(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    client.publish('chat', `${username}: ${message}`);
    setMessage('');
  };
 */
  return (
    <Layout>
      {!username ? (
        <Login onSubmit={handleConnect} />
      ) : (
        <Chat username={username} client={client} tagMqtt={'chat'} />
      )}

      {/*     {username && (
        <VStack
          minH="100%"
          alignContent="center"
          justifyContent="center"
          alignItems="center"
        >
          <Text mb={3}>Welcome, {username}!</Text>
          <Box minW={300} borderWidth="1px" borderRadius="lg" p={3} mb={3}>
            {messages.map((message, index) => (
              <Text key={index}>{message}</Text>
            ))}
          </Box>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Input
                placeholder="Message"
                value={message}
                onChange={handleMessageChange}
              />
              <Button type="submit">Send</Button>
            </Stack>
          </form>
        </VStack>
      )} */}
    </Layout>
  );
}

export default App;
