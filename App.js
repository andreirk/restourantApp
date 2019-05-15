import React from 'react';
import { Constants } from "expo";
import { Image, Platform } from "react-native";
import { TabNavigator } from "react-navigation";
import { PeopleScreen } from "./screens/PeopleScreen";
import { DecisionScreen } from "./screens/DecisionScreen";
import { RestaurantsScreen } from "./screens/RestaurantsScreen";

console.log("------------------------------------------------------------");
console.log(`RestaurantChooser starting on ${Platform.OS}`);

const platformOS = Platform.OS.toLowerCase();

const tabs = TabNavigator({
  PeopleScreen : { screen : PeopleScreen,
    navigationOptions : { tabBarLabel : "People",
      tabBarIcon : ( { tintColor } ) => (
        <Image source={ require("./images/icon-people.png") }
               style={{ width : 32, height : 32, tintColor : tintColor }} />
      )
    }
  },

  DecisionScreen : { screen : DecisionScreen,
    navigationOptions : { tabBarLabel : "Decision",
      tabBarIcon : ( { tintColor } ) => (
        <Image source={ require("./images/icon-decision.png") }
               style={{ width : 32, height : 32, tintColor : tintColor }} />
      )
    }
  },

  RestaurantsScreen : { screen : RestaurantsScreen,
    navigationOptions : { tabBarLabel : "Restaurants",
      tabBarIcon : ( { tintColor } ) => (

        <Image source={ require("./images/icon-restaurants.png") }
               style={{ width : 32, height : 32, tintColor : tintColor }} />
      )
    }
  }},

{ initialRouteName : "DecisionScreen",animationEnabled : true,
  swipeEnabled : true,
  backBehavior : "none", lazy : true,
  tabBarPosition : platformOS === "android" ? "top" : "bottom",
  tabBarOptions : { activeTintColor : "#ff0000",showIcon : true,
  style : { paddingTop : platformOS === "android" ? Constants.
  statusBarHeight : 0 }
}
}
)

export default tabs;
