import React, { Component } from 'react'
import {
  View,
  StatusBar,
  StyleSheet,
  BackHandler,
  Dimensions,
  Text,
  Animated,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native'
import { Appbar, FAB } from 'react-native-paper'
import { Avatar } from 'react-native-elements'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import { withNavigation } from 'react-navigation'
import GetLocation from 'react-native-get-location'
import firebase from 'react-native-firebase'

const { width, height } = Dimensions.get('window')

const CARD_HEIGHT = height / 4
const CARD_WIDTH = CARD_HEIGHT - 50

class Home extends Component {
  constructor (props) {
    super(props)
    this.state = {
      mapRegion: null,
      latitude: 0,
      longitude: 0,
      currentUser: [],
      user: [],
      getDoc: [],
      doc: []
    }
    const ref = firebase.firestore().collection('users')
    ref.onSnapshot(doc => {
      this.state.getDoc.splice(0)
      doc.forEach(data => {
        let item = data._data
        if (this.state.user.email !== item.email) {
          this.state.getDoc.push(item)
          this.setState({
            doc: Object.values(this.state.getDoc)
          })
        }
      })
    })
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
  }

  logout = () => {
    Alert.alert(
			'Confirmation',
			'Are you sure want to logout ?',
			[
			{text: 'No', onPress:() => this.props.navigation.navigate("Home")},
      {text: 'Yes', onPress:() => 
      firebase
      .auth()
      .signOut()
      .then(() => this.props.navigation.navigate('Login'))
    },
			],
			{ cancelable: true}
		)
  }

  componentDidMount = async () => {
    await this.currentPosition()
    const { currentUser } = firebase.auth()

    this.setState({
      currentUser,
      user: firebase.auth().currentUser.providerData[0]
    })
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
    if (this.state.latitude !== 0) {
      this.updateLoc()
    }
  }

  componentWillUnmount () {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick
    )
    // this.updateLoc()
  }

  updateLoc () {
    const ref = firebase.firestore().collection('users')
    let data = {
      latitude: this.state.latitude,
      longitude: this.state.longitude
    }
    ref.doc(firebase.auth().currentUser.uid).update(data)
  }

  handleBackButtonClick () {
    Alert.alert(
			'Confirmation',
			'Are you sure want to quit application ?',
			[
			{text: 'No', onPress:() => this.props.navigation.navigate("Home")},
			{text: 'Yes', onPress:() => BackHandler.exitApp() },
			],
			{ cancelable: true}
		)
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
          latitudeDelta: 0.00922 * 1,
          longitudeDelta: 0.00421 * 1
        }

        this.setState({
          mapRegion: region,
          latitude: location.latitude,
          longitude: location.longitude
        })

        this.updateLoc()
      })
      .catch(error => {
        const { code, message } = error
      })
  }

  friendPosition (lat, long) {
    let region = {
      latitude: lat,
      longitude: long,
      latitudeDelta: 0.00922 * 1,
      longitudeDelta: 0.00421 * 1
    }

    this.setState({
      mapRegion: region,
    })
  }

  render () {
    return (
      <>
        <StatusBar
          translucent
          backgroundColor='rgba(0, 0, 0, .3)'
          barStyle='default'
        />
        <View style={{ flex: 1 }}>
          <MapView
            ref={map => (this.map = map)}
            showsCompass={false}
            showsUserLocation
            followsUserLocation
            showsMyLocationButton={false}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={this.state.mapRegion}
          >
            {this.state.doc.map((marker, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: marker.latitude,
                    longitude: marker.longitude
                  }}
                  title={marker.fullname}
                  description='Available'
                />
              )
            })}
          </MapView>
          <FAB
            color='#589167'
            style={styles.fabBack}
            small
            icon='arrow-back'
            onPress={() => this.handleBackButtonClick()}
          />
          {this.state.latitude === 0 ? (
            <FAB
              small
              color='#589167'
              style={styles.fabLoc}
              icon='location-searching'
              onPress={() => this.currentPosition()}
            />
          ) : (
            <FAB
              small
              color='#589167'
              style={styles.fabLoc}
              icon='my-location'
              onPress={() => this.currentPosition()}
            />
          )}
          <Animated.ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            style={styles.scrollView}
          >
            {this.state.doc.map((user, index) => (
              <TouchableOpacity
                key={index}
                onLongPress={() =>
                  this.friendPosition(user.latitude, user.longitude)
                }
                onPress={() =>
                  this.props.navigation.navigate('Chat', {
                    friendId: user.uid,
                    friendName: user.fullname,
                    friendAvatar: user.avatar,
                    friendEmail: user.email
                  })
                }
              >
                <View style={styles.card} key={index}>
                  <Image
                    key={index}
                    source={{ uri: user.avatar }}
                    style={styles.cardImage}
                    resizeMode='cover'
                    borderRadius={50}
                  />
                  <View style={styles.textContent}>
                    <Text numberOfLines={1} style={styles.cardtitle}>
                      {user.fullname}
                    </Text>
                    <Text numberOfLines={1} style={styles.cardDescription}>
                      {user.email}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>
        </View>
        <View>
          <Appbar style={styles.bottom}>
            <Avatar
              rounded
              source={{ uri: firebase.auth().currentUser.photoURL }}
              containerStyle={{ marginLeft: '3%' }}
              onPress={() => this.props.navigation.navigate('Profile')}
            />
            <Appbar.Content
              titleStyle={{ color: '#207561' }}
              style={{ alignItems: 'center' }}
              title='ChatTo'
            />
            <Appbar.Action
              color='#589167'
              icon='exit-to-app'
              onPress={() => this.logout()}
            />
          </Appbar>
        </View>
      </>
    )
  }
}

export default withNavigation(Home)

const styles = StyleSheet.create({
  map: {
    flex: 1
  },
  bottom: {
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F7AA35',
  },
  fabBack: {
    position: 'absolute',
    margin: 16,
    left: 0,
    top: '4%',
    backgroundColor: 'white',
    color: '#589167'
  },
  fabLoc: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: '4%',
    backgroundColor: 'white',
    color: '#589167'
  },
  container: {
    flex: 1
  },
  scrollView: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH
  },
  card: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: '#F7AA35',
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 3,
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    borderRadius: 50,
  },
  textContent: {
    flex: 1
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
    color: 'black'
  },
  cardDescription: {
    fontSize: 12,
    color: '#444'
  },
  buttonChat: {
    flex: 1
  }
})
