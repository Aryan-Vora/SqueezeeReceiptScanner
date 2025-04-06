import { StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function App() {
  return (
    <>
    <View style={styles.container}></View>
    {/* If you're looking at this page just know it's pretty outdated and the keys used should not be valid anymore. */}
    <WebView source={{ uri: 'https://squeezee-df.web.app/' }} style={{ flex: 1 }} /></>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    backgroundColor: 'black'
  },
});
