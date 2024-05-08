import { existsSync, mkdirSync, rmdirSync, copyFileSync, readdirSync, unlinkSync } from 'fs';

const target = process.argv[2];

const red = '\x1b[31m';
const green = '\x1b[32m';
const os = process.platform;
const root = './test/e2e/';
const snapshot = 'snapshot-test/';
const boundary = 'boundary/';

switch(target) {
    case 'snapshot':
        const backupDir = root + snapshot + os + '-snapshot-backup/';
        const snapshotsDir = root + snapshot + 'snapshotTest.spec.js-snapshots/';

        if (!existsSync(snapshotsDir)) {
            console.log(`${red}백업할 스냅샷이 없습니다.`);
            process.exit();
        }

        if (existsSync(backupDir)) {
            rmdirSync(backupDir, { recursive: true });
            console.log(`${red}기존 백업 폴더를 삭제 했습니다.`);
        }

        mkdirSync(backupDir, { recursive: true }); // 백업 폴더 생성

        if (existsSync(snapshotsDir)) {
            const snapshots = readdirSync(snapshotsDir).filter(fileName => fileName.includes(os + '.png'));
            snapshots.forEach((snapshot) => {
                copyFileSync(snapshotsDir + snapshot, backupDir + snapshot);
                unlinkSync(snapshotsDir + snapshot);
            })
            console.log(`${green}${snapshots.length}개의 스냅샷을 백업 폴더에 저장했습니다.`);
        }
        break;
    case 'boundary':
        const dirs = readdirSync(root + boundary);
        dirs.forEach((dir) => {
            if (dir.endsWith('-snapshots')) {
                const snapshotsDir = root + boundary + dir + '/'
                const backupDir = root + boundary + `${os}-${dir}-backup/`;
                if (existsSync(backupDir)) {
                    rmdirSync(backupDir, { recursive: true });
                }
                if (existsSync(snapshotsDir)) {
                    mkdirSync(backupDir, { recursive: true });
                    const snapshots = readdirSync(snapshotsDir).filter(fileName => fileName.includes(os + '.png'));
                    snapshots.forEach((snapshot) => {
                        copyFileSync(snapshotsDir + snapshot, backupDir + snapshot);
                        unlinkSync(snapshotsDir + snapshot);
                    });
                };
            } else if (!dir.includes('.')) {
                // console.log(dir);
                const searchPath = root + boundary + dir + '/';
                const targetDirs = readdirSync(searchPath).filter(fileName => fileName.endsWith('-snapshots'));
                targetDirs.forEach((targetDir) => {
                    const snapshotsDir = searchPath + targetDir + '/';
                    const backupDir = searchPath + `${os}-${targetDir}-backup/`;
                    if (existsSync(backupDir)) {
                        rmdirSync(backupDir, { recursive: true });
                    }
                    if (existsSync(snapshotsDir)) {
                        mkdirSync(backupDir, { recursive: true });
                        const snapshots = readdirSync(snapshotsDir).filter(fileName => fileName.includes(os + '.png'));  
                        snapshots.forEach((snapshot) => {
                            copyFileSync(snapshotsDir + snapshot, backupDir + snapshot);
                            unlinkSync(snapshotsDir + snapshot);
                        });
                    }
                });
            }
        })
        break;
    default:
        break;
}

process.exit();
