import React, { ReactElement } from 'react';
import Info from './Info';
import PropertyInfo from './PropertyInfo';
import { Card, CardContent } from '@material-ui/core';
import { CardData } from '../../App';

type Props = {
  readonly buildings: CardData[];
  readonly contact: string | null;
  readonly address: string | null;
  readonly landlordName: string;
  readonly userName: string;
};

export default function InfoFeatures({
  buildings,
  contact,
  address,
  landlordName,
  userName,
}: Props): ReactElement {
  return (
    <Card variant="outlined">
      <CardContent>
        <Info contact={contact} address={address} landlordName={landlordName} userName={userName} />
        {/* <Divider /> */}
        <PropertyInfo title="Properties Owned" info={buildings} />
      </CardContent>
    </Card>
  );
}
