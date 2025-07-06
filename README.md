# DishDate

**DishDate** is a fun, interactive app where two users (or more in the future) go through a set of dish cards, swiping left or right based on their preferences. The app then shows how many dishes they both liked, helping people bond over shared tastes in food.

## Installation

### Important
    Make sure that codes/secrests are in env files

## Deployment
    Make sure to read supabase auth before production ! SHA1 etc.

## Development build
Using EAS:
```eas build --profile development --platform android```
```eas build --profile development --platform ios```

Uisn EAS locally:
```eas build --profile development --platform android --local```
```eas build --profile development --platform ios --local```


If problem with provisioning profile on iOS use prefix:
```EXPO_NO_CAPABILITY_SYNC=1```

To get EAS Sha1:
````eas credentials  ````

See https://docs.expo.dev/build-reference/local-builds/

## Test