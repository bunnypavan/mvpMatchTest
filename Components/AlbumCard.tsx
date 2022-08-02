import React, {useState} from 'react';
import {
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 4,
  },

  imageContainer: {
    width: screenWidth / 2.3,
    height: screenWidth / 2.3,
    borderRadius: 10,
  },
  artistSyling: {
    top: 5,
    width: screenWidth / 3,
    fontSize: 15,
    color: '#398582',
    textAlign: 'center',
  },
  titleStyling: {
    top: 5,
    width: screenWidth / 3,
    fontSize: 10,
    color: '#398582',
    textAlign: 'center',
  },
  selectedImageStyling: {
    width: 15,
    height: 15,
    zIndex: 1,
    tintColor: '#398582',
  },
  hideFavorite: {
    position: 'absolute',
    top: -15,
    right: 2,
  },
  hideMovie: {
    borderRadius: 10,
    borderColor: 'red',
    fontWeight: '400',
    fontSize: 10,
    borderWidth: 1,
    top: 10,
    padding: 4,
    color: 'red',
  },
  unhideMovie: {
    borderRadius: 10,
    borderColor: 'green',
    fontWeight: '400',
    fontSize: 10,
    borderWidth: 1,
    top: 10,
    padding: 4,
    color: 'green',
  },
});

export interface AlbumCardProps {
  image_url: string;
  title: string;
  artistName: string;
  onPress?: TouchableOpacityProps['onPress'];
  onPressFavorite?: (isFavoriteSelected: boolean) => void;
  onPressHide?: (isHidden: boolean) => void;
  selectedFavoriteMovie?: boolean;
  hideMovie?: boolean;
}

export const AlbumCard: React.FC<AlbumCardProps> = props => {
  const [selected, setSelected] = useState<boolean>(false);
  const [hide, setHide] = useState<boolean>(false);

  const selecteYourFavoriteMovie = () => {
    setSelected(!selected);
    props?.onPressFavorite && props?.onPressFavorite(!hide);
  };
  const hideMovieFromList = () => {
    setHide(!hide);
    props?.onPressHide && props?.onPressHide(!hide);
  };

  const noFavoriteSelection = () => {
    return (
      <Image
        style={styles.selectedImageStyling}
        source={require('./Icons/noSelection.png')}
      />
    );
  };

  const favouriteSelection = () => {
    return (
      <Image
        style={styles.selectedImageStyling}
        source={require('./Icons/selection.png')}
      />
    );
  };

  return (
    <TouchableOpacity style={styles.mainContainer} onPress={props.onPress}>
      <FastImage
        style={styles.imageContainer}
        source={{uri: props?.image_url, priority: FastImage.priority.high}}
      />
      <Text style={styles.artistSyling} numberOfLines={1}>
        {props?.artistName}
      </Text>
      <Text style={styles.titleStyling} numberOfLines={1}>
        {`IMDB Ranking: ${props?.title}`}
      </Text>

      {!props.hideMovie ? (
        <TouchableOpacity onPress={() => hideMovieFromList()}>
          <Text style={hide ? styles.hideMovie : styles.unhideMovie}>
            {'Remove From Search'}
          </Text>
        </TouchableOpacity>
      ) : null}
      {!props.selectedFavoriteMovie ? (
        <TouchableOpacity
          onPress={() => selecteYourFavoriteMovie()}
          style={styles.hideFavorite}>
          {selected ? favouriteSelection() : noFavoriteSelection()}
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );
};
