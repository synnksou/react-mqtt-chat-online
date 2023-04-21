import React, { useState } from 'react';
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
  /* 
  useEffectOnce(() => {
    // S'abonner à tous les topics commençant par "sensor/"

    // Gestionnaire pour les nouveaux messages reçus
    client.on('message', function (topic, message) {
      // Vérifier si le topic est nouveau
      console.log({ topic, message });
      const regex = /^oneToOne\/(.+)talkWidth(.+)$/;
      const match = topic.match(regex);

      const topicMatchedUsername = match[1];
      console.log({ topicMatchedUsername, topicMatched });
      if (match) {
        if (topicMatchedUsername === username) {
          const chatExists = chats.find(chat => chat.topic === topic);
          if (!chatExists) {
            setChats(chats => [...chats, { topic }]);
            client.subscribe(topic);
            client.publish(topic, `${username}: vient de se connecter`);
          }
        }
      }
    });

    // Nettoyage lors de la déconnexion
    return () => {
      client.end();
    };
  }); */

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
