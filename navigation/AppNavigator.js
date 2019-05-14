import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';

import Auth from '../screens/AuthScreen';
// import Home from '../screens/Home';

const AuthStack = createStackNavigator({
  Auth: {
    screen: Auth,
    navigationOptions: {
      header: null,
    }
  }
});


export default createAppContainer(createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
  Auth: AuthStack,
},

{
  initialRouteName: 'Auth',
}
));