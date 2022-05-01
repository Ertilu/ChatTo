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
import styles from '../style/Form'
import firebase from 'react-native-firebase'
import GetLocation from 'react-native-get-location'

class Register extends Component {
  constructor () {
    super()

    this.state = {
      fullname: '',
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
    this.props.navigation.navigate('Login')
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

  register = () => {
    const { email, password } = this.state
    this.setState({
      spinner: true
    })
    if (
      this.state.fullname === '' ||
      this.state.email === '' ||
      this.state.password === ''
    ) {
      this.setState({
        spinner: false
      })
      alert('Oops, please fill the field')
    } else {
      const ref = firebase.firestore().collection('users')
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          console.log(`respon ==> `, response)
          response.user.updateProfile({
            displayName: this.state.fullname,
            photoURL:
              'https://pixelmator-pro.s3.amazonaws.com/community/avatar_empty@2x.png'
          })
          let data = {
            fullname: this.state.fullname,
            email: this.state.email,
            avatar:
              'https://pixelmator-pro.s3.amazonaws.com/community/avatar_empty@2x.png',
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            uid: response.user.uid
          }
          ref.doc(response.user.uid).set(data)
          this.setState({
            fullname: '',
            email: '',
            errMessage: null,
            spinner: false,
            latitude: null,
            longitude: null
          })
          // this.props.navigation.navigate('Home')
        })
        .catch(error => {
          alert(error)
          this.setState({
            spinner: false
          })
        })
    }
  }

  componentWillUnmount () {
    this.currentPosition()
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
                <Text style={styles.loginText}>Register</Text>
              </View>
              <TextInput
                style={styles.inputText}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  this.firstTextInput.focus()
                }}
                onChangeText={fullname => this.setState({ fullname })}
                returnKeyType={'next'}
                placeholder='Fullname'
                placeholderTextColor='grey'
                clearTextOnFocus
                autoFocus
              />
              <TextInput
                ref={input => {
                  this.firstTextInput = input
                }}
                style={styles.inputText}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  this.secondTextInput.focus()
                }}
                onChangeText={email => this.setState({ email })}
                returnKeyType={'next'}
                keyboardType='email-address'
                placeholder='Email'
                placeholderTextColor='grey'
                clearTextOnFocus
              />
              <TextInput
                ref={input => {
                  this.secondTextInput = input
                }}
                onChangeText={password => this.setState({ password })}
                style={styles.inputText}
                placeholder='Password, min 6 characters'
                placeholderTextColor='grey'
                clearTextOnFocus
                secureTextEntry
              />
              <Button
                icon='add'
                mode='contained'
                onPress={() => this.register()}
                style={styles.buttonLogin}
              >
                register
              </Button>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}
              style={{ alignItems: 'flex-end', marginTop: 16 }}
            >
              <Text style={{ color: 'grey' }}>
                Already have an account? Please login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    )
  }
}

export default Register
