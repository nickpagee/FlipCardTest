import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
// IF YOU SWITCH TO EXPO 49, you'll need to declare Image in 'react-native' 
//need to use Expo Image or else you'll get the dreaded "No suitable URL request handler found for ph://5BC025F5-22D3-4B97-BF17-39321661A5E2/L0/001" err
import { Image } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator'; //used only for testing compression
import FlipCard2024 from './FlipGrid2024'; // for usual loading of images
import FlipCard2024RequireAssets from './FlipGrid2024RequireAssets';// testing loading via require
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  
  const [imageUrls, setImageUrls] = useState([]); // Image URLs for grid
  const [imagesLoaded, setImagesLoaded] = useState(false); //test of preloading imgs before we send to flipgrid2024
  const [loadKey, setLoadKey] = useState(0); // Add a key to trigger re-renders

    const loadImages = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissions not granted');
        return;
      }

      const media = await MediaLibrary.getAssetsAsync({
        mediaType: 'photo',
        first: 6, // Fetch the last six images
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      const promises = media.assets.map(asset =>
        Image.prefetch(asset.uri)
          .then(() => asset.uri)
          .catch((error) => {
            throw new Error(`Failed to prefetch image: ${error.message}`);
          })
      );

      const urls = await Promise.all(promises);
      setImageUrls([]); // Clear the current images first
      setLoadKey(prevKey => prevKey + 1); // Increment the key to force re-render
      setImageUrls(urls);
      setImagesLoaded(true);
    } catch (error) {
      console.error('Failed to load images:', error);
      setImagesLoaded(false);
    }
  };

  useEffect(() => {
    loadImages();
    console.log('imageUrls:', imageUrls);
  }, []);
  

  //TEMPORARY - TRY COMPRESSING BEFORE SENDING TO FLIPCARD
  // const compressImage = async (uri) => {
  //   const manipResult = await ImageManipulator.manipulateAsync(
  //     uri,
  //     [{ resize: { width: 100, height: 100 } }], // Adjust size as needed
  //     { compress: 0.0, format: ImageManipulator.SaveFormat.JPG }
  //   );
  //   return manipResult.uri;
  // };

  //VERSIONS OF IMAGES TO TEST LOADING REMOTELY
  //COMPARISON TEST – fetching remote images "imageUrls2" - sometimes they don't flash when loading remotely?
  // yesterday they didn't flash, but today for some reason they are flashing 🤷

  //SMALL, NO ISSUES
  const imageUrls2 = [
    'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1478810810369-07072c5ef88b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  ];
  //HIGHER RES, JPG FLASHING
  // const imageUrls2 = [
  //   'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?ixlib=rb-1.2.1&fm=jpg&auto=format&w=1200&q=80',
  //   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&fm=jpg&auto=format&w=1200&q=80',
  //   'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-1.2.1&fm=jpg&auto=format&w=1200&q=80',
  //   'https://images.unsplash.com/photo-1478810810369-07072c5ef88b?ixlib=rb-1.2.1&fm=jpg&auto=format&w=1200&q=80',
  //   'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-1.2.1&fm=jpg&auto=format&w=1200&q=80',
  //   'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&fm=jpg&auto=format&w=1200&q=80'
  // ];
  //HIGHER RES, IMGUR
  // const imageUrls2 = [
  //   'https://i.imgur.com/HbVeSGk.jpeg',
  //   'https://i.imgur.com/6oNIGcE.jpeg',
  //   'https://i.imgur.com/9Ftp8BN.jpeg',
  //   'https://i.imgur.com/U5KNnuO.jpeg',
  //   'https://i.imgur.com/19uoOwM.jpeg',
  //   'https://i.imgur.com/KjN7r1u.jpeg',
  // ];
  //HIGHER RES, PNG
  // const imageUrls2 = [
  //   'https://images.unsplash.com/photo-1558981285-6f0c94958bb6?ixlib=rb-1.2.1&fm=png&auto=format&w=1200&q=80',
  //   'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&fm=png&auto=format&w=1200&q=80',
  //   'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?ixlib=rb-1.2.1&fm=png&auto=format&w=1200&q=80',
  //   'https://images.unsplash.com/photo-1478810810369-07072c5ef88b?ixlib=rb-1.2.1&fm=png&auto=format&w=1200&q=80',
  //   'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?ixlib=rb-1.2.1&fm=png&auto=format&w=1200&q=80',
  //   'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-1.2.1&fm=png&auto=format&w=1200&q=80',
  // ];


  //VERSIONS OF IMAGES TO TEST LOADING VIA REQUIRE
  //Comparison fetching using "Require" - for some reason these are now flashing, even though in my other project they don't
  //flash when using hte 'require' method 🤯
  
  // const imageUrlsRequire = [
  //   require('./assets/images/testFlipIssue/09SOUTHPARK-superJumbo.jpg'),
  //   require('./assets/images/testFlipIssue/south-park-s05e08-2000-7f818013a0174305b2b494e8c2fd968f.jpg'),
  //   require('./assets/images/testFlipIssue/SouthParkChef.png'),
  //   require('./assets/images/testFlipIssue/south-park-s05e08-2000-7f818013a0174305b2b494e8c2fd968f.jpg'),
  //   require('./assets/images/testFlipIssue/KennyMcCormick.png'),
  //   require('./assets/images/testFlipIssue/MV5BZjNhODYzZGItZWQ3Ny00ZjViLTkxMTUtM2EzN2RjYjU2OGZiXkEyXkFqcGdeQXVyMTI5MTc0OTIy._V1_.jpg')
  // ];

  // VARIOUS SIZE PNGS - the ONE UNDER 500kb is fine, '3.png'
  // const imageUrlsRequire = [
  //   require('./assets/images/testFlipIssue/1.png'),
  //   require('./assets/images/testFlipIssue/2.png'),
  //   require('./assets/images/testFlipIssue/5.png'),
  //   require('./assets/images/testFlipIssue/4.png'),
  //   require('./assets/images/testFlipIssue/5.png'),
  //   require('./assets/images/testFlipIssue/6.png'),
  // ];

  // const imageUrlsRequire = [
  //   require('./assets/images/testFlipIssue/1.jpeg'),
  //   require('./assets/images/testFlipIssue/2.jpeg'),
  //   require('./assets/images/testFlipIssue/5.jpeg'),
  //   require('./assets/images/testFlipIssue/4.jpeg'),
  //   require('./assets/images/testFlipIssue/5.jpeg'),
  //   require('./assets/images/testFlipIssue/6.jpeg'),
  // ];

  // const imageUrlsRequire = [
  //   require('./assets/images/testFlipIssue/JPG1.jpeg'),
  //   require('./assets/images/testFlipIssue/JPG2.jpeg'),
  //   require('./assets/images/testFlipIssue/JPG5.jpeg'),
  //   require('./assets/images/testFlipIssue/JPG4.jpeg'),
  //   require('./assets/images/testFlipIssue/JPG5.jpeg'),
  //   require('./assets/images/testFlipIssue/JPG6.jpeg'),
  // ];

  //CONVERTED TO PNGS and MADE SMALLER - THESE WORK!
  // const imageUrlsRequire = [
  //   require('./assets/images/testFlipIssue/1 Medium.png'),
  //   require('./assets/images/testFlipIssue/2 Medium.png'),
  //   require('./assets/images/testFlipIssue/5.png'),
  //   require('./assets/images/testFlipIssue/4 Medium.png'),
  //   require('./assets/images/testFlipIssue/5 Medium.png'),
  //   require('./assets/images/testFlipIssue/6 Medium.png'),
  // ];

  //converted the above to jpgs, these work too
  const imageUrlsRequire = [
    require('./assets/images/testFlipIssue/1 Medium Large.jpeg'),
    require('./assets/images/testFlipIssue/2 Medium Large.jpeg'),
    require('./assets/images/testFlipIssue/5 Medium Large.jpeg'),
    require('./assets/images/testFlipIssue/4 Medium Large.jpeg'),
    require('./assets/images/testFlipIssue/5 Medium Large.jpeg'),
    require('./assets/images/testFlipIssue/6 Medium Large.jpeg'),
  ];

  // const imageUrlsRequire = [
  //   require('./assets/images/testFlipIssue/1 Large.jpeg'),
  //   require('./assets/images/testFlipIssue/2 Large.jpeg'),
  //   require('./assets/images/testFlipIssue/5 Large.jpeg'),
  //   require('./assets/images/testFlipIssue/4 Large.jpeg'),
  //   require('./assets/images/testFlipIssue/5 Large.jpeg'),
  //   require('./assets/images/testFlipIssue/6 Large.jpeg'),
  // ];

 
  return (
    <View style={styles.container} key={loadKey}>
      <Text>Images taken from Google Image Search and Unsplash</Text>
      <View style={{ margin: 16, width: '50%', alignSelf: 'center' }} />
      <Text>Load from Media Library</Text>
      <StatusBar style="auto" />
     
      {imagesLoaded && imageUrls.length >= 6 && (
        <FlipCard2024 images={imageUrls.slice(0, 6)} />
      )}


      
      {/*<View style={{ margin: 16, width: '50%', alignSelf: 'center' }} />
       <Text>Load remote URLs</Text>
      <FlipCard2024 images={imageUrls2.slice(0, 6)}  />  */}
      
      {/* <View style={{ margin: 16, width: '50%', alignSelf: 'center' }} />
      <Text>Load via 'require' asset</Text>
      <FlipCard2024RequireAssets images={imageUrlsRequire.slice(0, 6)}  /> */}

      <Button title="Reload Images" onPress={loadImages} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
