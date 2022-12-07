import React, { ReactElement, useState, useEffect } from 'react';
import {
  Box,
  List,
  Avatar,
  ListItem,
  ListItemText,
  Container,
  Typography,
  makeStyles,
  TextField,
} from '@material-ui/core';
import axios from 'axios';

// import { get } from '../utils/call';
// import { colors } from '../colors';
type Props = {
  // selected: Number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
  contacts: Contact[];
  // profilePic: string;
  // user: firebase.User | null;
  // username: string;
};
type Contact = {
  name: string;
  profilePic: string;
};

const ChatContacts = ({ setSelected, contacts }: Props) => {
  const handleClick = (index: number) => {
    setSelected(index);
  };
  console.log('chatContacts');
  console.log(contacts);
  return (
    <>
      {contacts.map((contact: Contact, index: number) => {
        return (
          <ListItem
            // ${index === selected ? 'active' : ''
            className={`chat-preview-container }`}
            onClick={() => handleClick(index)}
          >
            <Avatar className="chat-preview-pic" src={contact.profilePic} />
            <div className="chat-preview">{contact.name}</div>
          </ListItem>
        );
      })}
    </>
  );
};
export default ChatContacts;
