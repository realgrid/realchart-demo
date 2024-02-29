import { existsSync, mkdirSync, rmdirSync, copyFileSync, readdirSync, unlinkSync } from 'fs';

const red = '\x1b[31m';
const green = '\x1b[32m';
const os = process.platform;
const root = './test/e2e/snapshot-test/';
(async () => {
    const backupDir = root + os + '-snapshot-backup/';
    const snapshotsDir = root + 'snapshotTest.spec.js-snapshots/';

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

    process.exit();
})();
