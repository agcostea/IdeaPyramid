import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  If you were just <Text style={{fontWeight: 'bold'}}>10 ideas away</Text> from your next big business breakthrough,  
  how fast would you write them down?{"\n\n"}
  
  Start with your <Text style={{fontStyle: 'italic'}}>base idea at the bottom</Text>,  
  then layer supporting ideas above it.{"\n\n"}
  
  The more layers you add, the closer you get to  
  your <Text style={{fontWeight: 'bold'}}>next big idea</Text>.
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
                  placeholderTextColor="#000000ff"
                  multiline
                />
                <TouchableOpacity style={styles.removeLayerBtn} onPress={() => removeLayer(index)}>
                  <Text style={styles.removeLayerIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
      <Text style={styles.addLayer} onPress={addLayer}>
        ➕ Add New Layer
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
 container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    backgroundColor: '#1E1E1E', 
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#FFFFFF', 
    fontFamily: 'System', 
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 40,
    textAlign: 'center',
    color: '#D3D3D3',
  fontFamily: 'System',      
  paddingHorizontal: 20,      

  },
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0', 
    borderRadius: 0, 
    paddingHorizontal: 10,
    minHeight: 54,
    width: '90%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  layerText: {
    flex: 1,
    color: '#000000', 
    fontSize: 16,
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
