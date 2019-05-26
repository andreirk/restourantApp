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
  peopleList : { width : "94%" },
  peopleContainer : { flexDirection : "row", marginTop : 4,
    marginBottom : 4,
    borderColor : "#e0e0e0", borderBottomWidth : 2, alignItems : "center"
  },
  peopleName : { flex : 1 },
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
    this._willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        this._getData();
      }
    );
    BackHandler.addEventListener( "hardwareBackPress", () => { return true; } );
  };

  _getData = () => {
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
  }

  componentWillUnmount(){
    Alert.alert('Will unpunt')
  }



  render() {
    return (
      <Root>
        <View style={styles.listScreenContainer}>
          <CustomButton text="Add Person" width="94%"
                        onPress={() => {
                          this.props.navigation.navigate("AddScreen");
                        }}/>
          <FlatList style={styles.peopleList} data={this.state.listData}
                    renderItem={({item}) =>
                      <View style={styles.peopleContainer}>
                        <Text style={styles.peopleName}>{item.firstName}</Text>
                        <CustomButton text="Delete"
                                      onPress={() => this._onDeletePersonPressHandle(item)}/>
                      </View>
                    }
          />
        </View>
      </Root>
    );
  }

  _onDeletePersonPressHandle = (item) => {
    Alert.alert("Please confirm",
      "Are you sure you want to delete this person?",
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
                  const people = inPeople[i];
                  if (people.key === item.key) {
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
  }

}

class AddScreen extends React.Component {
  constructor(inProps) {
    super(inProps);

    this.state = {
      firstName : "",
      lastName : "",
      relationship : "",
      key : `p_${new Date().getTime()}`
    };
  }

  render() { return (
    <ScrollView style={styles.addScreenContainer}>

      <CustomTextInput label="Name" maxLength={20}
                       stateHolder={this} stateFieldName="firstName" />
      <CustomTextInput label="Last name" maxLength={20}
                       stateHolder={this} stateFieldName="lastName" />
      <CustomTextInput label="Relationship" maxLength={20}
                       stateHolder={this} stateFieldName="relationship" />

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

// TODO add Edit Screen and button


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