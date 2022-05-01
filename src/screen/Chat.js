import React, { Component } from 'react'
import { View, StatusBar, BackHandler, StyleSheet, TouchableOpacity } from 'react-native'
import { Appbar } from 'react-native-paper'
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import { withNavigation } from 'react-navigation'
import firebase from 'react-native-firebase'
import { Avatar } from 'react-native-elements'

const db = firebase.database()

class Chat extends Component {
  constructor () {
    super()

    this.state = {
      messages: [],
      text: '',
      currentUser: [],
      room: []
    }
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }

  componentDidMount () {
    const { currentUser } = firebase.auth()
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )

    db.ref('messages')
      .child(firebase.auth().currentUser.uid)
      .child(this.props.navigation.state.params.friendId)
      .on('child_added', value => {
        this.setState(prevState => {
          return {
            messages: GiftedChat.append(prevState.messages, value.val())
          }
        })
      })
  }

  sendMessage = () => {
    if (this.state.text.length > 0) {
      let msgId = db
        .ref('messages')
        .child(firebase.auth().currentUser.uid)
        .child(this.props.navigation.state.params.friendId)
        .push().key
      let updates = {}
      let message = {
        _id: msgId,
        text: this.state.text,
        createdAt: new Date(),
        user: {
          _id: firebase.auth().currentUser.uid,
          fullname: firebase.auth().currentUser.displayName,
          avatar: firebase.auth().currentUser.photoURL
        }
      }

      updates[
        'messages/' +
          firebase.auth().currentUser.uid +
          '/' +
          this.props.navigation.state.params.friendId +
          '/' +
          msgId
      ] = message
      updates[
        'messages/' +
          this.props.navigation.state.params.friendId +
          '/' +
          firebase.auth().currentUser.uid +
          '/' +
          msgId
      ] = message

      db.ref().update(updates)
      this.setState({ text: '' })
    }
  }

  componentWillUnmount () {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
  }

  handleBackButtonClick () {
    this.props.navigation.navigate('Home')
    return true
  }

  inputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{ backgroundColor: '#808080' }}
      />
    )
  }

  sendButton = props => {
    return (
      <Send
        {...props}
        containerStyle={{
          borderRadius: 16,
          borderColor: '#fff',
          borderWidth: 1,
          margin: 4
        }}
        textStyle={{ color: '#fff' }}
      />
    )
  }

  render () {
    const user = {
      id: this.props.navigation.state.params.friendId,
      name: this.props.navigation.state.params.friendName,
      avatar: this.props.navigation.state.params.friendAvatar,
      email: this.props.navigation.state.params.friendEmail
    }
    return (
      <>
        <StatusBar backgroundColor='#ffffff' barStyle='dark-content' />
        <View style={styles.background}>
          <Appbar style={styles.top} dark>
            <Appbar.Action
              color='#589167'
              icon='arrow-back'
              onPress={() => this.props.navigation.navigate('Home')}
            />
            <Avatar
              rounded
              source={{ uri: user.avatar }}
              containerStyle={{ marginLeft: '3%' }}
              onPress={() => this.props.navigation.navigate('FriendProfile', {user})}
            />
            <Appbar.Content
              titleStyle={{ color: '#207561' }}
              title={user.name}
              onPress={() => this.props.navigation.navigate('FriendProfile', {user})}
            />
          </Appbar>
          <GiftedChat
            text={this.state.text}
            messages={this.state.messages}
            onSend={this.sendMessage}
            user={{
              _id: firebase.auth().currentUser.uid,
              fullname: firebase.auth().currentUser.displayName,
              avatar: firebase.auth().currentUser.photoURL
            }}
            onInputTextChanged={value => this.setState({ text: value })}
            isLoadingEarlier
            isAnimated
            renderInputToolbar={this.inputToolbar}
            renderSend={this.sendButton}
          />
        </View>
      </>
    )
  }
}

export default withNavigation(Chat)

const styles = StyleSheet.create({
  fabBack: {
    position: 'absolute',
    margin: 16,
    left: 0,
    top: '4%',
    backgroundColor: 'white',
    color: '#589167'
  },
  background: {
    backgroundColor: '#E6E6E6',
    height: '100%'
  },
  top: {
    left: 0,
    right: 0,
    top: 0,
    backgroundColor: '#ffffff',
    elevation: 0
  }
})
