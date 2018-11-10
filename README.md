# S3Uploader

![alt text](https://github.com/Yamazaki93/S3Uploader/raw/master/misc/s3uploader.gif "Preview")

A minimalistic UI to conveniently upload and download files from AWS S3

S3Uploader's UI is based on the beautiful [Argon Dashboard Theme by CreativeTim](https://www.creative-tim.com/product/argon-dashboard).

**This app is not endorsed by Amazon**

# Highlights

 - Angular based desktop client for uploading/downloading file(s) from AWS S3
 - Track multiple upload/download progress through one consistent UI.
 - Tree-like folder browser so you can find the files you want faster
 - Support for .aws credential file and multiple accounts
 - Drag-and-drop upload with support for single file, multiple files and folder upload
 - Options to rename files during upload

# Built On

This app is built with many amazing framework, including:

<a href="https://electronjs.org/"><img src="https://camo.githubusercontent.com/627c774e3070482b180c3abd858ef2145d46303b/68747470733a2f2f656c656374726f6e6a732e6f72672f696d616765732f656c656374726f6e2d6c6f676f2e737667" width="250"></a>

<a href="https://angular.io/"><img src="https://angular.io/assets/images/logos/angular/angular.svg" width="150"></a>

<a href="https://ionicons.com/"><svg width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 161.2c-52.3 0-94.8 42.5-94.8 94.8s42.5 94.8 94.8 94.8 94.8-42.5 94.8-94.8-42.5-94.8-94.8-94.8z"/><circle cx="392.1" cy="126.4" r="43.2"/><path d="M445.3 169.8l-1.8-4-2.9 3.3c-7.1 8-16.1 14.2-26.1 17.9l-2.8 1 1.1 2.7c8.6 20.7 13 42.7 13 65.2 0 93.7-76.2 169.9-169.9 169.9S86.1 349.7 86.1 256 162.3 86.1 256 86.1c25.4 0 49.9 5.5 72.8 16.4l2.7 1.3 1.2-2.7c4.2-9.8 10.8-18.5 19.2-25.2l3.4-2.7-3.9-2C321.6 55.8 289.5 48 256 48 141.3 48 48 141.3 48 256s93.3 208 208 208 208-93.3 208-208c0-30-6.3-59-18.7-86.2z"/></svg> IonIcons</a>

# Getting Started

Head over to the [Releases](https://github.com/Yamazaki93/S3Uploader/releases) page and download the latest version to get started!

## Windows

Download the latest `setup.exe` and follow the installation instruction.

## MacOS

You can download either the `.zip` or `.dmg` to use S3Uploader.

If you downloaded the `.zip`:
  
  1. Extract the content of the `.zip` file.
  2. You can put the extracted file in your `/Applications` folder for it to show up in Launchpad.

If you downloaded the `.dmg`:

  1. Open the `.dmg` file.
  2. After clicking "Agree", drag the S3Uploader icon into the Applications folder icon on screen.
  3. S3Uploader should now be available in Launchpad.
  4. If there's a separate S3Uploader icon appears on your Desktop, you can remove that by dragging it to the Trashcan.


# Building

You can build this app from source with the following configurations

 - Global tools needed, they can be installed via npm or yarn: `@angular/cli electron-builder`

```bash
  ./build.ps1
```
Output files are located in `dist-electron`

# License

MIT (c) 2018 Ming-Hung (Michael) Lu

If you like the app, maybe consider <a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/mjCsGWDTS"><img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy me a tea"><span style="margin-left:5px">Buy me a tea</span></a>, a gazillion ton of black tea went into this app 😉
