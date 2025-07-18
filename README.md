# Glossary
- UB = Unterrichtsbesuch
    - an attendance

- GUB = Großer Unterrichtsbesuch
    - An attendance becomse a "GUB" if all 3 examinants are present (music, history, educator)

- Sek = Sekundarstufe
    - Sek1 describes school years from 5 - 10 (inclusive)
    - Sek2 describes school years from 11 - 13 (inclusive)

# CI/CD
Expo: https://expo.dev/accounts/flobbe9 <br>
Apple: https://developer.apple.com/account

## .env
The `eas build` command does not seem to use the .env variables (according to this post that is: https://www.reddit.com/r/expo/comments/1feh09e/solution_for_using_environment_variables_in_expo/).

# Debugging
## `drizzle-kit generate` failing
- Could be because of "expo-constants" module. Don't know why but commenting it out in constants.ts can solve the issue.