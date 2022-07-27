import React, {useLayoutEffect, useRef, useState} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 15,
  },

  imageContainer: {
    width: screenWidth / 1.1,
    height: screenWidth / 1.3,
    borderRadius: 10,
  },
  artistSyling: {
    top: 10,
    width: screenWidth / 1.1,
    fontSize: 15,
    fontWeight: 'normal',
    color: 'white',
    padding: 4,
    left: 5,
  },
  titleStyling: {
    top: 10,
    fontSize: 13,
    fontWeight: 'normal',
    color: 'white',
    padding: 4,
    left: 5,
  },
  subContainerView: {
    backgroundColor: '#398582',
    paddingVertical: 20,
    top: 10,
    width: Dimensions.get('window').width - 30,
    borderRadius: 20,
  },
  boldTextStyling: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 17,
  },
});

const DetailsScreen: React.FC = ({route}) => {
  const {items} = route.params;
  return (
    <View style={styles.mainContainer}>
      <Image style={styles.imageContainer} source={{uri: items?.image}} />
      <View style={styles.subContainerView}>
        <Text style={styles.artistSyling} numberOfLines={2}>
          <Text style={styles.boldTextStyling}>Movie:</Text>
          {` ${items?.title}`}
        </Text>
        <Text style={styles.artistSyling} numberOfLines={2}>
          <Text style={styles.boldTextStyling}>Year Of Launch:</Text>
          {` ${items?.year}`}
        </Text>
        <Text style={styles.titleStyling} numberOfLines={2}>
          <Text style={styles.boldTextStyling}>Starrers:</Text>
          {` ${items?.crew}`}
        </Text>
        <Text style={styles.titleStyling}>
          <Text style={styles.boldTextStyling}>Rank: </Text>
          {` ${items?.rank}`}
        </Text>
        <Text style={styles.titleStyling}>
          <Text style={styles.boldTextStyling}>IMDB Rating:</Text>
          {` ${items?.imDbRating}`}
        </Text>
      </View>
    </View>
  );
};

export default DetailsScreen;
