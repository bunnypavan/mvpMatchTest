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
  LogBox,
} from 'react-native';
import SearchBar from 'react-native-dynamic-search-bar';
import {AlbumCard} from './AlbumCard';
import NetInfo from '@react-native-community/netinfo';
import {Spinner} from './Spinner';

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
    // top: -10,
    position: 'absolute',
    top: 15,
    right: -13,
    width: 15,
    height: 15,
    // zIndex: 1,
  },
});

const MovieList: React.FC = props => {
  const fetchUrl = 'https://imdb-api.com/en/API/Top250TVs/k_9to3u4hy';
  LogBox.ignoreAllLogs(true);
  const flatListRef = useRef();
  const [searchText, setSearchText] = useState<string>('');
  const [loadData, setLoadData] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [localData, setLocalData] = useState<any>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [hideData, setHideData] = useState<any>([]);
  var filteredArray: any[] = [];
  var hiddenData: any[] = [];
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
  useLayoutEffect(() => {
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
    return (
      <View style={{marginTop: 30, left: 20}}>
        <View>
          <Image
            style={styles.noDataFound}
            source={require('./Icons/no-search-found.webp')}
          />
        </View>
        <Text
          style={{
            padding: 10,
            marginRight: 10,
            fontSize: 14,
            fontWeight: '100',
          }}>{`Please check your internet connection/Search Content and try again`}</Text>
        <View style={{marginRight: 10}}>
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              setShowSpinner(true);
              unsubscribe();
              triggerMovieApi();
            }}>
            <Text
              style={{
                textAlign: 'center',
                borderRadius: 10,
                borderColor: '#FC9916',
                fontWeight: 'bold',
                borderWidth: 1,
                width: '30%',
                padding: 7,
                color: '#FC9916',
              }}>
              {'Try Again'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Loading mapped data by setting a state
  useLayoutEffect(() => {
    if (loadData?.length === 0) {
      triggerMovieApi();
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
    setShowSpinner(true);
    if (searchText?.length > 3) {
      console.log(loadData?.length, 'LENGTH');
      filteredArray = loadData?.filter((item: any) => {
        const checkSubString = item?.title?.slice(0, searchText?.length);
        if (
          searchText.toLowerCase() === checkSubString.toLowerCase() ||
          searchText.toUpperCase() === checkSubString.toUpperCase()
        ) {
          moveToTop();
          return item;
        }
      });
      setShowSpinner(false);
      setLoadData(filteredArray);
    } else {
      setLoadData(localData);
      setShowSpinner(false);
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
  const triggerMovieApi = () => {
    setShowSpinner(true);
    api()
      .then(res => {
        setLoadData(res?.items);
        setLocalData(res?.items);
        setShowSpinner(false);
      })
      .catch(err => {
        setShowSpinner(false);
        setLoading(false);
        console.error(err);
      });
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
    setLoadData(loadData);
  };

  // Navigating on click of specific screen with details
  const onPress = item => {
    props?.navigation?.navigate('DetailsScreen', {items: item});
  };

  // Pushing as per the user Selection and removing the unselected item from the list
  const onFavSelection = (isSelected: boolean, selectedMovie: any) => {
    console.log('onFavSelection', selectedMovie);
    if (isSelected === true) {
      filteredArray.push(selectedMovie);
    } else {
      filteredArray = filteredArray?.filter(function (item) {
        return item?.title !== selectedMovie?.title;
      });
    }
  };

  const onHide = (isHidden: boolean, selectedMovie: any) => {
    if (isHidden === true) {
      const arr = loadData?.filter(function (item) {
        return item?.title !== selectedMovie?.title;
      });
      setLoadData(arr);
    }
  };

  // render Search bar
  const renderSearchBar = () => {
    return loadData?.length >= 1 ? (
      <View style={styles.searchRender}>
        <View style={{flexDirection: 'row', padding: 5}}>
          <Text
            style={[
              styles.genreNameText,
              {color: loadData?.length >= 1 ? 'white' : '#F5F5F5'},
            ]}>
            {'TOP 250 Movies'}
          </Text>

          <TouchableOpacity
            onPress={() => {
              props?.navigation?.navigate('GoToFavourites', {
                items: filteredArray,
              });
            }}>
            {favouriteSelection()}
            <Text
              style={[
                styles.favoriteText,
                {color: loadData?.length > 1 ? 'white' : '#F5F5F5'},
              ]}>
              {'Go To Favorites'}
            </Text>
          </TouchableOpacity>
        </View>
        <SearchBar
          placeholder="Search For Your Favorite Movie"
          onChangeText={text => setSearchText(text)}
          onClearPress={() => onClearSearchBar()}
          spinnerVisibility={false}
        />
      </View>
    ) : null;
  };
  console.log(loading, 'Load');
  return (
    <SafeAreaView
      style={{
        backgroundColor: loadData?.length >= 1 ? '#398582' : '#F5F5F5',
        flex: 1,
      }}>
      {loadData?.length >= 1 ? renderSearchBar() : null}
      {!showSpinner && loadData?.length >= 1 ? null : renderNoInternet()}
      {showSpinner && <Spinner />}
      {loadData?.length >= 1 && (
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
                  onPressHide={isHideen => onHide(isHideen, item)}
                  onPress={() => onPress(item)}
                  selectedFavoriteMovie={false}
                  hideMovie={false}
                />
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default MovieList;
