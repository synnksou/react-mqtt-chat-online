import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';

const REGEX = /^([\w\s-]+):/;

const Chat = ({ username, client, topicMqtt }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);

  const handleMessageChange = event => {
    setMessage(event.target.value);
  };

  const handleSubmit = event => {
    event.preventDefault();
    client.publish(topicMqtt, `${username}: ${message}`);
    console.log('Message sent', { topicMqtt, message });
    setMessage('');
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

  useEffect(() => {
    messages.forEach(message => {
      const user = REGEX.exec(message)[1];
      if (
        (!users.includes(user) && message.includes('vient de se connecter')) ||
        !users.includes(user)
      ) {
        setUsers(users => [...users, user]);
      }

      if (message.includes('vient de se déconnecter')) {
        setUsers(users => users.filter(user => user !== message));
      }
    });
  }, [messages, users]);

  return (
    <VStack
      minH="100%"
      alignContent="center"
      justifyContent="center"
      alignItems="center"
    >
      <HStack justifyContent="space-between" maxW="600" w="100%">
        <Heading mb={3}>Bienvenue, {username}!</Heading>
        <AvatarGroup size="sm" max={3}>
          {users.map(user => (
            <Avatar name={user} />
          ))}
        </AvatarGroup>
      </HStack>
      <Box minW={600} borderWidth="1px" borderRadius="lg" p={3} mb={3}>
        {messages.map((message, index) => {
          return (
            <>
              {message.includes('vient de se connecter') ||
              message.includes('vient de se déconnecter') ? (
                <HStack
                  key={index}
                  spacing={1}
                  p={1}
                  alignSelf="center"
                  color="gray.400"
                >
                  <Text>{message}</Text>
                </HStack>
              ) : (
                <HStack
                  key={index}
                  spacing={1}
                  p={1}
                  justifyContent={
                    REGEX.exec(message)[1] === username
                      ? 'flex-end'
                      : 'flex-start'
                  }
                >
                  <Avatar size="sm" name={REGEX.exec(message)[1]} />
                  <Text>{message}</Text>
                </HStack>
              )}
            </>
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
