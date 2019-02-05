import path from 'path';
import git from 'simple-git/promise';
import { gitPath } from './data';

const parseCloneMessage = (msg: string) => {
  const reg = {
    dir: /^Cloning into \'(.*)\'/,
    receiving: /^Receiving objects:\s+(\d+)%/
  };

  const matched = Object.entries(reg)
    .filter(([, r]) => {
      return r.test(msg);
    });

  if (matched.length) {
    const [match] = matched;
    const [type, r] = match;
    const result = r.exec(msg)[1];
    return { type, result };
  } else return false;
};

// tslint:disable-next-line:export-name
export const clone = async (url: string, name: string, onReceiving?: (percent: number) => void) => {
  let dir: string;

  await git(gitPath).outputHandler((command, stdout, stderr) => {
    stdout.pipe(process.stdout);
    stderr.pipe(process.stderr);
    stderr.on('data', (data: Uint8Array) => {
      const parsed = parseCloneMessage(data.toString());

      if (parsed) {
        switch (parsed.type) {
          case 'dir':
            dir = parsed.result;
            break;
          case 'receiving':
            if (onReceiving) onReceiving(parseInt(parsed.result));
        }
      }
    });
  })
    .clone(url, name, ['--progress', '--verbose']);

  return dir;
};

export const remoteDiff = async(project: string) => {
  const dir = path.resolve(gitPath, project);
  const status = await git(dir)
    .raw(['rev-list', '--left-right', '--count', 'origin/master...master']);

  const [, behind, ahead] = /^(\d+)\s+(\d+)$/.exec(status.trim());
  return {behind: parseInt(behind), ahead: parseInt(ahead)};
};

