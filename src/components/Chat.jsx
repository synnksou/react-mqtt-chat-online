import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffectOnce } from 'react-use';

const REGEX = /^([\w\s-]+):/;

const Chat = ({ username, client, topicMqtt }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const handleMessageChange = event => {
    setMessage(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    client.publish(topicMqtt, `${username}: ${message}`);
    console.log('Message sent', { topicMqtt, message });
    setMessage('');
  };

  const handleConnect = () => {
    if (Boolean(topicMqtt !== 'chat')) {
      client.subscribe(topicMqtt);
    }
  };

  const handleMessage = (currentTopic, message) => {
    if (currentTopic === topicMqtt) {
      setMessages(messages => [...messages, message.toString()]);
    }
  };

  useEffect(() => {
    console.log({ messages, message, topicMqtt });
    client.on('message', handleMessage);

    return () => {
      client.off('message', handleMessage);
    };
  }, [client, topicMqtt]);

  return (
    <VStack
      minH="100%"
      alignContent="center"
      justifyContent="center"
      alignItems="center"
    >
      <Heading mb={3}>Bienvenue, {username}!</Heading>
      <Box minW={600} borderWidth="1px" borderRadius="lg" p={3} mb={3}>
        {messages.map((message, index) => {
          return (
            <HStack
              key={index}
              spacing={1}
              p={1}
              justifyContent={
                REGEX.exec(message)[1] === username ? 'flex-end' : 'flex-start'
              }
            >
              <Avatar size="sm" name={REGEX.exec(message)[1]} />
              <Text>{message}</Text>
            </HStack>
          );
        })}
      </Box>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3} minW={600}>
          <Input
            placeholder="Message"
            value={message}
            onChange={handleMessageChange}
          />
          <Button type="submit">Envoyer</Button>
        </Stack>
      </form>
    </VStack>
  );
};

export default Chat;
