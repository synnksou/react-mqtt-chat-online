import { useState } from 'react';
import { Box, Button, Input, Stack } from '@chakra-ui/react';

const Login = ({ onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    onSubmit(username);
  };

  const handleUsernameChange = event => {
    setUsername(event.target.value);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Input
            placeholder="Pseudo"
            value={username}
            onChange={handleUsernameChange}
          />
          <Button type="submit">Connection</Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Login;
