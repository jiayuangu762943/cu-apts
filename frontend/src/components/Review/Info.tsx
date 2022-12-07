import { Box, List, Link, ListItem, ListItemText, Button, Typography } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const useStyles = makeStyles(() => ({
  title: {
    fontWeight: 500,
  },
}));

type Props = {
  readonly contact: string | null;
  readonly address: string | null;
  readonly landlordName: string;
  readonly userName: string;
};

const InfoItem = ({ text }: { text: string }) => (
  <ListItem disableGutters>
    <ListItemText primary={text} />
  </ListItem>
);

export default function Info({ contact, address, landlordName, userName }: Props): ReactElement {
  const { title } = useStyles();

  const handleClick = async () => {
    const landlordNameNoSpace = landlordName.split(' ').join('_');
    const userNameNoSpace = userName.split(' ').join('_');
    await axios.post(`/newContact/${userNameNoSpace}/${landlordNameNoSpace}`);
  };
  return (
    <Box mt={1}>
      <Typography variant="h6" className={title}>
        Info
      </Typography>
      <List dense>
        {contact && <InfoItem text={`Contact: ${contact}`} />}
        {address && <InfoItem text={`Address: ${address}`} />}
      </List>
      <Link
        {...{
          to: `/chat`,
          style: { textDecoration: 'none' },
          component: RouterLink,
        }}
      >
        {/* onClick={handleClick} */}
        <Button color="primary" variant="contained" disableElevation onClick={handleClick}>
          Chat with Landlord
        </Button>
      </Link>
    </Box>
  );
}
