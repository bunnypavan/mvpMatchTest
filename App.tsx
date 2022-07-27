import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MovieList from './Components/MovieList';
import DetailsScreen from './Components/DetailsScreen';
import GoToFavourites from './Components/GoToFavourites';
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MovieList">
        <Stack.Screen
          name="MovieList"
          component={MovieList}
          options={{
            title: 'Movies List',
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#398582',
            },
          }}
        />
        <Stack.Screen
          name="DetailsScreen"
          component={DetailsScreen}
          options={{
            title: 'Movie Details',
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#398582',
            },
          }}
        />
        <Stack.Screen
          name="GoToFavourites"
          component={GoToFavourites}
          options={{
            title: 'Your Favorites',
            headerTintColor: 'white',
            headerStyle: {
              backgroundColor: '#398582',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
