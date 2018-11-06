import { TreeViewModule } from './tree-view.module';

describe('TreeViewModule', () => {
  let treeViewModule: TreeViewModule;

  beforeEach(() => {
    treeViewModule = new TreeViewModule();
  });

  it('should create an instance', () => {
    expect(treeViewModule).toBeTruthy();
  });
});
