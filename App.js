import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from '@expo/vector-icons';
import {useState, useEffect} from 'react';
import {NavigationContainer} from "@react-navigation/native";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Screens/Home';
import Login from './Screens/Login';
import Settings from './Screens/Settings';
import PrimarySearchAndViewSingleMeter from "./Screens/PrimarySearchAndViewSingleMeter";
import ViewGraphData from "./Screens/SecondaryViewClusterData";

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return <Tab.Navigator>
    <Tab.Screen 
      name="Home" 
      component={PrimarySearchAndViewSingleMeter} 
      options={{
        tabBarIcon: makeIconRenderMA("home"),
        headerShown: false,
      }}
    />
    {/* <Tab.Screen 
      name="Graph Data" 
      component={ViewGraphData} 
      options={{
        tabBarIcon: makeIconRenderAD("barschart"),
        headerShown: false,
      }}
    /> */}
  </Tab.Navigator>
}


export default function App() {
  const Stack = createStackNavigator();

  return <NavigationContainer> 
    <Stack.Navigator>
      <Stack.Screen 
        name="PreAuth" 
        component={Login} 
        options={{
          title: "Sign In",
          headerShown: false,
        }}
        
      />
      <Stack.Screen 
        name="postAuth" 
        component={TabNavigator}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>;

}

function makeIconRenderMA(name) {
  return ({ color, size }) => (
    <MaterialCommunityIcons name={name} color={color} size={size} />
  );
}

function makeIconRenderAD(name){
  return ({ color, size }) => (
    <AntDesign name={name} color={color} size={size} />
  );
}