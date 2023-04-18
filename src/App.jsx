import React, { useState } from 'react';
import mqtt from 'mqtt';
import Login from './components/Login';
import Layout from './components/Layout';
import TabChat from './components/Tabs';

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

  const handleConnect = username => {
    setUsername(username);
    client.subscribe('chat', { qos: 1 });
  };

  return (
    <Layout>
      {!username ? (
        <Login onSubmit={handleConnect} />
      ) : (
        <TabChat username={username} client={client} tagMqtt={'chat'} />
      )}
    </Layout>
  );
}

export default App;
