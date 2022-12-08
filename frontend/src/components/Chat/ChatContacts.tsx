import React from 'react';
import { Avatar, ListItem } from '@material-ui/core';

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
  // console.log('chatContacts');
  console.log(contacts);
  return (
    <>
      {contacts.map((contact: Contact, index: number) => {
        // console.log(contact);
        // contact.name = String(contact);
        return (
          <ListItem
            // ${index === selected ? 'active' : ''
            className={`chat-preview-container }`}
            onClick={() => handleClick(index)}
          >
            <Avatar className="chat-preview-pic" src={contact.profilePic} />
            {/* <div className="chat-preview">{contact.name}</div> */}
            <div className="chat-preview">{String(contact)}</div>
          </ListItem>
        );
      })}
    </>
  );
};
export default ChatContacts;
