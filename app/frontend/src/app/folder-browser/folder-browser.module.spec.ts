import { FolderBrowserModule } from './folder-browser.module';

describe('FolderBrowserModule', () => {
  let folderBrowserModule: FolderBrowserModule;

  beforeEach(() => {
    folderBrowserModule = new FolderBrowserModule();
  });

  it('should create an instance', () => {
    expect(folderBrowserModule).toBeTruthy();
  });
});
