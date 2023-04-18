import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Input,
  Button,
  useToast,
  Text,
} from '@chakra-ui/react';

const AddChatFormModal = ({
  isOpen,
  onClose,
  setChats,
  chats,
  client,
  username,
}) => {
  const [topicMqtt, setTopicMqtt] = useState('');
  const toast = useToast();

  const handleSubmit = event => {
    console.log('lol');
    event.preventDefault();
    try {
      client.subscribe(topicMqtt, { qos: 1 });
      setChats([...chats, { name: topicMqtt }]);
      toast({
        title: 'Nouveau chat créé.',
        description:
          'Nous avons créé un nouveau chat rien que pour vous et vos amis.',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      client.publish(topicMqtt, `${username}: vient de se connecter`);
      onClose();
      console.log('New chat created');
    } catch (error) {
      console.log(error);
      toast({
        title: 'Oups..',
        description: 'Une erreur est survenue',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  const handleChangeTopicMqtt = event => {
    setTopicMqtt(event.target.value);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Ajouter un nouveau chat</ModalHeader>
          <ModalCloseButton />

          <form onSubmit={handleSubmit}>
            <ModalBody>
              <Text>Vous pouvez créé ou rejoindre un canal</Text>
              <Stack spacing={3}>
                <Input
                  placeholder="Nom du chat (Topic MQTT)"
                  value={topicMqtt}
                  onChange={handleChangeTopicMqtt}
                />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="red" mr={3} onClick={onClose}>
                Fermer
              </Button>
              <Button variant="ghost" type="submit">
                Entrer
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddChatFormModal;
