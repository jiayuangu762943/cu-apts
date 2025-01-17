import React, { ReactElement, useState, useEffect } from 'react';
import { Box, Container, Typography, makeStyles } from '@material-ui/core';
import Autocomplete from '../components/Home/Autocomplete';
import { get } from '../utils/call';
import styles from './HomePage.module.scss';
import ApartmentCards from '../components/ApartmentCard/ApartmentCards';
import LocationCards from '../components/Home/LocationCards';
import { CardData, LocationCardData } from '../App';
import { colors } from '../colors';

const useStyles = makeStyles({
  jumboText: {
    color: colors.white,
    fontWeight: 600,
    margin: '0.5em 0 0.5em 0',
  },
  jumboSub: {
    color: colors.white,
    fontWeight: 400,
  },
  rentingBox: {
    marginTop: '2em',
    marginBottom: '2em',
  },
  rentingText: {
    marginBottom: '1em',
    fontWeight: 500,
    color: colors.red1,
  },
});

const HomePage = (): ReactElement => {
  const classes = useStyles();
  const [homeData, setHomeData] = useState<CardData[]>([]);

  useEffect(() => {
    get<CardData[]>(`/page-data/home`, {
      callback: setHomeData,
    });
  }, []);

  const locationData: LocationCardData[] = [
    {
      photo: '',
      location: 'Collegetown',
    },
    {
      photo: '',
      location: 'West',
    },
    {
      photo: '',
      location: 'Downtown',
    },
    {
      photo: '',
      location: 'North',
    },
  ];

  return (
    <>
      <Box className={styles.JumboTron}>
        <Container maxWidth="lg">
          <Box py={6}>
            <Typography variant="h1" className={classes.jumboText}>
              Search Renting Companies
            </Typography>
            <Typography variant="body1" className={classes.jumboSub}>
              Search for off-campus housing, review apartments, and share feedback!
            </Typography>
          </Box>
          <Box pb={5} mx={0}>
            <Autocomplete />
          </Box>
        </Container>
      </Box>

      <Box>
        <Container maxWidth="lg">
          <Box textAlign="center" className={classes.rentingBox}>
            <Typography variant="h2" className={classes.rentingText}>
              Find the Best Properties in Ithaca
            </Typography>

            <LocationCards data={locationData} />
          </Box>
          <ApartmentCards data={homeData} />
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
