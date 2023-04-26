import React, { useState } from 'react';
import mqtt from 'mqtt';
import Login from './components/Login';
import Layout from './components/Layout';
import TabChat from './components/Tabs';
import { useToast } from '@chakra-ui/react';

function App() {
  const [username, setUsername] = useState('');
  const [client, setClient] = useState();
  const toast = useToast();

  const handleConnect = username => {
    try {
      const mqttClient = mqtt.connect(
        'wss://6bb60973616b45f3917851ac49512f88.s2.eu.hivemq.cloud:8884/mqtt',
        {
          username: 'efficomAntoine',
          password: 'password59@',
          clientId: username, // Username unique
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

      mqttClient.on('connect', () => {
        console.log('connected to MQTT broker');
        setClient(mqttClient);
        setUsername(username);
        // Chat General
        mqttClient.subscribe('chat', { qos: 1 });
        mqttClient.subscribe('oneToOne/#');

        // Chat privé qu'on écoute si notre username est dans le topic alors un chat s'ouvre avec l'emetteur
        // On envoie un message de connection
        mqttClient.publish('chat', `${username}: vient de se connecter`);

        toast({
          title: 'Connection réussi.',
          description:
            'Vous venez de vous connecter, bienvenue sur notre chat !',
          status: 'success',
          duration: 9000,
          isClosable: true,
          position: 'top',
        });
      });

      mqttClient.on('error', e => {
        console.log('Error', e);
        toast({
          title: 'Oups..',
          description: 'Une erreur est survenue',
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: 'top',
        });
      });

      mqttClient.on('close', () => {
        console.log('Connection closed');
        mqttClient.end();
        toast({
          title: 'Oups..',
          description:
            'Vous avez été déconnecté. Par timeout ou volontairement par un autre user connecté avec votre username',
          status: 'warning',
          duration: 9000,
          isClosable: true,
          position: 'top',
        });
        setUsername('');
      });
    } catch (error) {
      console.log(error);
      toast({
        title: 'Oups..',
        description: 'Une erreur est survenue' + error,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      mqttClient.end();
    }
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
