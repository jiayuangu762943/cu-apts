import React, { ReactElement, useState, useEffect } from 'react';
import { Box, Container, Typography, makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { get } from '../utils/call';
import styles from './ChatRoomPage.module.scss';
import { CardData, LocationCardData } from '../App';
import { colors } from '../colors';
import ChatHeader from '../components/Chat/ChatHeader';
import { Message } from '../../../common/types/db-types';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatInput from '../components/Chat/ChatInput';
import LinearProgress from '../components/utils/LinearProgress';

// type Props = {
//   chatId: Number;
//   profilePic: String;
//   userName: String;
// }
const ChatRoomPage = (): ReactElement => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const { chatId, profilePic, userName } = useParams<Record<string, string>>();
  // const user = await getUser(true);
  useEffect(() => {
    if (loading) {
      get<Message[]>(`/messages`, {
        callback: (data) => {
          setMessages(data);
          setLoading(false);
        },
      });
    }
  }, [loading]);

  return (
    <div className="chat-messages-container">
      <ChatHeader
        profilePic={profilePic}
        chatId={Number(chatId)}
        // setSelectedChat={setSelectedChat}
        userName={userName}
      />

      {loading ? (
        <LinearProgress />
      ) : messages ? (
        <ChatMessages
        // messages={messages}
        // profilePic={profilePic}
        // user={user}
        // username={userName}
        />
      ) : null}

      <ChatInput />
    </div>
  );
};
export default ChatRoomPage;
