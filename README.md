# FlipCardTest Expo 51
Reproducible example of the flashing in sequenced flipcards since Expo 50

I thought it might work in Expo49 (Didn't make a difference though!), so it includes a folder for Package.json versions for Expo 49 - simply swap them and rename to package.json and reinstall 

testing Expo 49 will only work on simulators because older Expo Go clients aren't avail on ios real devices 

Thhis example has some commented out sections to help testing: 

1. Load via Media Library (we will actually be using a native module for fetching, but it is very similar to Media Library, and same issue occurs, … it was too complicated to add a native module to the example) 

2. Load via remote URLs – have noticed smaller PNGs perform better

3. Load via 'require' method
