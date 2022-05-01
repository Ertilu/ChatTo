/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import { ThemeProvider } from 'react-native-elements'
import { View, Text } from 'react-native'

export default function Index () {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}

AppRegistry.registerComponent(appName, () => App)
