//2 versions here… top one most sophistacted with prefetching and double buffering, but doesn't always seem to fare any better? 

//VERSION 2 – ENSURE PREFETCH WITH DOUBLE BUFFERING
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
// //need to use Expo Image or else you'll get the dreaded "No suitable URL request handler found for ph://5BC025F5-22D3-4B97-BF17-39321661A5E2/L0/001" err
import { Image } from 'expo-image';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

const FlipCard2024 = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayImages, setDisplayImages] = useState(images);
  const [preloadImages, setPreloadImages] = useState(null);

  useEffect(() => {
    preloadNextSet(images);
  }, [images]);

  const preloadNextSet = async (nextImages) => {
    const promises = nextImages.map(img => Image.prefetch(img));
    await Promise.all(promises);
    setPreloadImages(nextImages);
    swapImages();
  };

  const swapImages = () => {
    if (preloadImages) {
      setDisplayImages(preloadImages);
      setPreloadImages(null);
    }
  };

  const handleFlipEnd = index => {
    if (index < displayImages.length - 2) {
      setActiveIndex(index + 1); // Activate next flip
    }
  };

  return (
    <View style={styles.container}>
      {displayImages.slice(0, -1).map((img, index) => (
        <FlipCard
          key={index}
          frontImage={img}
          backImage={displayImages[index + 1]}
          isActive={index === activeIndex}
          onFlipEnd={() => handleFlipEnd(index)}
        />
      ))}
    </View>
  );
};

const FlipCard = ({ frontImage, backImage, isActive, onFlipEnd }) => {
  const animatedValue = useSharedValue(0);

  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${animatedValue.value}deg` }],
    opacity: animatedValue.value % 360 <= 90 ? 1 : 0,
  }));

  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${180 + animatedValue.value}deg` }],
    opacity: animatedValue.value % 360 > 90 ? 1 : 0,
  }));

  useEffect(() => {
    if (isActive) {
      animatedValue.value = withTiming(180, { duration: 1500 }, () => {
        runOnJS(onFlipEnd)();
      });
    }
  }, [isActive]);

  return isActive ? (
    <View style={styles.cardContainer}>
      <Animated.View style={[styles.card, frontAnimatedStyle]}>
        <Image source={{ uri: frontImage }} style={styles.image} />
        {/* <Image source={frontImage} style={styles.image} /> */}
      </Animated.View>
      <Animated.View style={[styles.card, backAnimatedStyle, { position: 'absolute' }]}>
        <Image source={{ uri: backImage }} style={styles.image} />
        {/* <Image source={backImage} style={styles.image} /> */}
      </Animated.View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    width: 150,
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    perspective: 1000,
    position: 'relative',
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: 1000,
  },
  card: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  }
});

export default FlipCard2024;

//LOAD FROM MEDIA LIBARY OR URLS
// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet } from 'react-native';
// //need to use Expo Image or else you'll get the dreaded "No suitable URL request handler found for ph://5BC025F5-22D3-4B97-BF17-39321661A5E2/L0/001" err
// import { Image } from 'expo-image';
// import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';

// const FlipCard2024 = ({ images }) => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   const handleFlipEnd = index => {
//     if (index < images.length - 2) {
//       setActiveIndex(index + 1); // Activate next flip
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {images.slice(0, -1).map((_, index) => (
//         <FlipCard
//           key={index}
//           frontImage={images[index]}
//           backImage={images[index + 1]}
//           isActive={index === activeIndex}
//           onFlipEnd={() => handleFlipEnd(index)}
//         />
//       ))}
//     </View>
//   );
// };

// const FlipCard = ({ frontImage, backImage, isActive, onFlipEnd }) => {
//   const animatedValue = useSharedValue(0);

//   const frontAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ rotateY: `${animatedValue.value}deg` }],
//     opacity: animatedValue.value % 360 <= 90 ? 1 : 0,
//   }));

//   const backAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{ rotateY: `${180 + animatedValue.value}deg` }],
//     opacity: animatedValue.value % 360 > 90 ? 1 : 0,
//   }));

//   useEffect(() => {
//     if (isActive) {
//       animatedValue.value = withTiming(180, { duration: 1500 }, () => {
//         runOnJS(onFlipEnd)();
//       });
//     }
//   }, [isActive]);

//   return isActive ? (
//     <View style={styles.cardContainer}>
//       <Animated.View style={[styles.card, frontAnimatedStyle]}>
//         <Image source={{ uri: frontImage }} style={styles.image} />
//       </Animated.View>
//       <Animated.View style={[styles.card, backAnimatedStyle, { position: 'absolute' }]}>
//         <Image source={{ uri: backImage }} style={styles.image} />
//       </Animated.View>
//     </View>
//   ) : null;
// };

// const styles = StyleSheet.create({
//   container: {
//     width: 150,
//     height: 150,
//     alignItems: 'center',
//     justifyContent: 'center',
//     perspective: 1000,
//     position: 'relative',
//   },
//   cardContainer: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//     perspective: 1000,
//   },
//   card: {
//     width: '100%',
//     height: '100%',
//     position: 'absolute',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backfaceVisibility: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//   }
// });

// export default FlipCard2024;

