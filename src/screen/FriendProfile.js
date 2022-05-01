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
    alert('Still developed');
  }

  render () {
      const user = this.props.navigation.getParam('user', {})
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
              Friend Profile
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
                  uri: user.avatar
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Headline>{user.name}</Headline>
            <Caption>{user.email}</Caption>
          </View>
        </View>
        <View style={styles.form}>
            <View style={styles.buttonChat}>
                <Button mode="outlined" onPress={this.update}>
                    Chat Now
                </Button>
            </View>
            <View style={styles.buttonBlock}>
                <Button mode="outlined" onPress={this.update}>
                    Block
                </Button>
            </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Profile