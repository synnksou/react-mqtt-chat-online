# Realtime Chat Application

[![Netlify Status](https://api.netlify.com/api/v1/badges/21cab73b-ee6d-423a-81b3-d995ffe49498/deploy-status)](https://app.netlify.com/sites/react-mqtt-chat/deploys)
[Demo](https://react-mqtt-chat.netlify.app)

## Description

This is a real-time chat application built with React, MQTT, and Material-UI. Users can create or join one-to-one chat rooms using a unique topic. They can also see when other users connect or disconnect and receive real-time updates as new messages arrive.

To achieve this functionality, the application uses the following MQTT commands:

### Commands

- `publish`: Used to publish messages to specific topics. This command allows users to send messages to other clients connected to the same topic.
- `subscribe`: Used to listen to messages published on a specific topic. This command allows users to connect to a chat room and receive real-time updates as new messages arrive.
- `unsubscribe`: Used to disconnect from a specific topic. This command allows users to leave a chat room and stop receiving real-time updates.
- `message`: This event is triggered when a message is published to a specific topic. The application listens for this event and processes incoming messages, displaying them in the UI in real-time.

Using MQTT with React allows for a seamless real-time chat experience, and Chakra-UI provides a polished and intuitive user interface. With this application, users can connect with others in real-time and communicate instantly, making it perfect for remote teams, online communities, or anyone who needs to stay connected in real-time.

### How i use it ?

For general messages, the application uses the topic format `/[name]`, where [name] is a custom topic name. This allows users to connect to a general chat and talk with all other users connected to the same topic.

For one-to-one private chats, the application uses the topic format `oneToOne/{username1}TalkWith{username2}`. This format allows for a unique topic to be created for each one-to-one conversation, using the usernames of the two participants.

For one-to-many public chats, the application uses the basic topic format [name]. This allows users to connect to a public chat and converse with all other users connected to the same topic. To join a chat, users can simply search for and enter the topic name.

To enable users to find existing one-to-one topics, the application uses the subscribe command to listen to all topics starting with `oneToOne/` using the `#` symbol as a wildcard. When a new one-to-one topic is created, the application listens for the message event and uses a regular expression (regex) to extract the usernames of the two participants from the topic name. It then creates a unique conversation window for this private chat.

### How work this application ? 

My application is based on the App.jsx file, where the MQTT connection is established using a boolean to toggle between the Login screen and the Chat menu. The application is a Single Page Application. In Tabs.jsx, the logic for connected chats, listening to oneToOne/# topic, the modal for joining a chat or talking to a user, and the general chat is implemented. In the various components, users have the ability to leave a chat by removing it from the list and unsubscribing.

The Chat.jsx component handles the logic for the chat. The handleMessage function sets the messages at the appropriate location, and the component listens to and manages users by chat.


### React Tree Comp

![image](https://user-images.githubusercontent.com/40544802/234679125-c853ddea-493a-430e-9f77-a6b7f1b195f8.png)

## Technologies Used

- React
- MQTT.js
- Chakra-UI
- Vite
- Node.js (v14.15.0 ou plus récent)
- Lodash

## Installation

1. Install [Node.js](https://nodejs.org/en/).
2. Install [Yarn](https://yarnpkg.com/getting-started/install).
3. Clone the repository and navigate to the project directory.
4. Run `yarn install` to install the dependencies.
5. Create a `.env` file and add the following variables:
6. Run `yarn dev` to start the development server.

## License

NO - LICENSE
