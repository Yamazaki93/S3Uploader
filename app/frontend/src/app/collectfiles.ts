import { UploadItem } from "./aws-s3/upload-item";

export function collectFiles(item, path, items: UploadItem[]): Promise<UploadItem[]> {
    path = path || "";
    if (item.isFile) {
        let p = new Promise<UploadItem[]>((resolve, reject) => {
            item.file(function (file) {
                let item = {
                    name: path + file.name,
                    path: file.path
                }
                resolve([new UploadItem(item)]);
            });
        });
        return p;
    } else if (item.isDirectory) {
        var dirReader = item.createReader();
        let p = new Promise<UploadItem[]>((resolve, reject) => {
            let promises = [];
            dirReader.readEntries(function (entries) {
                for (var i = 0; i < entries.length; i++) {
                    promises.push(collectFiles(entries[i], path + item.name + "/", items));
                }
                Promise.all(promises).then(results => {
                    results.forEach(r => {
                        items = items.concat(r);
                    });
                    resolve(items);
                });
            });
        });
        return p;
    } else {
        return Promise.reject("Not a file or directory");
    }
}