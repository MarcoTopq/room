import React, { Component } from 'react';
import {
  AppRegistry,
  Text,
  View,
  TouchableHighlight,
  NativeAppEventEmitter,
  Platform,
  FlatList,
  ScrollView,
  StyleSheet,
  PermissionsAndroid
} from 'react-native';
import BleManager from 'react-native-ble-manager';

class BleExample extends Component {

    constructor(){
        super()

        this.state = {
          arrayHolder: [],
            ble:null,
            scanning:false,
        }
    }

    componentDidMount() {
        BleManager.start({showAlert: false});
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);

        NativeAppEventEmitter
            .addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral );

        if (Platform.OS === 'android' && Platform.Version >= 23) {
            PermissionsAndroid.checkPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                  console.log("Permission is OK");
                } else {
                  PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                    if (result) {
                      console.log("User accept");
                    } else {
                      console.log("User refuse");
                    }
                  });
                }
          });
        }
    }

    handleScan() {
        BleManager.scan([], 30, true)
            .then((results) => {console.log('Scanning...'); });
    }

    toggleScanning(bool){
        if (bool) {
            this.setState({scanning:true})
            this.scanning = setInterval( ()=> this.handleScan(), 3000);
        } else{
            this.setState({scanning:false, ble: null})
            clearInterval(this.scanning);
        }
    }

    handleDiscoverPeripheral(data){
        console.log('Got ble data', data);
        this.setState({ ble: data })
    }

    
    render() {

        const container = {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
        }
        const bleList = this.state.ble
            ? <Text> Device found: {this.state.ble.name} </Text>
            // ? console.log(this.state.ble.name)
            : <Text>no devices nearby</Text>
       

            const blue = this.state.ble 
            ?<FlatList data ={this.state.ble} key={this.state.ble.length} extraData={this.state.ble} renderItem={({item}) => <Text style={styles.item}>{item.name}</Text>} /> 
            : <Text>no devices nearby</Text>;

        return (
          <ScrollView>
            <View style={container}>
                <TouchableHighlight style={{padding:20, backgroundColor:'#ccc'}} onPress={() => this.toggleScanning(!this.state.scanning) }>
                    <Text>Scan Bluetooth ({this.state.scanning ? 'on' : 'off'})</Text>
                </TouchableHighlight>

                {bleList}
            </View>
            <View>   
                {blue}
            </View>
          </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})


// AppRegistry.registerComponent('BleExample', () => BleExample);
export default BleExample;
