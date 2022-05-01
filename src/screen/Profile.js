import React, { Component } from 'react'
import { View, StatusBar, Image, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { IconButton, Button, Headline, Caption, TextInput } from 'react-native-paper'
import firebase from 'react-native-firebase'

class Profile extends Component {
  state = {
    name: firebase.auth().currentUser.displayName,
    text: '',
    status: ''
  }

  update = () => {
    this.setState({
      status: this.state.text
    })
    alert('Profile updated');
  }

  render () {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 8
        }}
      >
        <StatusBar backgroundColor='white' barStyle='dark-content' />
        <View style={{ flexDirection: 'row', position: 'absolute' }}>
          <View>
            <IconButton
              icon='arrow-back'
              color='#589167'
              onPress={() => this.props.navigation.navigate('Home')}
            />
          </View>
          <View
            style={{
              flex: 1,
              alignItems: 'flex-start',
              justifyContent: 'center'
            }}
          >
            <Text
              text10
              style={{ color: '#207561', fontWeight: 'bold', fontSize: 18 }}
            >
              Profile
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', top: '12%' }}>
          <View style={{ marginRight: 8 }}>
            <TouchableOpacity onPress={() => console.warn('Photo profile')}>
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 16
                }}
                source={{
                  uri: firebase.auth().currentUser.photoURL
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Headline>{firebase.auth().currentUser.displayName}</Headline>
            <Caption>{firebase.auth().currentUser.email}</Caption>
            <Caption>Status : {this.state.status}</Caption>
          </View>
        </View>
        <View style={styles.form}>
          <Headline style={styles.updateTitle}>Update Profile</Headline>
          <TextInput
            label='Name'
            placeholder='Update your name here'
            value={this.state.name}
            onChangeText={name => this.setState({ name })}
          />
          <TextInput
            label='Status'
            placeholder='Busy'
            value={this.state.text}
            onChangeText={text => this.setState({ text })}
          />
          <Button mode="contained" onPress={this.update}>
            Update
          </Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  updateTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    marginTop: 100,
  },
});

export default Profile