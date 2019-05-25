import React from "react";
import CustomButton from "../components/CustomButton";
import {
  Alert, AsyncStorage, BackHandler, Button, FlatList, Image, Modal,
  Picker,
  ssPlatform, ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform
} from "react-native";
import { createStackNavigator } from "react-navigation";
import { CheckBox } from "native-base";
import { Constants } from "expo";

let participants = null;
let filteredRestaurants = null;
let chosenRestaurant = { };

const getRandom = (inMin, inMax) => {
  inMin = Math.ceil(inMin);
  inMax = Math.floor(inMax);
  return Math.floor(Math.random() * (inMax - inMin + 1)) + inMin;
};


const styles = StyleSheet.create({
  decisionTimeScreenContainer : { flex : 1, alignItems : "center", justifyContent : "center" },
  decisionTimeScreenTouchable : { alignItems : "center", justifyContent : "center" }
});

class DecisionTimeScreen extends React.Component {
  render() {
    return (
      <View style={styles.decisionTimeScreenContainer}>
        <TouchableOpacity style={styles.decisionTimeScreenTouchable}
                          onPress={() => {
                            AsyncStorage.getItem("people",
                              function (inError, inPeople) {
                                if (inPeople === null) {
                                  inPeople = [];
                                } else {
                                  inPeople = JSON.parse(inPeople);
                                }
                                if (inPeople.length === 0) {
                                  Alert.alert("That ain't gonna work, chief",
                                    "You haven't added any people. " +
                                    "You should probably do that first, no?",
                                    [{text: "OK"}], {cancelable: false}
                                  );
                                } else {
                                  AsyncStorage.getItem("restaurants",
                                    function (inError, inRestaurants) {
                                      if (inRestaurants === null) {
                                        inRestaurants = [];
                                      } else {
                                        inRestaurants = JSON.parse(inRestaurants);
                                      }
                                      if (inRestaurants.length === 0) {
                                        Alert.alert("That ain't gonna work, chief",
                                          "You haven't added any restaurants. " +
                                          "You should probably do that first, no?",
                                          [{text: "OK"}], {cancelable: false}
                                        );
                                      } else {
                                        this.props.navigation.navigate("WhosGoingScreen");
                                      }
                                    }.bind(this)
                                  );
                                }
                              }.bind(this)
                            );
                          }}
        >
          {/*<Image source={require("../images/its-decision-time.png")}/>*/}
          <Text style={{paddingTop: 20}}>(click the food to get going)</Text>
        </TouchableOpacity>
      </View>
    );
  }
}



class DecisionScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Desision!</Text>
      </View>
    );
  }
}

exports.DecisionScreen = DecisionTimeScreen;