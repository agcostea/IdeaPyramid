import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Feather from 'react-native-vector-icons/Feather';
import { StatusBar } from 'react-native';

export default function App() {
  const [ideas, setIdeas] = useState(['']);

  useEffect(() => {
    const loadIdeas = async () => {
      try {
        const storedIdeas = await AsyncStorage.getItem('ideas');
        if (storedIdeas) setIdeas(JSON.parse(storedIdeas));
      } catch (error) {
        console.log('Failed to load ideas', error);
      }
    };
    loadIdeas();
  }, []);

  useEffect(() => {
    const saveIdeas = async () => {
      try {
        await AsyncStorage.setItem('ideas', JSON.stringify(ideas));
      } catch (error) {
        console.log('Failed to save ideas', error);
      }
    };
    saveIdeas();
  }, [ideas]);

  const addLayer = () => setIdeas([...ideas, '']);

  const updateIdea = (index: number, text: string) => {
    const newIdeas = [...ideas];
    newIdeas[index] = text;
    setIdeas(newIdeas);
  };

  const removeLayer = (index: number) => {
    Alert.alert(
      'Remove Layer',
      `Are you sure you want to remove Idea ${ideas.length - index}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newIdeas = ideas.filter((_, i) => i !== index);
            setIdeas(newIdeas.length ? newIdeas : ['']);
          },
        },
      ]
    );
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Idea Pyramid</Text>

      <Text style={styles.description}>
    “Your mind is for having ideas, not holding them”
David Allen
      </Text>

      <View style={styles.pyramid}>
        
        {[...ideas].reverse().map((idea, i) => {
          const index = ideas.length - 1 - i;
          const minWidth = 120;
          const maxWidth = 300;
          const widthStep = (maxWidth - minWidth) / (ideas.length - 1 || 1);
          const width = maxWidth - i * widthStep;
          return (
            <View key={index} style={[styles.layerRow]}>
              <View style={[styles.layer, { width }]}>  
                <TextInput
                  style={styles.layerText}
                  value={idea}
                  onChangeText={(text) => updateIdea(index, text)}
                  placeholder={`Layer ${ideas.length - i}`}
                  placeholderTextColor="#898989ff"
                  multiline
                />
                <TouchableOpacity style={styles.removeLayerBtn} onPress={() => removeLayer(index)}>
                  <Feather name="x" size={25} color="gray" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
     <TouchableOpacity style={styles.addLayerContainer} onPress={addLayer} activeOpacity={0.7}>
  <View style={styles.addLayerRow}>
    <Feather name="plus" size={30} color="gray" />
    <Text style={styles.addLayerText}>Add New Layer</Text>
  </View>
</TouchableOpacity>
      <StatusBar barStyle="light-content" backgroundColor="#2a2929ff" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
 container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: '#2a2929ff', 
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    marginBottom: 20,
    textAlign: 'center',
    color: '#cececeff',
    fontFamily: 'Arial', 
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
 
    marginBottom: 30,
    textAlign: 'center',
    color: '#b4b4b4ff',
    fontFamily: 'Arial',     

  },
  addLayerContainer: {
  marginTop: 30,
  alignSelf: 'center',
  backgroundColor: '#333333ff', 
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 10,
  shadowColor: '#ffffffff',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 3,
},

addLayerRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

addLayerText: {
  color: 'gray',
  fontSize: 18,
  fontWeight: '500',
  marginLeft: 10,
}
,
  pyramid: {
    flexDirection: 'column-reverse',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  layerRow: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 6,
  },
  layer: {
  alignSelf: 'center',
  backgroundColor: '#414141ff', 
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 10,
  shadowColor: '#ffffffff',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 3,
  },
  layerText: {
    flex: 1,
    color: '#9a9a9aff', 
    fontSize: 16,
        textAlign: 'center',

    paddingVertical: 8,
    paddingRight: 8,
    fontFamily: 'System',
    textAlignVertical: 'center',
    backgroundColor: 'transparent',
  },
  removeLayerBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
  removeLayerIcon: {
    fontSize: 20,
    color: '#000000', 
  },
  addLayer: {
    marginTop: 30,
    fontSize: 18,
    color: '#ffffffff', 
    fontWeight: 'normal',
    alignSelf: 'center',
    fontFamily: 'System',
  },
});
