import React, { Component } from 'react'
import {
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  BackHandler
} from 'react-native'
import { Button } from 'react-native-paper'
import Spinner from 'react-native-loading-spinner-overlay'
import firebase from 'react-native-firebase'
import GetLocation from 'react-native-get-location'
import styles from '../style/Form'

class Login extends Component {
  constructor () {
    super()
    this.state = {
      user: [],
      email: '',
      password: '',
      errMessage: null,
      spinner: false,
      latitude: 0,
      longitude: 0
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }

  componentDidMount = () => {
    this.currentPosition()
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  componentWillUnmount () {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  handleBackButtonClick () {
    BackHandler.exitApp()
    return true
  }

  currentPosition () {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000
    })
      .then(location => {
        let region = {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5
        }

        this.setState({
          mapRegion: region,
          latitude: location.latitude,
          longitude: location.longitude
        })
      })
      .catch(error => {
        const { code, message } = error
      })
  }

  login = () => {
    const { email, password } = this.state
    this.setState({
      spinner: true
    })
    if (this.state.email === '' || this.state.password === '') {
      this.setState({
        spinner: false
      })
      alert('Oops, please fill the field')
    } else {
      const ref = firebase.firestore().collection('users')
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(response => {
          let data = {
            latitude: this.state.latitude,
            longitude: this.state.longitude
          }
          ref.doc(response.user.uid).update(data)
          this.setState({
            fullname: '',
            email: '',
            spinner: false
          })
        })
        .catch(error => {
          alert('Wrong Email or Password')
          this.setState({
            spinner: false
          })
        })
    }
  }

  render () {
    return (
      <>
        <StatusBar
          translucent
          backgroundColor='#ffffff'
          barStyle='dark-content'
        />
        <View style={styles.background}>
          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={{ color: '#fff' }}
          />
          <View style={styles.body}>
            <View
              style={{
                paddingHorizontal: 16,
                alignItems: 'flex-end'
              }}
            >
              <View style={{ alignItems: 'flex-start', width: '100%' }}>
                <Text style={styles.loginText}>Login</Text>
              </View>
              <TextInput
                style={styles.inputText}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  this.secondTextInput.focus()
                }}
                onChangeText={email => this.setState({ email })}
                // value={this.state.email}
                returnKeyType={'next'}
                placeholder='Email'
                autoCompleteType='email'
                keyboardType='email-address'
                placeholderTextColor='grey'
                clearTextOnFocus
                autoFocus
              />
              <TextInput
                ref={input => {
                  this.secondTextInput = input
                }}
                onChangeText={password => this.setState({ password })}
                // value={this.state.password}
                style={styles.inputText}
                placeholder='Password'
                placeholderTextColor='grey'
                clearTextOnFocus
                secureTextEntry
              />
              <Button
                icon='chevron-right'
                mode='contained'
                onPress={this.login}
                style={styles.buttonLogin}
              >
                login
              </Button>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Register')}
              style={{ alignItems: 'flex-end', marginTop: 16 }}
            >
              <Text style={{ color: 'grey' }}>
                Don't have an account? Sign up here
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
  }
}

export default Login
