# Glossary
- UB = Unterrichtsbesuch
    - an attendance

- GUB = Großer Unterrichtsbesuch
    - An attendance becomse a "GUB" if all 3 examinants are present (music, history, educator)

- Sek = Sekundarstufe
    - Sek1 describes school years from 5 - 10 (inclusive)
    - Sek2 describes school years from 11 - 13 (inclusive)

# Deploy
## ios credentials
The `eas build` command expects some credentials to be uploaded in eas cloud. This needs to be done once locally and does not happen in the pipeline. See docs below. 

# Docs
## CI/CD
Expo: https://expo.dev/accounts/flobbe9 <br>
Apple apps: https://appstoreconnect.apple.com/apps
Apple certificate stuff: https://developer.apple.com/account/resources/certificates/list <br>
Apple general developer: https://developer.apple.com/account <br>

## Credentials
https://docs.expo.dev/app-signing/local-credentials/

## UI
React native paper: https://callstack.github.io/react-native-paper/docs/components/ActivityIndicator <br>

# Debugging
## `drizzle-kit generate` failing
- Could be because of "expo-constants" module. Don't know why but commenting it out in constants.ts can solve the issue.

## .env
The `eas build` command does not seem to use the .env variables (according to this post that is: https://www.reddit.com/r/expo/comments/1feh09e/solution_for_using_environment_variables_in_expo/).