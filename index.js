const { app, BrowserWindow } = require("electron");
const {autoUpdater, AppUpdater } = require("electron-updater");

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    titleBarOverlay: true
  });

  win.loadFile("src/index.html");
};

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-available", (info) => {
  curWindow.showMessage(`Update available. Current version ${app.getVersion()}`);
  autoUpdater.downloadUpdate();
});
