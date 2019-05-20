import React, { Component } from 'react'
// import PropTypes from 'prop-types';
import { StyleSheet, AsyncStorage } from 'react-native';
import { Text, View } from 'react-native-animatable'
import CustomButton from '../../components/CustomButton'
import CustomTextInput from '../../components/CustomTextInput'
import { connect } from 'react-redux';
import { Dimensions, Platform } from 'react-native'

const IS_ANDROID = Platform.OS === 'android'
const { height, width } = Dimensions.get('window')
import * as actions from '../../App';

let metrics = {
  ANDROID_STATUSBAR: 24,
  DEVICE_HEIGHT: IS_ANDROID ? height - 24 : height,
  DEVICE_WIDTH: width
}

class LoginForm extends Component {
  // static propTypes = {
  //   isLoading: PropTypes.bool.isRequired,
  //   onLoginPress: PropTypes.func.isRequired,
  //   onSignupLinkPress: PropTypes.func.isRequired
  // }

  state = {
    username: '',
    password: '',
  }

  hideForm = async () => {
    if (this.buttonRef && this.formRef && this.linkRef) {
      await Promise.all([
        this.buttonRef.zoomOut(200),
        this.formRef.fadeOut(300),
        this.linkRef.fadeOut(300)
      ])
    }
  }

  login = (username, password) => {
    this.props
    .login(username, password)
    .then(() => {
      this.props.navigation.navigate('Home');
    })
  }

  componentDidMount () {
  }

  render () {
    const { username, password } = this.state
    const { onSignupLinkPress } = this.props
    const isValid = username !== '' && password !== ''
    return (
      <View style={styles.container}>
        <View style={styles.form} ref={(ref) => { this.formRef = ref }}>
          <CustomTextInput
            name={'username'}
            ref={(ref) => this.emailInputRef = ref}
            placeholder={'Username'}
            editable={!this.props.state.loggingIn}
            returnKeyType={'next'}
            blurOnSubmit={false}
            withRef={true}
            onSubmitEditing={() => this.passwordInputRef.focus()}
            onChangeText={(value) => this.setState({ username: value })}
            isEnabled={!this.props.state.loggingIn}
          />
          <CustomTextInput
            name={'password'}
            ref={(ref) => this.passwordInputRef = ref}
            placeholder={'Password'}
            editable={!this.props.state.loggingIn}
            returnKeyType={'done'}
            secureTextEntry={true}
            withRef={true}
            onChangeText={(value) => this.setState({ password: value })}
            isEnabled={!this.props.state.loggingIn}
          />
        </View>
        <View style={styles.footer}>
          <View ref={(ref) => this.buttonRef = ref} animation={'bounceIn'} duration={600} delay={400}>
            <CustomButton
              onPress={() => this.login(username, password)}
              isEnabled={isValid}
              isLoading={this.props.state.loggingIn}
              buttonStyle={styles.loginButton}
              textStyle={styles.loginButtonText}
              text='Log In'
            />
          </View>
          <Text
            ref={(ref) => this.linkRef = ref}
            style={styles.signupLink}
            onPress={onSignupLinkPress}
            animation={'fadeIn'}
            duration={600}
            delay={400}
          >
            {'Not registered yet?'}
          </Text>
        </View>
      </View>
    )
  }
}



const mapStateToProps = (state) => {
  return {
    state,
  }
}



const styles = StyleSheet.create({
  container: {
    paddingHorizontal: metrics.DEVICE_WIDTH * 0.1
  },
  form: {
    marginTop: 20
  },
  footer: {
    height: 100,
    justifyContent: 'center'
  },
  loginButton: {
    backgroundColor: 'white'
  },
  loginButtonText: {
    color: '#3E464D',
    fontWeight: 'bold'
  },
  signupLink: {
    color: 'rgba(255,255,255,0.6)',
    alignSelf: 'center',
    padding: 20
  }
})


export default connect(mapStateToProps, actions)(LoginForm);