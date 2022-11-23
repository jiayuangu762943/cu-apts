import React, { ReactElement, useState, useEffect } from 'react';
import { Box, Container, Typography, makeStyles } from '@material-ui/core';
// import { get } from '../utils/call';
// import { colors } from '../colors';
import { Avatar } from '@material-ui/core';

type Props = {
  chatId: Number;
  profilePic: string;
  userName: string;
};
const ChatHeader = ({ chatId, profilePic, userName }: Props) => (
  <div className="chat-messages-container">
    <div className="chat-header">
      <Avatar alt={userName} src={profilePic} />
      <div className="xs">{userName}</div>
    </div>
  </div>
);
export default ChatHeader;
