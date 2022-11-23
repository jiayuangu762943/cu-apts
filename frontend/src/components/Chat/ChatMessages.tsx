import React, { ReactElement, useState, useEffect } from 'react';
import { Box, Container, Typography, makeStyles } from '@material-ui/core';
// import { get } from '../utils/call';
// import { colors } from '../colors';

type Props = {
  messages: string;
  profilePic: string;
  // user: firebase.User | null;
  username: string;
};
const ChatMessages = () => <div className="chat-messages-container"></div>;
export default ChatMessages;
