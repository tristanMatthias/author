// @ts-ignore
import Appdirectory from 'appdirectory';
import Store from 'electron-store';
import fs from 'fs';
import path from 'path';

export const userDirs = new Appdirectory('author');
export const userDataPath = userDirs.userData();
export const gitPath = path.resolve(userDataPath, '.projects');
export const data = new Store();


// @ts-ignore
window.data = data;
// Create the gitPath .projects folder if it doesn't exist
try {
  fs.statSync(gitPath);
} catch {
  fs.mkdirSync(gitPath);
}
