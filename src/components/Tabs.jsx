import React, { useEffect, useState } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  IconButton,
  useDisclosure,
  Box,
  Text,
  HStack,
} from '@chakra-ui/react';
import Chat from './Chat';
import { MdAdd, MdClose } from 'react-icons/md';
import AddChatFormModal from './Form/AddChatFormModal';
import { useEffectOnce } from 'react-use';

const TabChat = ({ username, client }) => {
  const [chats, setChats] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDisconnectChat = topicMqtt => {
    client.unsubscribe(topicMqtt);
    client.publish(topicMqtt, `${username}: vient de se déconnecter`);
    setChats(chats.filter(chat => chat.name !== topicMqtt));
  };

  useEffect(() => {
    // S'abonner à tous les topics commençant par "sensor/"

    const regex = /^oneToOne\/(.+)talkWith(.+)$/;

    // Gestionnaire pour les nouveaux messages reçus
    const handleMessage = function (topic, message) {
      // Vérifier si le topic est nouveau
      console.log({ topic, message });
      const match = topic.match(regex);

      if (match) {
        const topicMatchedUsername = match[1];
        const topicMatched = match[2];
        console.log({ topicMatchedUsername, topicMatched, topic });
        if (topicMatchedUsername === username) {
          const chatExists = chats.find(chat => chat.name === topic);
          if (!chatExists) {
            setChats(chats => [...chats, { name: topic }]);
            client.subscribe(topic);
            client.publish(topic, `${username}: vient de se connecter`);
          }
        }
      }
    };

    client.on('message', handleMessage);

    // Nettoyage lors de la déconnexion
    return () => {
      client.off('message', handleMessage);
    };
  }, [client, username, chats]);
  return (
    <>
      <AddChatFormModal
        isOpen={isOpen}
        onClose={onClose}
        setChats={setChats}
        client={client}
        chats={chats}
        username={username}
      />
      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList gap={2}>
          <Tab>Chat General</Tab>
          {chats.map(({ name }, index) => (
            <Tab key={index}>
              <HStack gap={1}>
                <Text>{name}</Text>
                <IconButton
                  aria-label="Add Chat"
                  icon={<MdClose />}
                  backgroundColor="transparent"
                  onClick={() => handleDisconnectChat(name)}
                />
              </HStack>
            </Tab>
          ))}

          <IconButton
            variant="outline"
            aria-label="Add Chat"
            colorScheme="blue"
            icon={<MdAdd />}
            marginLeft="auto"
            onClick={onOpen}
          />
        </TabList>
        <TabPanels>
          <TabPanel>
            <Chat username={username} client={client} topicMqtt={'chat'} />
          </TabPanel>
          {chats.map(({ name }, index) => (
            <TabPanel key={index}>
              <Chat username={username} client={client} topicMqtt={name} />
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </>
  );
};

export default TabChat;
