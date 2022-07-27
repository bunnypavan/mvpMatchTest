import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import SearchBar from 'react-native-dynamic-search-bar';
import {AlbumCard} from './AlbumCard';
import NetInfo from '@react-native-community/netinfo';

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
    padding: 10,
    bottom: 10,
    top: 15,
    left: 20,
    borderWidth: 1,
    borderColor: 'white',
    fontWeight: '100',
    borderRadius: 10,
  },
  mainContainer: {
    marginTop: 20,
    marginLeft: 10,
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
  searchRender: {
    flexDirection: 'column-reverse',
    justifyContent: 'space-between',
    padding: 10,
  },
  noDataFound: {
    width: Dimensions.get('window').width - 50,
    height: Dimensions.get('window').height / 2,
  },
  selectedImg: {
    top: -10,
    zIndex: 1,
  },
});

const MovieList: React.FC = props => {
  const fetchUrl = 'https://imdb-api.com/en/API/Top250TVs/k_9to3u4hy';
  const flatListRef = useRef();
  const [searchText, setSearchText] = useState<string>('');
  const [loadData, setLoadData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [localData, setLocalData] = useState<any>([]);
  var filteredArray: any[] = [];
  const ITEM_WIDTH = 90;
  const ITEM_MARGIN_RIGHT = 10;

  const moveToTop = () => {
    if (flatListRef !== null && flatListRef.current !== null) {
      flatListRef.current.scrollToIndex({
        index: 0,
        animated: true,
      });
    }
  };

  // check internet Connectivity
  useEffect(() => {
    unsubscribe();
  }, []);

  const unsubscribe = () => {
    NetInfo.fetch().then(state => {
      setTimeout(function () {
        if (state.isConnected) {
          setLoading(true);
        } else {
          setLoading(false);
        }
      }, 500);
    });
  };

  const renderNoInternet = () => {
    return !loading ? (
      <View style={{marginTop: 30, left: 20}}>
        <Text>{`Please check your internet connection and try again`}</Text>
        <Button
          title="Try Again"
          onPress={() => {
            setLoading(true);
            unsubscribe();
          }}
          loading={loading}
        />
      </View>
    ) : null;
  };

  // Loading mapped data by setting a state
  useLayoutEffect(() => {
    if (localData?.length === 0) {
      mapVideos();
      setLoadData(localData);
    }
  }, []);

  // Api hitting to fetch the data
  const api = () => {
    return fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        const albumData = data;
        return albumData;
      })
      .catch(error => {
        Alert.alert('OOPS Something went wrong!! Please try again later');
        console.error(error);
      });
  };

  // When user tries to search for movies list,
  // then we load the data as per its substring and pass it to its state
  useLayoutEffect(() => {
    if (searchText?.length > 1) {
      const result = loadData.filter((item: any) => {
        const checkSubString = item?.title?.slice(0, searchText?.length);
        if (searchText === checkSubString) {
          moveToTop();
          return item;
        }
      });
      console.log(result, 'PRINT ALL');
      setLoadData(result);
    } else {
      setLoadData(localData);
    }
  }, [searchText]);

  // tried to minimise images load on the screen
  const getItemLayout = (_, index) => {
    return {
      length: ITEM_WIDTH + ITEM_MARGIN_RIGHT,
      offset: (ITEM_WIDTH + ITEM_MARGIN_RIGHT) * (index - 1),
      index,
    };
  };

  // Data is loaded using state
  const mapVideos = () => {
    if (localData?.length === 0) {
      api().then(res => {
        setLocalData(res?.items);
      });
    }
  };

  // Favorite image on Go to Favorite button
  const favouriteSelection = () => {
    return (
      <Image
        style={styles.selectedImg}
        source={require('./Icons/selection.png')}
      />
    );
  };

  //Clearing search text
  const onClearSearchBar = () => {
    setSearchText('');
    Keyboard.dismiss();
  };

  // Navigating on click of specific screen with details
  const onPress = item => {
    props?.navigation?.navigate('DetailsScreen', {items: item});
  };

  // Pushing as per the user Selection and removing the unselected item from the list
  const onFavSelection = (isSelected: boolean, selectedMovie: any) => {
    if (isSelected === true) {
      filteredArray.push(selectedMovie);
    } else {
      filteredArray = filteredArray.filter(function (item) {
        return item?.title !== selectedMovie?.title;
      });
    }
    console.log(filteredArray, 'Selected');
  };

  // render Search bar
  const renderSearchBar = () => {
    return (
      <View style={styles.searchRender}>
        <View style={{flexDirection: 'row', padding: 5}}>
          <Text
            style={[
              styles.genreNameText,
              {color: loadData?.length > 1 ? 'white' : '#F5F5F5'},
            ]}>
            {'TOP 250 Movies'}
          </Text>
          {loadData?.length > 1 ? (
            <TouchableOpacity
              onPress={() => {
                props?.navigation?.navigate('GoToFavourites', {
                  items: filteredArray,
                });
              }}>
              <Text
                style={[
                  styles.favoriteText,
                  {color: loadData?.length > 1 ? 'white' : '#F5F5F5'},
                ]}>
                {'Go To Favorites'}
                {favouriteSelection()}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <SearchBar
          placeholder="Search For Your Favorite Movie"
          onChangeText={text => setSearchText(text)}
          onClearPress={() => onClearSearchBar()}
          spinnerVisibility={false}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: loadData?.length >= 1 ? '#398582' : '#F5F5F5',
        flex: 1,
      }}>
      {loading && renderSearchBar()}
      {renderNoInternet()}
      {loading && loadData?.length >= 1 ? (
        <FlatList
          ref={flatListRef}
          data={loadData}
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
                  onPressFavorite={isSelected =>
                    onFavSelection(isSelected, item)
                  }
                  onPress={() => onPress(item)}
                  hideFavorite={false}
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

export default MovieList;
