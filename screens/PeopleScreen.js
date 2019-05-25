import React from "react";
import CustomButton from "../components/CustomButton";
import CustomTextInput from "../components/CustomTextInput";
import { Alert, AsyncStorage, BackHandler, FlatList, Picker, Platform,
  ScrollView,
  StyleSheet, Text, View
} from "react-native";
import { createStackNavigator } from "react-navigation";
import { Root, Toast } from "native-base";
import { Constants } from "expo";


const styles = StyleSheet.create({
  listScreenContainer : { flex : 1, alignItems : "center", justifyContent :
      "center",
    ...Platform.select({
      ios : { paddingTop : Constants.statusBarHeight },
      android : { }
    })
  },
  restaurantList : { width : "94%" },
  restaurantContainer : { flexDirection : "row", marginTop : 4,
    marginBottom : 4,
    borderColor : "#e0e0e0", borderBottomWidth : 2, alignItems : "center"
  },
  restaurantName : { flex : 1 },
  addScreenContainer : { marginTop : Constants.statusBarHeight },
  addScreenInnerContainer : { flex : 1, alignItems : "center", paddingTop : 20, width : "100%" },
  addScreenFormContainer : { width : "96%" },
  fieldLabel : { marginLeft : 10 },
  pickerContainer : {
    ...Platform.select({
      ios : { },
      android : { width : "96%", borderRadius : 8, borderColor : "#c0c0c0",
        borderWidth : 2,
        marginLeft : 10, marginBottom : 20, marginTop : 4
      }
    })
  },
  picker : {
    ...Platform.select({
      ios : { width : "96%", borderRadius : 8, borderColor : "#c0c0c0",
        borderWidth : 2,
        marginLeft : 10, marginBottom : 20, marginTop : 4
      },
      android : { }
    })
  },
  addScreenButtonsContainer : { flexDirection : "row", justifyContent :
      "center" }

});

class ListScreen extends React.Component {
  constructor(inProps) {
    super(inProps);
    this.state = {listData: []};
  }

  componentDidMount() {
    BackHandler.addEventListener( "hardwareBackPress", () => { return true; } );
    AsyncStorage.getItem("people",
      function(inError, inPeople) {
        if (inPeople === null) {
          inPeople = [ ];
        } else {
          inPeople = JSON.parse(inPeople);
        }
        this.setState({ listData : inPeople });
      }.bind(this)
    );
  };

  render() {
    return (
      <Root>
        <View style={styles.listScreenContainer}>
          <CustomButton text="Add Person" width="94%"
                        onPress={() => {
                          this.props.navigation.navigate("AddScreen");
                        }}/>
          <FlatList style={styles.restaurantList} data={this.state.listData}
                    renderItem={({item}) =>
                      <View style={styles.restaurantContainer}>
                        <Text style={styles.restaurantName}>{item.name}</Text>
                        <CustomButton text="Delete"
                                      onPress={() => {
                                        Alert.alert("Please confirm",
                                          "Are you sure you want to delete this restaurant?",
                                          [
                                            {
                                              text: "Yes", onPress: () => {
                                                AsyncStorage.getItem("people",
                                                  function (inError, inPeople) {
                                                    if (inPeople === null) {
                                                      inPeople = [];
                                                    } else {
                                                      inPeople = JSON.parse(inPeople);
                                                    }
                                                    for (let i = 0; i < inPeople.length; i++) {
                                                      const restaurant = inPeople[i];
                                                      if (restaurant.key === item.key) {
                                                        inPeople.splice(i, 1);
                                                        break;
                                                      }
                                                    }
                                                    AsyncStorage.setItem("people",
                                                      JSON.stringify(inPeople), function () {
                                                        this.setState({listData: inPeople});
                                                        Toast.show({
                                                          text: "Person deleted",
                                                          position: "bottom", type: "danger",
                                                          duration: 2000
                                                        });
                                                      }.bind(this)
                                                    );
                                                  }.bind(this)
                                                );
                                              }
                                            },
                                            {text: "No"}, {text: "Cancel", style: "cancel"}
                                          ],
                                          {cancelable: true}
                                        )
                                      }}/>
                      </View>
                    }
          />
        </View>
      </Root>
    );
  }



}

class AddScreen extends React.Component {
  constructor(inProps) {
    super(inProps);
    this.state = { name : "", cuisine : "", price : "", rating : "",phone : "", address : "", webSite : "", delivery : "",
      key : `r_${new Date().getTime()}`
    };
  }

  render() { return (
    <ScrollView style={styles.addScreenContainer}>

      <CustomTextInput label="Name" maxLength={20}
                       stateHolder={this} stateFieldName="name" />
      <Text style={styles.fieldLabel}>Cuisine</Text>
      <View style={styles.pickerContainer}>
        <Picker style={styles.picker} prompt="Cuisine"
                selectedValue={this.state.cuisine}
                onValueChange={ (inItemValue) => this.setState({ cuisine :
                  inItemValue }) }
        >
          <Picker.Item label="" value="" />
          <Picker.Item label="Algerian" value="Algerian" />

          <Picker.Item label="American" value="American" />

          <Picker.Item label="Other" value="Other" />

        </Picker>
      </View>

      <Text style={styles.fieldLabel}>Price</Text>
      <View style={styles.pickerContainer}>
        <Picker style={styles.picker} selectedValue={this.state.price}
                prompt="Price"
                onValueChange={ (inItemValue) => this.setState({ price :
                  inItemValue }) }
        >
          <Picker.Item label="" value="" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
        </Picker>
      </View>

      <Text style={styles.fieldLabel}>Rating</Text>
      <View style={styles.pickerContainer}>
        <Picker style={styles.picker} selectedValue={this.state.rating}
                prompt="Rating"
                onValueChange={ (inItemValue) => this.setState({ rating :
                  inItemValue }) }
        >
          <Picker.Item label="" value="" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
        </Picker>
      </View>
      <CustomTextInput label="Phone Number" maxLength={20}
                       stateHolder={this}
                       stateFieldName="phoneNumber" />

      <CustomTextInput label="Address" maxLength={20}
                       stateHolder={this}
                       stateFieldName="address" />
      <CustomTextInput label="Web Site" maxLength={20}
                       stateHolder={this}
                       stateFieldName="webSite" />

      <Text style={styles.fieldLabel}>Delivery?</Text>
      <View style={styles.pickerContainer}>
        <Picker style={styles.picker} prompt="Delivery?"
                selectedValue={this.state.delivery}
                onValueChange={ (inItemValue) => this.setState({ delivery :
                  inItemValue }) }
        >
          <Picker.Item label="" value="" />
          <Picker.Item label="Yes" value="Yes" />
          <Picker.Item label="No" value="No" />
        </Picker>
      </View>

      <View style={styles.addScreenButtonsContainer}>
        <CustomButton text="Cancel" width="44%"
                      onPress={ () => { this.props.navigation.navigate("ListScreen"); } } />
        <CustomButton text="Save" width="44%"
                      onPress={ () => {
                        AsyncStorage.getItem("people",
                          function(inError, inPeople) {
                            if (inPeople === null) {
                              inPeople = [ ];
                            } else {
                              inPeople = JSON.parse(inPeople);
                            }
                            inPeople.push(this.state);
                            AsyncStorage.setItem("people",
                              JSON.stringify(inPeople), function() {
                                this.props.navigation.navigate("ListScreen");
                              }.bind(this)
                            );
                          }.bind(this)
                        );
                      } }
        />
      </View>
    </ScrollView>
  ); }
}

// const PeopleScreen = StackNavigator(
//   { ListScreen : { screen : ListScreen }, AddScreen : { screen :
//       AddScreen } },
//   { headerMode : "none", initialRouteName : "ListScreen" }
// );


const PeopleScreen = createStackNavigator({
  // For each screen that you can navigate to, create a new entry like this:
  ListScreen: {
    // `ProfileScreen` is a React component that will be the main content of the screen.
    screen: ListScreen,
    // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.
  },
  AddScreen: {
    // `ProfileScreen` is a React component that will be the main content of the screen.
    screen: AddScreen,
    // When `ProfileScreen` is loaded by the StackNavigator, it will be given a `navigation` prop.
  },

});

exports.PeopleScreen = PeopleScreen;