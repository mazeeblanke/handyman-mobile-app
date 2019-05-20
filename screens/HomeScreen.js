import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Modal,
  Button,
  Provider
} from '@ant-design/react-native';

import { connect } from 'react-redux';
import { List, Switch } from '@ant-design/react-native';
import { Notifications, Permissions } from 'expo';
import Dialog, {
  DialogFooter,
  DialogButton,
  DialogContent,
  DialogTitle
} from 'react-native-popup-dialog';
import * as actions from '../App';
import Spinner from 'react-native-loading-spinner-overlay';
const Item = List.Item;
const Brief = Item.Brief;

class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    showModal: false,
    toState: false,
    showPopup: false,
    notification: null,
    messageText: '',
    spinnerText: '',
    spinner: false
  }

  registerForPushNotificationsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      return;
    }
    let deviceToken = await Notifications.getExpoPushTokenAsync();
    this.props.registerToken({ deviceToken }).then(() => {
      this.notificationSubscription = Notifications.addListener(this.handleNotification);
    })
  }

  handleNotification = ({ data, origin }) => {
    const { title, message, orderId } = data
    if (origin === 'selected') {
      this.props.setOrderId(orderId);
      this.setState({
        spinner: !!orderId,
        spinnerText: 'Accepting new handy request...'
      });

      // Mock the 'Accepting request' action
      setTimeout(() => {
        this.setState({
          spinner: false
        });
        this.props.setAvailabilityStatus({ availabiltyStatus: false })
      }, 4000)
    } else {
      const localNotification = {
        title: title,
        body: message,
        data: data,
        ios: {
          sound: true
        }
      }
      Notifications.presentLocalNotificationAsync(localNotification).catch((err) => {
        console.log(err)
      })
    }
  }

  async componentDidMount() {
    this.registerForPushNotificationsAsync().then(() => {
    });
  }

  warnUser = (e) => {
    this.setState({
      showModal: true,
      toState: e
    })
  };

  endJob = (e) => {
    this.setState({
      spinner: true,
      spinnerText: 'Ending handy job...'
    })

    this.props.endJob(this.props.orderId).then(() => {
      this.setState({
        spinner: false,
        spinnerText: ''
      })
    })

  };

  renderPopupModal () {
    return (
      <Modal
          popup
          visible={this.state.showPopup}
          animationType="slide-up"
        >
          <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
            <Text style={{ textAlign: 'center' }}>Your Availability status has been updated !</Text>
          </View>
          <Button type="primary" style={{ backgroundColor: '#5cb85c', borderColor: '#4cae4c' }} onPress={() => {
            this.setState({
              showPopup: false
            })
          }}>
            Close
          </Button>
        </Modal>
    )
  }

  renderModal () {
    return (
      <Dialog
        visible={this.state.showModal}
        title={
          <DialogTitle title="Are you sure ?"></DialogTitle>
        }
        footer={
          <DialogFooter>
            <DialogButton
              text="CANCEL"
              onPress={() => {
                this.setState({
                  showModal: false
                })
              }}
            />
            <DialogButton
              text="OK"
              onPress={() => {
                this.props.setAvailabilityStatus({ availabiltyStatus: !this.props.user.available }).then(() => {
                  this.setState({
                    showModal: false,
                    showPopup: true,
                  })
                })


              }}
            />
          </DialogFooter>
        }
      >
        <DialogContent>
            <Text style={{
              paddingTop: 40,
              paddingBottom: 0,
              textAlign: 'center'
            }}>This action will update your availability status</Text>
        </DialogContent>
      </Dialog>
    )
  }

  handleSwitch = (checked) => {

    this.props.setAvailabilityStatus(checked);

  }

  renderSpinner () {
    return (
      <Spinner
        overlayColor="rgba(0,0,0,0.4)"
        animation="fade"
        size="small"
        visible={this.state.spinner}
        textContent={this.state.spinnerText}
        textStyle={{
          color: '#FFF'
        }}
      />
    )
  }

  render() {
    return (
      <Provider>
      <View style={styles.container}>
        { this.renderSpinner() }
        { this.renderModal() }
        { this.renderPopupModal() }
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              overflow: "hidden",
              borderWidth: 3,
              borderColor: "red"
            }} source={require('../assets/images/avatar.png')} />
          </View>

          <View style={styles.getStartedContainer}>

            <Text
              style={styles.getStartedText}>
              Welcome, <Text style={{ fontWeight: '900', fontSize: 25, marginTop: 85, textTransform: 'capitalize' }}>
                {this.props.user.username}
              </Text>
            </Text>
          </View>

          <View>
            <List style={{ marginTop: 20 }}>
              <List.Item extra={<Switch
                trackColor={{true: "blue", false: null}}
                disabled={this.props.settingAvailablity }
                checked={this.state.showModal || this.props.settingAvailablity ? this.state.toState : this.props.user.available}
                onChange={this.warnUser} />}>Set Availability</List.Item>
              <List.Item extra={<Switch
                disabled={!!!this.props.orderId }
                checked={!!this.props.orderId}
                onChange={this.endJob} />}>End Job</List.Item>
            </List>
            <List renderHeader={'History'}>
              <Item extra="May 2nd 2019" multipleLine>
                S/N 3478348<Brief>$3,000</Brief>
              </Item>
              <Item extra="April 12th 2019" multipleLine>
                S/N 627322<Brief>$4,456</Brief>
              </Item>
              <Item extra="March 20th 2019" multipleLine>
                S/N 05689<Brief>$2,000</Brief>
              </Item>
              <Item extra="March 7th 2019" multipleLine>
                S/N 12722<Brief>$400</Brief>
              </Item>
              <Item extra="feb 22th 2019" multipleLine>
                S/N 05943<Brief>$100</Brief>
              </Item>
              <Item extra="feb 12th 2019" multipleLine>
                S/N 87283<Brief>$50</Brief>
              </Item>
            </List>
          </View>

        </ScrollView>
      </View>
      </Provider>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
}

export default connect(mapStateToProps, actions)(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 29,
    textAlign: 'left',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
