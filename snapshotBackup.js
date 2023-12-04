import { existsSync, mkdirSync, rmdirSync, copyFileSync, readdirSync } from 'fs';

const root = './test/e2e/snapshot-test/';

(async () => {
    const backupDir = root + 'snapshot-backup/';
    const snapshotsDir = root + 'snapshotTest.spec.js-snapshots/';

    if (!existsSync(snapshotsDir)) {
        console.log(`백업할 스냅샷이 없습니다.`);
        process.exit();
    }

    if (existsSync(backupDir)) {
        rmdirSync(backupDir, { recursive: true });
        console.log(`기존 백업 폴더를 삭제 했습니다.`);
    }

    mkdirSync(backupDir, { recursive: true }); // 백업 폴더 생성

    if (existsSync(snapshotsDir)) {
        const snapshots = readdirSync(snapshotsDir);
        snapshots.forEach((snapshot) => {
            copyFileSync(snapshotsDir + snapshot, backupDir + snapshot);
        })
        console.log(`${snapshots.length}개의 스냅샷을 백업 폴더에 저장했습니다.`);

        rmdirSync(snapshotsDir, { recursive: true });
        console.log(`기존 스냅샷을 삭제 했습니다.`);
    }

    process.exit();
})();
