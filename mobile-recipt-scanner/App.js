import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <>
    <View style={styles.container}></View>
    <WebView source={{ uri: 'https://squeezee-df.web.app/' }} style={{ flex: 1 }} /></>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    backgroundColor: 'black'
  },
});
