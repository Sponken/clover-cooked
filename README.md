# Clover-Cooked

A collaborative cooking tool developed for the scope of a Degree project at bachelor's level at [Chalmers](https://www.chalmers.se/en/Pages/default.aspx). 

Clover Cooked make it more enjoyable and effective to cook with other people, by empowers you through behavior design and automatic task delegation scheduling.

![exampleScreens](https://github.com/Sponken/clover-cooked/blob/imagesInReadme/exampleImagesOfUserInterface/cloverCookedExampleScreens.png?raw=true)
![concurrency](https://github.com/Sponken/clover-cooked/blob/imagesInReadme/exampleImagesOfUserInterface/concurrency.png?raw=true)
![cloverCookedIcon](https://github.com/Sponken/clover-cooked/blob/imagesInReadme/exampleImagesOfUserInterface/Clover-Cooked.jpg?raw=true)
#### "To live in clover" means to live well, in ease.






## Give it a try!


On Android the application can easily be tried by:

1. Downloading the application [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) on your Android-device
2. Scan the QR code below inside  [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US), or visit [this link](https://expo.io/@sponken/projects/clover-cooked).

   ![Expo qr](./expo_qr.png)


## The why and how of Clover Cooked:

Presentation Slides([English](https://docs.google.com/presentation/d/1NERPcrvg5FEZKNry3iajL7epWdKtxhluA5uOk2f7pVU/edit?usp=sharing), [Swedish](https://docs.google.com/presentation/d/1NERPcrvg5FEZKNry3iajL7epWdKtxhluA5uOk2f7pVU/edit?usp=sharing))

[Project report](https://odr.chalmers.se/handle/20.500.12380/304131?locale=en)


## Running the application

### Initial installation

1. Install node.js 14.15.4 LTS <https://nodejs.org/en/download/>
2. Install Expo CLI by running `npm install -g expo-cli` in a [terminal application](https://en.wikipedia.org/wiki/Command-line_interface) of your choice.
3. Navigate your [terminal application](https://en.wikipedia.org/wiki/Command-line_interface) to where you cloned this repo and run `npm install`. Might need to run it with privilege as system administrator, e.g. on Mac using the `sudo npm install` command instead.


### Run the app locally on a smartphone device

- Clone the project
- Download the application Expo Go on your [iOS](https://apps.apple.com/us/app/expo-go/id982107779) or [Android](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) device

- Run `expo start` in the folder `/application` using your terminal application of choice, add the flag `--tunnel` to the command like so: `expo start --tunnel` if the device isn't on the same network as the computer
- Scan the QR code shown in the terminal or in the page that the webbrowser probably shows you after running the command. On iOS you can just with the normal camera and follow the notification. On Android you can open the [Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US) app and scan the QR code from there.


### Android emulator

<https://docs.expo.io/workflow/android-studio-emulator/>

### iOS emulator (Only works on macOS/osx)

<https://docs.expo.io/workflow/ios-simulator/>



## Folder structure

- All image, video and audio files relevant to the application are located in  `assets`
- All code for the application is located in 'src'
- All screens of the application are located in `src/screens`,
  a screen is a [react](https://reactjs.org) component that fill the whole (or almost the whole) screen.
- Alla mindre react componenter ligger under `src/components/namn`
- All smaller [react](https://reactjs.org) components are located in `src/components/nameOfComponent`


## Formatting

- Prettier - Code formatter "esbenp.prettier-vscode", you can install this in [vscode](https://code.visualstudio.com/Download) 
- The whole project can easily be formatted by running `npm run format` in the terminal while inside the project directory



# Authors

Alexandra Parkegren

William Albertsson

Emanuel Olaison

Eric Bergdahl

Pontus Sundqvist

Joar Granström


## Rights

MIT license
