# Clover-Cooked

Kollaborativ matlagningsapp utvecklad för ett kandidatarbete på Chalmers

På Android går applikationen enkelt att testa genom följande:

1. Ladda ned applikation Expo Go på Android-enheten
2. Skanna QR koden nedan med Expo Go, alternativ följ [denna länk](https://expo.io/@sponken/projects/clover-cooked)

   ![Expo qr](./expo_qr.png)

## Initial installation

1. Installera node.js 14.15.4 LTS <https://nodejs.org/en/download/>
2. Installera Expo CLI genom att köra `npm install -g expo-cli` i valfri terminal
3. Öppna valfri terminal i mappen application och kör `npm install`, kan behöva köras med priveleger

## Mappstruktur

- Alla bilder, video, ljud och liknande ligger under `assets`
- All kod ligger under `src`
- Alla skärmar "screens" ligger under `src/screens`,
  en screen är en react component som ska fylla hela (eller nästan hela) skärmen.
- Alla mindre react componenter ligger under `src/components/namn`
- Inte säker på tester, kanske `src/__tests__`, kanske en test mapp per annan mapp i den

## Körning av applikation

### Fysisk enhet

- Klona projektet
- Ladda ner Expo Go på enheten
- Kör `expo start` i `/application` mappen i valfri terminal, använd `--tunnel` om enheten inte är på samma närverk som datorn
- Scanna QR-koden som visas i webbläsare eller terminal (använd kameran på ios och Expo Go på Android)

### Android emulator

<https://docs.expo.io/workflow/android-studio-emulator/>

### iOS emulator (fungerar bara på mac (osx))

<https://docs.expo.io/workflow/ios-simulator/>

## Formatering

- Formatering körs med Prettier - Code formatter "esbenp.prettier-vscode", installera detta i vscode
- Hela projectet kan enkelt formateras genom att köra `npm run format`
