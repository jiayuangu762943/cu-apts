import React from 'react';
import { Avatar, makeStyles } from '@material-ui/core';
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
    <div className="chat-preview-container">
      <div className="chat-header">
        <Avatar className="chat-preview-pic" src={receiverProfilePic} />
        <div className="chat-preview">{receiverName}</div>
      </div>
    </div>
  );
};
export default ChatHeader;
