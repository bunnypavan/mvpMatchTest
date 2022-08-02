#How to run the app

**Do npm install and after that cd ios && pod install && cd .. **
It is well tested in iOS, **Please run this app from Xcode** only as I had faced some metro bundler issues on VsCode for npx react-native run-ios command.

# MVP Home Assignment to show movie list

The features that I implemented by fetching all top 250 movies list from IMDB API

1. Rendering all the Movies list with its image, title, Imdb ranking
2. User after click on the one of the Movie Record, it will go the other page to show all the details related to that Movie.
3. User can select on a Star Icon which will be available for Every Movie record to add it in the Favourites list.
4. We can also unselect movie from the favorited list.
5. After selecting as per the Favorite list, The same will be available in the Favorite Screen
6. There is a search option where the user can search for his/her optioned movie, that will be filtered and seen it on the screen.
7. If internet is lost or the searched movie is not available in the top 250 movies list, then I am providing 'No data Available Image' and 'Please Try again button to hit the api once again to see the listed items'.
7. Due to my less bandwidth I have Decided to go with all the above mentioned implementations and if anything is missing then we can freely discuss on that.

