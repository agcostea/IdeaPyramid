import { useState, useEffect } from 'react';
import { Alert, Share } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Pyramid = { name: string; layers: string[] };

export function usePyramids() {
  const [pyramids, setPyramids] = useState<Pyramid[]>([{ name: '', layers: [''] }]);

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

  const addPyramid = () => setPyramids([...pyramids, { name: '', layers: [''] }]);

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
            if (!newPyramids.length) newPyramids.push({ name: '', layers: [''] });
            setPyramids(newPyramids);
          },
        },
      ]
    );
  };

  const addLayer = (pyramidIndex: number) => {
    const newPyramids = [...pyramids];
    newPyramids[pyramidIndex].layers.push('');
    setPyramids(newPyramids);
  };

  const updateIdea = (pyramidIndex: number, layerIndex: number, text: string) => {
    const newPyramids = [...pyramids];
    newPyramids[pyramidIndex].layers[layerIndex] = text;
    setPyramids(newPyramids);
  };

  const removeLayer = (pyramidIndex: number, layerIndex: number) => {
    Alert.alert(
      'Remove Layer',
      `Are you sure you want to remove Layer ${pyramids[pyramidIndex].layers.length - layerIndex}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const newPyramids = [...pyramids];
            newPyramids[pyramidIndex].layers.splice(layerIndex, 1);
            if (!newPyramids[pyramidIndex].layers.length)
              newPyramids[pyramidIndex].layers = [''];
            setPyramids(newPyramids);
          },
        },
      ]
    );
  };

  const updatePyramidName = (index: number, text: string) => {
    const newPyramids = [...pyramids];
    newPyramids[index].name = text;
    setPyramids(newPyramids);
  };

 const sharePyramid = async (pyramidIndex: number) => {
  try {
    const { name, layers } = pyramids[pyramidIndex];
    let textToShare = `🔺 ${name || `Pyramid ${pyramidIndex + 1}`} 🔺\n\n`;
    
    layers.forEach((layer, i) => {
      textToShare += `${i + 1}. ${layer || '[empty]'}\n`;
    });

    await Share.share({ message: textToShare });
  } catch (error) {
    console.log('Error sharing pyramid', error);
  }
};

  return {
    pyramids,
    addPyramid,
    removePyramid,
    addLayer,
    updateIdea,
    removeLayer,
    updatePyramidName,
    sharePyramid,
  } as const;
}
