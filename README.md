# Glossary
- UB = Unterrichtsbesuch
    - an attendance

- GUB = Großer Unterrichtsbesuch
    - An attendance becomse a "GUB" if all 3 examinants are present (music, history, educator)

- Sek = Sekundarstufe
    - Sek1 describes school years from 5 - 10 (inclusive)
    - Sek2 describes school years from 11 - 13 (inclusive)


# Deploy

<strong>Important:</strong> The deploy pipeline assumes that eas build profiles and git branches are named the same!

## ios credentials
The `eas build` command expects some credentials to be uploaded in eas cloud. This needs to be done once locally and does not happen in the pipeline. See docs below. 

## qa deploy
- merge `development` into `qa`
- start the deployment pipeline in `qa` branch manually

## prod deploy
- increase the version in `development` then merge to `qa` and then to `master`
- start the deployment pipeline in `production` branch manually <br>
Note that this does not deploy to the app store but to testFlight. Production deployment is done manually (ios: https://appstoreconnect.apple.com/apps)

# Docs
## CI/CD
Expo: https://expo.dev/accounts/flobbe9 <br>
Apple apps: https://appstoreconnect.apple.com/apps
Apple certificate stuff: https://developer.apple.com/account/resources/certificates/list <br>
Apple general developer: https://developer.apple.com/account <br>

## Credentials
Once ios credentials expire, use `eas credentials` to generate and upload new ones to eas cloud. Important: choose "Build Credentials: Manage everything needed to build your project", don't
upload manual credentials.json stuff because eas credentials will somehow invalidate the .mobileprovision file in the process. <br>
https://docs.expo.dev/app-signing/local-credentials/

## UI
React native paper: https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator <br>

# Debugging
## `drizzle-kit generate` failing
- Could be because of "expo-constants" module. Don't know why but commenting it out in constants.ts can solve the issue.

## .env
The `eas build` command does not seem to use the .env variables (according to this post that is: https://www.reddit.com/r/expo/comments/1feh09e/solution_for_using_environment_variables_in_expo/).