import React, { ReactElement, useState, useEffect } from 'react';
import { Box, Avatar, Container, Typography, makeStyles } from '@material-ui/core';
// import { get } from '../utils/call';
// import { colors } from '../colors';

type Props = {
  receiverProfilePic: string;
  receiverName: string;
};

const useStyles = makeStyles(() => ({
  title: {
    paddingLeft: '10px',
  },
}));

const ChatHeader = ({ receiverProfilePic, receiverName }: Props) => {
  const { title } = useStyles();
  return (
    <div className="chat-messages-container">
      <div className="chat-header">
        <Avatar src={receiverProfilePic} />
        <div className="xs">{receiverName}</div>
      </div>
    </div>
  );
};
export default ChatHeader;
