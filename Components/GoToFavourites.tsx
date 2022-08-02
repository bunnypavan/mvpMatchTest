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
import {AlbumCard} from './AlbumCard';
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  genreNameText: {
    fontSize: 20,
    padding: 5,
    top: 20,
    bottom: 10,
    left: 10,
    fontWeight: 'bold',
  },
  favoriteText: {
    fontSize: 14,
    padding: 20,
    bottom: 10,
    top: 10,
    left: 15,
    fontWeight: '100',
  },
  mainContainer: {
    marginTop: 20,
    marginLeft: 10,
    backgroundColor: 'white',
  },
  subContainer: {
    paddingTop: 10,
    paddingBottom: 0,
  },
  cardcontainer: {
    overflow: 'hidden',
    backgroundColor: 'white',
    alignItems: 'center',
    width: Dimensions.get('window').width,
    paddingBottom: 60,
  },
  noDataFound: {
    width: Dimensions.get('window').width - 50,
    height: Dimensions.get('window').height / 2,
  },
});

const GoToFavourites: React.FC = ({route}) => {
  const flatListRef = useRef();
  const ITEM_WIDTH = 90;
  const ITEM_MARGIN_RIGHT = 10;
  const {items} = route.params;

  // tried to minimise images load on the screen
  const getItemLayout = (_, index) => {
    return {
      length: ITEM_WIDTH + ITEM_MARGIN_RIGHT,
      offset: (ITEM_WIDTH + ITEM_MARGIN_RIGHT) * (index - 1),
      index,
    };
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'white',
        flex: 1,
      }}>
      {items?.length >= 1 ? (
        <FlatList
          ref={flatListRef}
          data={items}
          style={{marginTop: 5}}
          key={Math.random() * 250}
          numColumns={2}
          getItemLayout={getItemLayout}
          initialNumToRender={2}
          removeClippedSubviews={true}
          contentContainerStyle={styles.cardcontainer}
          renderItem={({item, index}) => {
            return (
              <View style={styles.mainContainer}>
                <AlbumCard
                  image_url={item?.image}
                  artistName={item?.fullTitle}
                  title={item?.imDbRating}
                  selectedFavoriteMovie={true}
                  hideMovie={true}
                />
              </View>
            );
          }}
        />
      ) : (
        <View style={{left: 20}}>
          <Image
            style={styles.noDataFound}
            source={require('./Icons/no-search-found.webp')}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default GoToFavourites;
