# Author - Desktop app for editing JSON content

![Author Icon](icon/icon.png "Author icon")

---

Author App is a small desktop app for editing JSON files in Git projects. This can be used in teams where there is a content author/writer who doesn't want to edit code and manually use Git.

This project uses Electron, Typescript and React.


## Setup & Installation
To setup the project, run:
```sh
yarn install
```

## Running in development
To start Electron, run
```
yarn start
```
In a seperate window, start the webpack development server with:
```
yarn dev
```

You can open the Developer tools in Electron with `CMD/CTRL` + `ALT` + `I`.

You can refresh the page with `CMD/CTRL` + `R`


## Building project and application
Firstly, to build the React app, run:
```sh
yarn build
```
This will output the contents to the `./build/` directory and generate the icons.

To bundle the application [electron-builder](https://github.com/electron-userland/electron-builder) is used:

```sh
yarn dist
```

This will generate the distributable applications into the `./dist/`directory.


## Contributions
All pull requests and contributions are most welcome. Let's make the internet better!

## Issues
If you find a bug, please file an issue on the issue tracker on GitHub.

## Credits
The concept of `Author` App was created by [Tristan Matthias](https://github.com/tristanMatthias).
