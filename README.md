# Clover-Cooked

Koolaborativ matlagningsapp utvecklad för ett kandidatarbete på Chalmers

## Initial insatallation

1. Installera node.js 14.15.4 LTS <https://nodejs.org/en/download/>
2. Installera Expo CLI genom att köra `npm install -g expo-cli` i valfri terminal
3. Öppna valfri terminal i mappen application och kör `npm install`, kan behöva köras med priveleger

## Resurser för att lära sig react-native

-   Officiell getting started dokumentation: <https://reactnative.dev/docs/getting-started>
-   2-timmars Tutorial for Beginners: <https://www.youtube.com/watch?v=0-S5a0eXPoc>
-   Webbapp för att lära sig react native: <https://www.reactnative.express/>
-   Dokumentation för TypeScript: <https://www.typescriptlang.org/docs/>

## Mappsruktursförslag av Emanuel

-   Alla bilder, video, ljud och liknande ligger under `assets`
-   All kod ligger under `src`
-   Alla skärmar "screens" ligger under `src/screens`,
    en screen är en react component som ska fylla hela (eller nästan hela) skärmen.
-   Alla mindre react componenter ligger under `src/components/namn`
-   Allt som hanterar nätverk ligger under `src/network`
-   Inte säker på tester, kanske `src/tests`, kanske en test mapp per annan mapp i den

## Körning av applikation

### Fysisk enhet

-   Ladda ner Expo Go på enheten
-   Kör `expo start` i application mappen i valfri terminal, använd `--tunnel` om enheten inte är på samma närverk som datorn
-   Scanna QR-koden som visas i webbläsare eller terminal (använd kameran på ios och Expo Go på Android)

### Android emulator

<https://docs.expo.io/workflow/android-studio-emulator/>

### ios emulator (fungerar bara på mac (osx))

<https://docs.expo.io/workflow/ios-simulator/>

## Formatering

-   Formatering körs med Prettier - Code formatter "esbenp.prettier-vscode", installera detta i vscode
-   Hela projectet kan enkelt formateras genom att köra `npm run format`
