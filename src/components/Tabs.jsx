import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Button,
  IconButton,
} from '@chakra-ui/react';
import Chat from './Chat';
import { MdAdd } from 'react-icons/md';

const TabChat = ({ username, client }) => {
  const [chats, setChats] = useState([]);

  const handleAddChat = () => {
    setChats([...chats, { name: 'New Chat' }]);
    client.subscribe('New Chat', { qos: 1 });
  };

  return (
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
          onClick={handleAddChat}
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
  );
};

export default TabChat;
