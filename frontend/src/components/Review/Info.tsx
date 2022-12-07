import { Box, List, Link, ListItem, ListItemText, Button, Typography } from '@material-ui/core';
import React, { ReactElement, useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Link as RouterLink } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  title: {
    fontWeight: 500,
  },
}));

type Props = {
  readonly contact: string | null;
  readonly address: string | null;
};

const InfoItem = ({ text }: { text: string }) => (
  <ListItem disableGutters>
    <ListItemText primary={text} />
  </ListItem>
);

const handleClick = async () => {
  await axios.post(`/newContact/`);
};
export default function Info({ contact, address }: Props): ReactElement {
  const { title } = useStyles();

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
        <Button color="primary" variant="contained" disableElevation onClick={handleClick}>
          Chat with Landlord
        </Button>
      </Link>
    </Box>
  );
}
