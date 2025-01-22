# DishDate

**DishDate** is a fun, interactive app where two users (or more in the future) go through a set of dish cards, swiping left or right based on their preferences. The app then shows how many dishes they both liked, helping people bond over shared tastes in food.

## Installation

### Important
    Make sure that codes/secrests are in env files

## Deployment
    Make sure to read supabase auth before production ! SHA1 etc.

## Development build
Using EAS
```eas build --profile development --platform android```


Using locally:
````npx expo run:android````
To get local SHA1:
````../gradlew signingReport```` in android folder
or
````eas build --platform android --local````

To get EAS Sha1:
````eas credentials  ````

See https://docs.expo.dev/build-reference/local-builds/