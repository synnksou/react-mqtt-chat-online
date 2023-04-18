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
} from '@chakra-ui/react';
import Chat from './Chat';
import { MdAdd } from 'react-icons/md';
import AddChatFormModal from './Form/AddChatFormModal';

const TabChat = ({ username, client }) => {
  const [chats, setChats] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
            <Tab key={index}>{name}</Tab>
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
