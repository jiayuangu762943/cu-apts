import React, { ReactElement } from 'react';
import LocationCard from './LocationCard';
import { Grid, Link } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';
import { LocationCardData } from '../../App';

type Props = {
  data: LocationCardData[];
};

const LocationCards = ({ data }: Props): ReactElement => {
  return (
    <Grid container spacing={3}>
      {data &&
        data.map(({ photo, location }, index) => {
          return (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Link
                {...{
                  to: `/location/${location}`,
                  style: { textDecoration: 'none' },
                  component: RouterLink,
                }}
              >
                <LocationCard key={index} photo={photo} location={location} />
              </Link>
            </Grid>
          );
        })}
    </Grid>
  );
};

export default LocationCards;
