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
  decisionTimeScreenTouchable : { alignItems : "center", justifyContent : "center" },
  listScreenContainer : { flex : 1, alignItems : "center", justifyContent :
      "center",
    ...Platform.select({ ios : { paddingTop : Constants.statusBarHeight },
      android : { } })
  },
  whosGoingHeadline : { fontSize : 30, marginTop : 20, marginBottom : 20 },
  whosGoingItemTouchable : { flexDirection : "row", marginTop : 10,
    marginBottom : 10 },
  whosGoingCheckbox : { marginRight : 20 },
  whosGoingName : { flex : 1 },
  preFiltersContainer : { marginTop : Constants.statusBarHeight },
  preFiltersInnerContainer : { flex : 1, alignItems : "center", paddingTop :
      20, width : "100%" },
  preFiltersScreenFormContainer : {
    width : "96%"
  },
  preFiltersHeadlineContainer : { flex : 1, alignItems : "center", justifyContent : "center" },
  preFiltersHeadline : { fontSize : 30, marginTop : 20, marginBottom : 20 },
  fieldLabel : { marginLeft : 10 },
  pickerContainer : {
    ...Platform.select({
      ios : { },
      android : { width : "96%", borderRadius : 8, borderColor : "#c0c0c0",
        borderWidth : 2,
        marginLeft : 10, marginBottom : 20, marginTop : 4 }
    })
  },
  picker : {
    ...Platform.select({
      ios : { width : "96%", borderRadius : 8, borderColor : "#c0c0c0",
        borderWidth : 2,
        marginLeft : 10, marginBottom : 20, marginTop : 4 }, android : { }
    })
  },
  selectedContainer: {
    flex : 1,
    justifyContent : "center"
  },

  selectedInnerContainer: {
    alignItems : "center"
  },

  selectedName : {
    fontSize : 32
  },

  selectedDetails : {
    paddingTop : 80,
    paddingBottom : 80,
    alignItems : "center"
  },

  selectedDetailsLine : {
    fontSize : 18
  },

  vetoContainer: {
    flex : 1,
    justifyContent : "center"
  },

  vetoContainerInner: {
    justifyContent : "center",
    alignItems : "center",
    alignContent : "center"
  },

  vetoHeadlineContainer : {
    paddingBottom : 40
  },

  vetoHeadline : {
    fontSize : 32,
    fontWeight : "bold"
  },

  vetoScrollViewContainer : {
    height : "50%"
  },

  vetoParticipantContainer : {
    paddingTop : 20,
    paddingBottom : 20
  },

  vetoParticipantName : {
    fontSize : 24
  },

  vetoButtonContainer : {
    width : "100%",
    alignItems : "center",
    paddingTop : 40
  },

  choiceScreenHeadline : {
    fontSize : 30,
    marginTop : 20,
    marginBottom : 20
  },

  choiceScreenListContainer : {
    width : "94%"
  },

  choiceScreenListItem : {
    flexDirection : "row",
    marginTop : 4,
    marginBottom : 4,
    borderColor : "#e0e0e0",
    borderBottomWidth : 2,
    alignItems : "center"
  },

  choiceScreenListItemName : {
    flex : 1
  },

  postChoiceScreenContainer : {
    flex : 1,
    justifyContent : "center",
    alignItems : "center",
    alignContent : "center",
  },

  postChoiceHeadline : {
    fontSize : 32,
    paddingBottom : 80
  },

  postChoiceDetailsContainer : {
    borderWidth : 2,
    borderColor : "#000000",
    padding : 10,
    width : "96%"
  },

  postChoiceDetailsRowContainer : {
    flexDirection : "row",
    justifyContent : "flex-start",
    alignItems : "flex-start",
    alignContent : "flex-start"
  },

  postChoiceDetailsLabel : {
    width : 70,
    fontWeight : "bold",
    color : "#ff0000"
  },

  postChoiceDetailsValue : {
    width : 300
  }

});

class DecisionTimeScreen extends React.Component {

  _recieveData = async () => {
    let inPeople =  await AsyncStorage.getItem('people');
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
    }
    let inRestaurants =  await AsyncStorage.getItem('people');
    if (inRestaurants === null) {
      inRestaurants = [];
    } else {
      inRestaurants = JSON.parse(inRestaurants);
    }
    if (inPeople.length === 0) {
      Alert.alert("That ain't gonna work, chief",
        "You haven't added any restaurants. " +
        "You should probably do that first, no?",
        [{text: "OK"}], {cancelable: false}
      );
    }

    if(inPeople && inRestaurants){
      this.props.navigation.navigate("WhosGoingScreen");
    }

  };

  _onPressHenlder = () => {
    this._recieveData();
  };

  render() {
    return (
      <View style={styles.decisionTimeScreenContainer}>
        <TouchableOpacity style={styles.decisionTimeScreenTouchable}
                          onPress={this._onPressHenlder}

        >
          <Image source={require("../images/its-decision-time.png")}/>
          <Text style={{paddingTop: 20}}>(click the food to get going)</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class WhosGoingScreen extends React.Component   {
  constructor(inProps) {
    super(inProps);
    this.state = {people: [], selected: {}};
  }

  _setSelected = (item) => {
    const selected = this.state.selected;
    selected[item.key] = !selected[item.key];
    this.setState({selected: selected});
  };

  _nextPressHandler = () => {
    participants = [];
    for (const person of this.state.people) {
      if (this.state.selected[person.key]) {
        const participant = Object.assign({}, person);
        participant.vetoed = "no";
        participants.push(participant);
      }
    }
    if (participants.length === 0) {
      Alert.alert("Uhh, you awake?",
        "You didn't select anyone to go. Wanna give it another try?",
        [{text: "OK"}], {cancelable: false}
      );
    } else {
      this.props.navigation.navigate("PreFiltersScreen");
    }
  };

  render() {
    return (
      <View style={styles.listScreenContainer}>
        <Text style={styles.whosGoingHeadline}>Who's Going?</Text>
        <FlatList style={{width: "94%"}} data={this.state.people}
                  renderItem={({item}) =>
                    <TouchableOpacity
                      style={styles.whosGoingItemTouchable}
                      onPress={() => this._setSelected(item)}
                    >
                      <CheckBox style={styles.whosGoingCheckbox}
                                checked={this.state.selected[item.key]}
                                onPress={() => {
                                  const selected = this.state.selected;
                                  selected[item.key] = !selected[item.key];
                                  this.setState({selected: selected});}
                                }
                      />
                      <Text style={styles.whosGoingName}>
                        {item.firstName} {item.lastName} ({item.relationship})
                      </Text>
                    </TouchableOpacity>
                  }
        />
        <CustomButton text="Next" width="94%"
                      onPress={ this._nextPressHandler }
        />
      </View>
    );
  }

  componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", () => { return true; });
    AsyncStorage.getItem("people",
      function(inError, inPeople) {
        if (inPeople === null) {
          inPeople = [ ];
        } else {
          inPeople = JSON.parse(inPeople);
        }
        const selected = { };
        for (const person of inPeople) { selected[person.key] = false; }
        this.setState({ people : inPeople, selected : selected });
      }.bind(this)
    );
  };

}

class PreFiltersScreen extends React.Component {
  constructor(inProps) {
    super(inProps);
    this.state = { cuisine : "", price : "", rating : "", delivery : "" };
  }

  render() { return (
    <ScrollView style={styles.preFiltersContainer}>
      <View style={styles.preFiltersInnerContainer}>
        <View style={styles.preFiltersScreenFormContainer}>
          <View style={styles.preFiltersHeadlineContainer}>
            <Text style={styles.preFiltersHeadline}>Pre- Filters</Text>
          </View>
          <Text style={styles.fieldLabel}>Cuisine</Text>
          <View style={styles.pickerContainer}>
            <Picker style={styles.picker} selectedValue={this.state.cuisine}
                    prompt="Cuisine"
                    onValueChange={ (inItemValue) => this.setState({ cuisine :
                      inItemValue }) } >
              <Picker.Item label="" value="" />
              <Picker.Item label="Algerian" value="Algerian" />
              <Picker.Item label="American" value="American" />
              <Picker.Item label="Russian" value="Russian" />
              <Picker.Item label="Chinise" value="Chinise" />
              <Picker.Item label="Japanise" value="Japanise" />
              <Picker.Item label="Italian" value="Italian" />

              <Picker.Item label="Other" value="Other" />

            </Picker>

          </View>
          { /* ########## Price ########## */ }
          <Text style={styles.fieldLabel}>Price &lt;=</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={this.state.price}
              prompt="price <="
              onValueChange={
                (inItemValue) => this.setState({ price : inItemValue })
              }
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
            </Picker>
          </View>
          { /* ########## Rating ########## */ }
          <Text style={styles.fieldLabel}>Rating &gt;=</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              selectedValue={this.state.rating}
              prompt="Rating >="
              onValueChange={
                (inItemValue) => this.setState({ rating : inItemValue })
              }
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="1" value="1" />
              <Picker.Item label="2" value="2" />
              <Picker.Item label="3" value="3" />
              <Picker.Item label="4" value="4" />
              <Picker.Item label="5" value="5" />
            </Picker>
          </View>

          { /* ########## Delivery ########## */ }
          <Text style={styles.fieldLabel}>Delivery?</Text>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.picker}
              prompt="Delivery?"
              selectedValue={this.state.delivery}
              onValueChange={
                (inItemValue) => this.setState({ delivery : inItemValue })
              }
            >
              <Picker.Item label="" value="" />
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>
          { /* ########## Next Step button ########## */ }
          <CustomButton
            text="Next"
            width="94%"
            onPress={ () => {
              // Get all restaurants from LocalStorage.
              AsyncStorage.getItem("restaurants",
                this._nextPressHandler
              );
            } }
          />
        </View>
      </View>
    </ScrollView>

  ); } /* End render(). */

  _nextPressHandler = (inError, inRestaurants) => {
    if (inRestaurants === null) {
      inRestaurants = [ ];
    } else {
      inRestaurants = JSON.parse(inRestaurants);
    }
    // Now filter them based on selected criteria, if any.
    filteredRestaurants = [ ];
    for (const restaurant of inRestaurants) {
      let passTests = true;
      // Filter on cuisine.
      if (this.state.cuisine !== ""
      ) {
        if (Object.keys(this.state.cuisine).length > 0) {
          if (restaurant.cuisine !== this.state.cuisine) {
            passTests = false;
          }
        }
      }
      // Filter on price.
      if (this.state.price !== "") {
        if (restaurant.price > this.state.price) {
          passTests = false;
        }
      }
      // Filter on rating.
      if (this.state.rating !== "") {
        if (restaurant.rating < this.state.rating) {
          passTests = false;
        }
      }
      // Filter on delivery.
      if (this.state.delivery !== "") {
        if (restaurant.delivery !== this.state.delivery) {
          passTests = false;
        }
      }
      // The case where there are no selected criteria.
      if (this.state.cuisine.length === 0 &&
        this.state.price === "" && this.state.rating === "" &&
        this.state.delivery === ""
      ) {
        passTests = true;
      }
      // Yep, this one meets the criteria, add it.
      if (passTests) {
        filteredRestaurants.push(restaurant);
      }
    }
    // If there were no matches, we can't go on.
    if (filteredRestaurants.length === 0) {
      Alert.alert(
        "Well, that's an easy choice",
        "None of your restaurants match these criteria. Maybe " +
        "try loosening them up a bit?",
        [ { text : "OK" } ],
        { cancelable : false }
      );
    } else {
      // We've got at least one, go to the next screen.
      this.props.navigation.navigate("ChoiceScreen");
    }

  }

} /* End PreFiltersScreen. */

/**
 * #############################################################################
 * Choice screen.
 */
class ChoiceScreen extends React.Component {

  /**
   * Constructor.
   */
  constructor(inProps) {

    super(inProps);

    this.state = {
      participantsList : participants,
      participantsListRefresh : false,
      selectedVisible : false,
      vetoVisible : false,
      vetoDisabled : false,
      vetoText : "Veto"
    };

  } /* End constructor. */


  /**
   * Render this component.
   */
  render() { return (

    <View style={styles.listScreenContainer}>

      { /* ########## Selected Modal ########## */ }
      <Modal
        presentationStyle={"formSheet"}
        visible={this.state.selectedVisible}
        animationType={"slide"}
        onRequestClose={ () => { } }
      >
        <View style={styles.selectedContainer}>
          <View style={styles.selectedInnerContainer}>
            <Text style={styles.selectedName}>{chosenRestaurant.name}</Text>
            <View style={styles.selectedDetails}>
              <Text style={styles.selectedDetailsLine}>
                This is a {"\u2605".repeat(chosenRestaurant.rating)} star
              </Text>
              <Text style={styles.selectedDetailsLine}>
                {chosenRestaurant.cuisine} restaurant
              </Text>
              <Text style={styles.selectedDetailsLine}>
                with a price rating of {"$".repeat(chosenRestaurant.price)}
              </Text>
              <Text style={styles.selectedDetailsLine}>
                that {chosenRestaurant.delivery === "Yes" ? "DOES" : "DOES NOT"} deliver.
              </Text>
            </View>
            <CustomButton
              text="Accept"
              width="94%"
              onPress={ () => {
                this.setState({ selectedVisible : false, vetoVisible : false });
                this.props.navigation.navigate("PostChoiceScreen");
              } }
            />
            <CustomButton
              text={this.state.vetoText}
              width="94%"
              disabled={this.state.vetoDisabled ? "true" : "false"}
              onPress={ () => {
                this.setState({ selectedVisible : false, vetoVisible : true });
              } }
            />
          </View>
        </View>
      </Modal>

      { /* ########## Veto Modal ########## */ }
      <Modal
        presentationStyle={"formSheet"}
        visible={this.state.vetoVisible}
        animationType={"slide"}
        onRequestClose={ () => { } }
      >
        <View style={styles.vetoContainer}>
          <View style={styles.vetoContainerInner}>
            <Text style={styles.vetoHeadline}>Who's vetoing?</Text>
            <ScrollView style={styles.vetoScrollViewContainer}>
              { participants.map((inValue) => {
                if (inValue.vetoed === "no") {
                  return <TouchableOpacity key={inValue.key}
                                           style={ styles.vetoParticipantContainer }
                                           onPress={ () => {
                                             // Mark the vetoer as having vetoed.
                                             for (const participant of participants) {
                                               if (participant.key === inValue.key) {
                                                 participant.vetoed = "yes";
                                                 break;
                                               }
                                             }
                                             // Make sure there's still at least one person that
                                             // can veto, otherwise disable the Veto button.
                                             let vetoStillAvailable = false;
                                             let buttonLabel = "No Vetoes Left";
                                             for (const participant of participants) {
                                               if (participant.vetoed === "no") {
                                                 vetoStillAvailable = true;
                                                 buttonLabel = "Veto";
                                                 break;
                                               }
                                             }
                                             // Delete the vetoed restaurant.
                                             for (let i = 0; i < filteredRestaurants.length; i++) {
                                               if (filteredRestaurants[i].key === chosenRestaurant.key) {
                                                 filteredRestaurants.splice(i, 1);
                                                 break;
                                               }
                                             }
                                             // Update state.
                                             this.setState({
                                               selectedVisible : false,
                                               vetoVisible : false,
                                               vetoText : buttonLabel,
                                               vetoDisabled : !vetoStillAvailable,
                                               participantsListRefresh : !this.state.participantsListRefresh
                                             });
                                             // If there's only one restaurant left then
                                             // that's the choice.
                                             if (filteredRestaurants.length === 1) {
                                               this.props.navigation.navigate("PostChoiceScreen");
                                             }
                                           } }
                  >
                    <Text style={styles.vetoParticipantName}>
                      {inValue.firstName + " " + inValue.lastName}
                    </Text>
                  </TouchableOpacity>;
                }
              })
              }
            </ScrollView>
            <View style={styles.vetoButtonContainer}>
              <CustomButton
                text="Never Mind"
                width="94%"
                onPress={ () => {
                  this.setState({
                    selectedVisible : true, vetoVisible : false
                  });
                } }
              />
            </View>
          </View>
        </View>
      </Modal>

      { /* ########## Main choice screen. ########## */ }
      <Text style={styles.choiceScreenHeadline}>Choice Screen</Text>
      <FlatList
        style={styles.choiceScreenListContainer}
        data={this.state.participantsList}
        extraData={this.state.participantsListRefresh}
        renderItem={ ({item}) =>

          <View style={styles.choiceScreenListItem}>
            <Text style={styles.choiceScreenListItemName}>
              {item.firstName} {item.lastName} ({item.relationship})
            </Text>
            <Text>Vetoed: {item.vetoed}</Text>
          </View>
        }
      />
      <CustomButton
        text="Randomly Choose"
        width="94%"
        onPress={ () => {
          // Randomly pick one.
          const selectedNumber = getRandom(0, filteredRestaurants.length - 1);
          // Get the restaurant descriptor.
          chosenRestaurant = filteredRestaurants[selectedNumber];
          // Show the selected modal
          this.setState({ selectedVisible : true });
        } }
      />

    </View>

  ); } /* End render(). */


} /* End ChoiceScreen. */

/**
 * #############################################################################
 * Post-choice screen.
 */
class PostChoiceScreen extends React.Component {

  /**
   * Constructor.
   */
  constructor(inProps) {

    super(inProps);

  } /* End constructor. */


  /**
   * Render this component.
   */
  render() { return (

    <View style={styles.postChoiceScreenContainer}>

      <View>
        <Text style={styles.postChoiceHeadline}>Enjoy your meal!</Text>
      </View>

      <View style={styles.postChoiceDetailsContainer}>

        <View style={styles.postChoiceDetailsRowContainer}>
          <Text style={styles.postChoiceDetailsLabel}>Name:</Text>
          <Text style={styles.postChoiceDetailsValue}>
            {chosenRestaurant.name}
          </Text>
        </View>

        <View style={styles.postChoiceDetailsRowContainer}>
          <Text style={styles.postChoiceDetailsLabel}>Cuisine:</Text>
          <Text style={styles.postChoiceDetailsValue}>
            {chosenRestaurant.cuisine}
          </Text>
        </View>

        <View style={styles.postChoiceDetailsRowContainer}>
          <Text style={styles.postChoiceDetailsLabel}>Price:</Text>
          <Text style={styles.postChoiceDetailsValue}>
            {"$".repeat(chosenRestaurant.price)}
          </Text>
        </View>

        <View style={styles.postChoiceDetailsRowContainer}>
          <Text style={styles.postChoiceDetailsLabel}>Rating:</Text>
          <Text style={styles.postChoiceDetailsValue}>
            {"\u2605".repeat(chosenRestaurant.rating)}
          </Text>
        </View>

        <View style={styles.postChoiceDetailsRowContainer}>
          <Text style={styles.postChoiceDetailsLabel}>Phone:</Text>
          <Text style={styles.postChoiceDetailsValue}>
            {chosenRestaurant.phone}
          </Text>
        </View>

        <View style={styles.postChoiceDetailsRowContainer}>
          <Text style={styles.postChoiceDetailsLabel}>Address:</Text>
          <Text style={styles.postChoiceDetailsValue}>
            {chosenRestaurant.address}
          </Text>
        </View>

        <View style={styles.postChoiceDetailsRowContainer}>
          <Text style={styles.postChoiceDetailsLabel}>Web Site:</Text>
          <Text style={styles.postChoiceDetailsValue}>
            {chosenRestaurant.webSite}
          </Text>
        </View>

        <View style={styles.postChoiceDetailsRowContainer}>
          <Text style={styles.postChoiceDetailsLabel}>Delivery:</Text>
          <Text style={styles.postChoiceDetailsValue}>
            {chosenRestaurant.delivery}
          </Text>
        </View>

      </View>

      <View style={{ paddingTop:80}}>
        <Button
          title="All Done"
          onPress={ () => this.props.navigation.navigate("DecisionTimeScreen") }
        />
      </View>

    </View>

  ); } /* End render(). */


} /* End PostChoiceScreen. */

const DecisionScreen = createStackNavigator({
  DecisionTimeScreen: {
    screen: DecisionTimeScreen,
  },
  WhosGoingScreen: {
    screen: WhosGoingScreen,
  },
  PreFiltersScreen: {
    screen: PreFiltersScreen,
  },
  ChoiceScreen: {
    screen: ChoiceScreen,
  },
  PostChoiceScreen: {
    screen: PostChoiceScreen,
  },

});

exports.DecisionScreen = DecisionScreen;