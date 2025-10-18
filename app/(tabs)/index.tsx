import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';

export default function App() {
  const [pyramids, setPyramids] = useState([['']]);

  useEffect(() => {
    const loadPyramids = async () => {
      try {
        const storedPyramids = await AsyncStorage.getItem('pyramids');
        if (storedPyramids) setPyramids(JSON.parse(storedPyramids));
      } catch (error) {
        console.log('Failed to load pyramids', error);
      }
    };
    loadPyramids();
  }, []);

  useEffect(() => {
    const savePyramids = async () => {
      try {
        await AsyncStorage.setItem('pyramids', JSON.stringify(pyramids));
      } catch (error) {
        console.log('Failed to save pyramids', error);
      }
    };
    savePyramids();
  }, [pyramids]);

  const addPyramid = () => setPyramids([...pyramids, ['']]);

  const removePyramid = (pyramidIndex: number) => {
    Alert.alert(
      'Remove Pyramid',
      `Are you sure you want to remove Pyramid ${pyramidIndex + 1}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newPyramids = [...pyramids];
            newPyramids.splice(pyramidIndex, 1);
            if (!newPyramids.length) newPyramids.push(['']); 
            setPyramids(newPyramids);
          },
        },
      ]
    );
  };

  const addLayer = (pyramidIndex: number) => {
    const newPyramids = [...pyramids];
    newPyramids[pyramidIndex].push('');
    setPyramids(newPyramids);
  };

  const updateIdea = (pyramidIndex: number, layerIndex: number, text: string) => {
    const newPyramids = [...pyramids];
    newPyramids[pyramidIndex][layerIndex] = text;
    setPyramids(newPyramids);
  };

  const removeLayer = (pyramidIndex: number, layerIndex: number) => {
    Alert.alert(
      'Remove Layer',
      `Are you sure you want to remove Layer ${pyramids[pyramidIndex].length - layerIndex}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newPyramids = [...pyramids];
            newPyramids[pyramidIndex].splice(layerIndex, 1);
            if (!newPyramids[pyramidIndex].length) newPyramids[pyramidIndex] = [''];
            setPyramids(newPyramids);
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Idea Pyramid</Text>

      <Text style={styles.description}>
        “Your mind is for having ideas, not holding them” – David Allen
      </Text>

      {pyramids.map((ideas, pyramidIndex) => (
        <View key={pyramidIndex} style={{ marginBottom: 40 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <Text style={styles.pyramidTitle}>Pyramid {pyramidIndex + 1}</Text>
            <TouchableOpacity
              onPress={() => removePyramid(pyramidIndex)}
              style={{ marginLeft: 10 }}
            >
              <Feather name="trash-2" size={20} color="#ff5555" />
            </TouchableOpacity>
          </View>

          <View style={styles.pyramid}>
            {[...ideas].reverse().map((idea, i) => {
              const index = ideas.length - 1 - i;
              const minWidth = 120;
              const maxWidth = 300;
              const widthStep = (maxWidth - minWidth) / (ideas.length - 1 || 1);
              const width = maxWidth - i * widthStep;

              return (
                <View key={index} style={styles.layerRow}>
                  <View style={[styles.layer, { width }]}>
                    <TextInput
                      style={styles.layerText}
                      value={idea}
                      onChangeText={(text) =>
                        updateIdea(pyramidIndex, index, text)
                      }
                      placeholder={`Layer ${ideas.length - i}`}
                      placeholderTextColor="#898989ff"
                      multiline
                    />
                    <TouchableOpacity
                      style={styles.removeLayerBtn}
                      onPress={() => removeLayer(pyramidIndex, index)}
                    >
                      <Feather name="x" size={25} color="gray" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.addLayerContainer}
            onPress={() => addLayer(pyramidIndex)}
            activeOpacity={0.7}
          >
            <View style={styles.addLayerRow}>
              <Feather name="plus" size={30} color="gray" />
              <Text style={styles.addLayerText}>Add New Layer</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addLayerContainer} onPress={addPyramid}>
        <View style={styles.addLayerRow}>
          <Feather name="plus" size={30} color="gray" />
          <Text style={styles.addLayerText}>Add New Pyramid</Text>
        </View>
      </TouchableOpacity>

      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 60,
    paddingHorizontal: 15,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    marginBottom: 8,
    textAlign: 'center',
    color: '#b0b0b0', 
    fontFamily: 'Arial',
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 20,
    textAlign: 'center',
    color: '#888888',
    fontFamily: 'Courier New',
  },
  pyramidTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#cccccc',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 2,
  },
  addLayerContainer: {
    marginTop: 10,
    alignSelf: 'center',
    backgroundColor: '#2e2e2e',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  addLayerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addLayerText: {
    color: '#aaaaaa',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },
  pyramid: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 15,
  },
  layerRow: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 4,
  },
  layer: {
    alignSelf: 'center',
    backgroundColor: '#3f3d3dff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    paddingHorizontal: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 8,
    elevation: 8,
  },
  layerText: {
    flex: 1,
    color: '#ffffffff',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 10,
    fontFamily: 'Courier New',
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
  },
  removeLayerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 6,
  },
});
