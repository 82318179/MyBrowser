'use strict';
import packageInfo from '../package';
import {
	app,
	protocol,
	ipcMain,
	dialog
} from 'electron';
import {
	autoUpdater
} from 'electron-updater';
import {
	createProtocol
} from 'vue-cli-plugin-electron-builder/lib';
import windowControl from './tools/main/windowControl';
protocol.registerSchemesAsPrivileged([{
	scheme: 'app',
	privileges: {
		secure: true,
		standard: true
	}
}]);
let win = null;
const isDevelopment = process.env.NODE_ENV !== "production";
/*初始化ipc*/
function bindIpc() {
	/*系统操作事件*/
	ipcMain.on('system', (event, type, data) => {
		switch (type) {
			case 'check-for-update' /*检查更新*/ :
				autoUpdater.setFeedURL(data);
				autoUpdater.checkForUpdates();
				break;
			case 'update' /*安装更新*/ :
				autoUpdater.quitAndInstall();
				break;
			case 'exit':
				app.quit();
				break;
		}
	});
	ipcMain.on('browser', (event, type, data) => {
		console.log(type);
		switch (type) {
			case 'screenshot' /*截图*/ :
				win.webContents.send('screenshot');
				break;
			case 'mouseMenu' /*显示右键*/ :
				win.webContents.send('browser', type, data);
				break;
		}
	});
}
/*创建窗口*/
function createWindow(data) {
	if (win) {
		return windowControl.active(win, data);
	}
	win = windowControl.create({
		width: 800,
		height: 600,
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			webviewTag: true,
			webSecurity: false,
			plugins: true
		}
	});
	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		if (!process.env.IS_TEST) win.webContents.openDevTools();
	} else {
		createProtocol("app");
		// Load the index.html when not in development
		win.loadURL("app://./index.html");
	}
}
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
	app.quit();
} else {
	app.on('second-instance', () => {
		//这里是单例模式，当已经存在窗口仍然打开的处理
		if (win) {
			win.show();
		}
	});
	app.on('ready', function () {
		bindIpc(); //初始化ipc
		// createProtocol('app');
		app.setAppUserModelId(packageInfo.appId);
		app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
		try {
			let flash = app.getPath("pepperFlashSystemPlugin");
			app.commandLine.appendSwitch("ppapi-flash-path", flash);
		} catch (e) {
			dialog.showErrorBox(
				"缺少flash插件",
				"请前往https://www.flash.cn/下载该插件,点击确定后将打开flash下载地址"
			);
		}
		createWindow(true);
	});
}
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', () => {
	if (win === null) {
		createWindow(true);
	}
});