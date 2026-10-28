import test from 'node:test';
import assert from 'node:assert/strict';
import windows from '../desktop/progress-window.cjs';
test('opening a minimized transfer restores it before showing and focusing',()=>{
  const calls=[];
  const window={isDestroyed:()=>false,isMinimized:()=>true,restore:()=>calls.push('restore'),show:()=>calls.push('show'),focus:()=>calls.push('focus')};
  windows.showProgress(window);assert.deepEqual(calls,['restore','show','focus']);
});
test('cancel closes progress, but completion keeps its completion actions visible',()=>{
  let closed=0;const window={isDestroyed:()=>false,close:()=>closed++};
  assert.equal(windows.closeCancelledProgress(window,{status:'complete'}),false);
  assert.equal(windows.closeCancelledProgress(window,{status:'downloading'}),false);
  assert.equal(windows.closeCancelledProgress(window,{status:'cancelled'}),true);
  assert.equal(closed,1);
});

test('download progress dialog defaults to compact with hidden connection details and no vertical scrolling', async () => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const html = await fs.readFile(path.join(process.cwd(), 'renderer', 'index.html'), 'utf8');
  const css = await fs.readFile(path.join(process.cwd(), 'renderer', 'styles.css'), 'utf8');

  // Verify connection details is hidden by default
  assert.match(html, /id="connection-details"\s+hidden/);
  // Verify toggle button starts as "Show Details"
  assert.match(html, /id="toggle-details"[^>]*>Show Details<\/button>/);
  // Verify vertical scrolling is removed on progress dialog body
  assert.match(css, /body\.progress-window\s+\.dialog-body\s*\{[^}]*overflow-y:\s*hidden\s*!important/);
});
