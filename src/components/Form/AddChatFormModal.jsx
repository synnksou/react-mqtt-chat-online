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
  Switch,
  FormControl,
  FormLabel,
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
  const [isOneToOne, setIsOneToOne] = useState(false);

  console.log({ isOneToOne });
  // Create a new chat or join an existing one
  const handleSubmit = event => {
    event.preventDefault();
    try {
      if (isOneToOne) {
        //setTopicMqtt(`oneToOne/${topicMqtt} talkWith ${username}`);
        const oneToOneTopic = `oneToOne/${topicMqtt}talkWith${username}`;
        console.log({ topicMqtt });
        client.subscribe(oneToOneTopic);
        client.publish(oneToOneTopic, `${username}: vient de se connecter`);
        setChats([...chats, { name: oneToOneTopic }]);
      } else {
        client.subscribe(topicMqtt);
        client.publish(topicMqtt, `${username}: vient de se connecter`);
        setChats([...chats, { name: topicMqtt }]);
      }

      toast({
        title: 'Nouveau chat créé.',
        description:
          'Nous avons créé un nouveau chat rien que pour vous et vos amis.',
        status: 'success',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
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
              <FormControl display="flex" alignItems="center" py={3}>
                <FormLabel htmlFor="email-alerts" mb="0">
                  Conversation one to one ?
                </FormLabel>
                <Switch
                  id="email-alerts"
                  isChecked={isOneToOne}
                  onChange={() => setIsOneToOne(!isOneToOne)}
                />
              </FormControl>

              {!isOneToOne ? (
                <>
                  <Text>Vous pouvez créé ou rejoindre un canal</Text>
                  <Stack spacing={3} py={3}>
                    <Input
                      placeholder="Nom du chat (Topic MQTT)"
                      value={topicMqtt}
                      onChange={handleChangeTopicMqtt}
                    />
                  </Stack>
                </>
              ) : (
                <>
                  <Text>
                    Vous pouvez envoyer un message privé si la personne est
                    connecté
                  </Text>
                  <Stack spacing={3} py={3}>
                    <Input
                      placeholder="Pseudo de la personne"
                      value={topicMqtt}
                      onChange={handleChangeTopicMqtt}
                    />
                  </Stack>
                </>
              )}
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
