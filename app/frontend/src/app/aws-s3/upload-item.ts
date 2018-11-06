
export class UploadItem {
    originalName = "";
    newName = "";
    path = "";
    constructor(file: any) {
      this.newName = file.name;
      this.originalName = file.name;
      this.path = file.path;
    }
  }
  