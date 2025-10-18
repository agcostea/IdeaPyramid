import React from 'react';
import { ScrollView, Text, View, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { usePyramids } from './Pyramid';
import { styles } from './styles';

export default function PyramidApp() {
  const {
    pyramids,
    addPyramid,
    removePyramid,
    addLayer,
    updateIdea,
    removeLayer,
    updatePyramidName,
    sharePyramid,
  } = usePyramids();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Idea Pyramid</Text>
      <Text style={styles.description}>
        “Your mind is for having ideas, not holding them” – David Allen
      </Text>

      {pyramids.map((pyramid, pyramidIndex) => (
        <View key={pyramidIndex} style={{ marginBottom: 40 }}>
          <View style={styles.pyramidHeader}>
            <TextInput
              style={styles.pyramidNameInput}
              value={pyramid.name}
              onChangeText={(text) => updatePyramidName(pyramidIndex, text)}
              placeholder={`Pyramid ${pyramidIndex + 1} Name`}
              placeholderTextColor="#999999"
            />
            <TouchableOpacity
              onPress={() => removePyramid(pyramidIndex)}
              style={{ marginLeft: 10 }}
            >
              <Feather name="trash-2" size={20} color="#ff5555" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sharePyramid(pyramidIndex)}
              style={{ marginLeft: 10 }}
            >
              <Feather name="share-2" size={20} color="#4da6ff" />
            </TouchableOpacity>
          </View>

          <View style={styles.pyramid}>
            {[...pyramid.layers].reverse().map((idea, i) => {
              const index = pyramid.layers.length - 1 - i;
              const minWidth = 120;
              const maxWidth = 300;
              const widthStep = (maxWidth - minWidth) / (pyramid.layers.length - 1 || 1);
              const width = maxWidth - i * widthStep;

              return (
                <View key={index} style={styles.layerRow}>
                  <View style={[styles.layer, { width }]}>
                    <TextInput
                      style={styles.layerText}
                      value={idea}
                      onChangeText={(text) => updateIdea(pyramidIndex, index, text)}
                      placeholder={`Layer ${pyramid.layers.length - i}`}
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
