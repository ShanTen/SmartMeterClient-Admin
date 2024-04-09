import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from 'react-navigation-stack';
import {useState, useEffect} from 'react';


import Home from './Screens/Home'; 
import Login from './Screens/Settings';
import Settings from './Screens/Settings';
import PrimarySearchAndViewSingleMeter from './Screens/PrimarySearchAndViewSingleMeter';
import SecondaryViewClusterData from './Screens/SecondaryViewClusterData';

export const PreAuthNavigator = createStackNavigator({
    SignIn: {
      screen: Login,
      navigationOptions: {
        title: "Sign In",
      }
    }
  });

export const PostAuthNavigator = createBottomTabNavigator({
    Home: {
        screen: Home,
        navigationOptions: {
            title: "Home",
            tabBarIcon: makeIconRender("home"),
        }
    },
    Settings: {
        screen: Settings,
        navigationOptions: {
            title: "Settings",
            tabBarIcon: makeIconRender("cog"),
        }
    },
});


function makeIconRender(name) {
    return ({ color, size }) => (
        <MaterialCommunityIcons name={name} color={color} size={size} />
    );
}