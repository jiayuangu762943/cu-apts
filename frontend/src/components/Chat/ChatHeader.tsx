import React, { ReactElement, useState, useEffect } from 'react';
import { Box, Container, Typography, makeStyles } from '@material-ui/core';
// import { get } from '../utils/call';
// import { colors } from '../colors';

type Props = {
  chatId: Number;
  profilePic: String;
  userName: String;
};
const ChatHeader = ({ chatId, profilePic, userName }: Props) => (
  <div className="chat-messages-container"></div>
);
export default ChatHeader;
