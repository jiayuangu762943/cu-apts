import React, { ReactElement, useState, useEffect } from 'react';
import { Box, Container, Typography, makeStyles } from '@material-ui/core';
import { get } from '../utils/call';
import styles from './ChatRoomPage.module.scss';
import { CardData, LocationCardData } from '../App';
import { colors } from '../colors';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatSkeleton from '../components/Chat/ChatSkeleton';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatInput from '../components/Chat/ChatInput';
import LinearProgress from '../components/utils/LinearProgress';

type Props = {
  chatId: Number;
  profilePic: String;
  userName: String;
  
};
const ChatRoomPage = ({ chatId, profilePic, userName } : Props)=> {
  const [loading, setLoading] = useState(true);
  <div className="chat-messages-container">
      <ChatHeader
        profilePic={profilePic}
        // setSelectedChat={setSelectedChat}
        userName={userName}
      />

      {loading ? (
        <LinearProgress />
      ) : messages ? (
        <ChatMessages
          chatRef={chatRef}
          chatEndRef={chatEndRef}
          messages={messages}
          profilePic={profilePic}
          user={user}
          username={username}
        />
      ) : null}

      <ChatInput grow={grow} handleSend={handleSend} inputRef={inputRef} />
    </div>
  );
}
export default ChatRoomPage;