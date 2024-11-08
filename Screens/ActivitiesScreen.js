import React from 'react';
import ItemsList from '../Components/ItemsList'; 


const ActivitiesScreen = () => {
  return (
    <ItemsList data={activityEntries} />
  );
};

export default ActivitiesScreen;
