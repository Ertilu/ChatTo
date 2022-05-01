import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    background: {
      backgroundColor: '#fff',
      height: '100%',
      padding: 16
    },
    loginText: {
      color: '#589167',
      fontSize: 30,
      marginBottom: 16
    },
    logo: {
      color: '#248ea9',
      fontSize: 40,
      fontWeight: 'bold',
      marginBottom: 16
    },
    inputText: {
      height: 40,
      borderColor: '#589167',
      borderBottomWidth: 2,
      borderRadius: 8,
      color: '#207561',
      marginVertical: 16,
      fontSize: 16,
      width: '100%'
    },
    buttonLogin: {
      backgroundColor: '#589167',
      marginTop: 8,
      borderRadius: 8
    },
    drumGedeLuar: {
      width: 150,
      height: 150,
      borderRadius: 150 / 2,
      backgroundColor: '#B65EFF',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8
    },
    drumGedeDalem: {
      width: 80,
      height: 80,
      borderRadius: 100 / 2,
      backgroundColor: '#6F1EB3',
      position: 'absolute'
    },
    drumGede: {
      width: '100%',
      height: 20,
      top: '30%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    drumKecilLuar: {
      width: 150,
      height: 150,
      borderRadius: 150 / 2,
      backgroundColor: '#F4FF5E',
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8
    },
    drumKecilDalem: {
      width: 80,
      height: 80,
      borderRadius: 100 / 2,
      backgroundColor: '#AAB330'
    },
    drumKecil: {
      width: '100%',
      height: 20,
      top: '30%',
      alignItems: 'center',
      justifyContent: 'center'
    },
    body: {
      top: '25%'
    }
  })
  

module.exports = styles