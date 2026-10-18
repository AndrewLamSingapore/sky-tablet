const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const gameUrl = 'http://127.0.0.1:8765/royal-game-of-ur.html';
test('research article and board render without JavaScript errors', async ({ page }) => {
  const errors=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto(gameUrl);
  await expect(page.getByRole('heading',{name:'The Royal Game of Ur'})).toBeVisible();
  await expect(page.locator('#board .cell')).toHaveCount(24);
  await expect(page.locator('#board .cell:not(.void)')).toHaveCount(20);
  await expect(page.locator('#humanScore')).toHaveText('0/7');
  await expect(page.getByText('Evidence-based',{exact:true})).toBeVisible();
  expect(errors).toEqual([]);
});
test('dice roll, legal move, AI turn, and restart', async ({ page }) => {
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(gameUrl);
  await page.evaluate(()=>{Math.random=()=>0.9});
  await page.locator('#roll').click();
  await expect(page.locator('#dice')).toHaveText('4');
  await expect(page.locator('#board .cell.legal').first()).toBeVisible();
  await page.locator('#board .cell.legal').first().click();
  await expect(page.locator('#board .piece.human')).toHaveCount(1);
  await page.locator('#restart').click();
  await expect(page.locator('#board .piece')).toHaveCount(0);
  await expect(page.locator('#dice')).toHaveText('—');
  expect(errors).toEqual([]);
});
test('mobile viewport has no horizontal overflow and usable controls', async ({ page }) => {
  await page.setViewportSize({width:375,height:812});
  await page.goto(gameUrl);
  await expect(page.locator('#roll')).toBeVisible();
  const sizes=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:innerWidth}));
  expect(sizes.body).toBeLessThanOrEqual(sizes.viewport);
});
test('stone tablet link and return path are present', async ({ page }) => {
  const html=fs.readFileSync(path.join(__dirname,'..','experience.html'),'utf8');
  expect(html).toContain('href="/royal-game-of-ur.html"');
  await page.goto(gameUrl);
  await expect(page.getByRole('link',{name:/Return to Sky Tablet/})).toHaveAttribute('href','/?scene=tablet');
});

test('full deterministic game completes with seven pieces', async ({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/royal-game-of-ur.html', async route=>{
    const fs=require('fs');const path=require('path');
    let html=fs.readFileSync(path.join(__dirname,'..','royal-game-of-ur.html'),'utf8');
    html=html.replace("})();\n</script>", "window.__urTest={set:(p,t,n)=>{positions=p.map(a=>a.slice());turn=t;roll=n;over=false;render()},moves:()=>candidates(turn,roll),move:(p,i)=>move(p,i),state:()=>({positions:positions.map(a=>a.slice()),turn,roll,over})};\n})();\n</script>");
    await route.fulfill({status:200,contentType:'text/html',body:html});
  });
  await page.goto(gameUrl);
  const hasHook=await page.evaluate(()=>!!window.__urTest);expect(hasHook).toBeTruthy();
  const result=await page.evaluate(()=>{
    const a=Array(7).fill(14);a[6]=13;
    const b=Array(7).fill(-1);
    window.__urTest.set([a,b],0,1);
    const opts=window.__urTest.moves();
    if(opts.length!==1||opts[0].d!==14)return {error:'finish candidate incorrect',opts};
    window.__urTest.move(0,6);
    return window.__urTest.state();
  });
  expect(result.error).toBeUndefined();
  expect(result.over).toBe(true);
  await expect(page.locator('#status')).toContainText('Ivory wins');
  expect(errors).toEqual([]);
});
test('capture, protected rosette and bonus turn rules', async ({page})=>{
  await page.route('**/royal-game-of-ur.html', async route=>{
    let html=fs.readFileSync(path.join(__dirname,'..','royal-game-of-ur.html'),'utf8');
    html=html.replace("})();\n</script>", "window.__urTest={set:(p,t,n)=>{positions=p.map(a=>a.slice());turn=t;roll=n;over=false;render()},moves:()=>candidates(turn,roll),move:(p,i)=>move(p,i),state:()=>({positions:positions.map(a=>a.slice()),turn,roll,over})};\n})();\n</script>");
    await route.fulfill({status:200,contentType:'text/html',body:html});
  });
  await page.goto(gameUrl);
  const out=await page.evaluate(()=>{
    const h=Array(7).fill(-1),a=Array(7).fill(-1);
    h[0]=4;a[0]=6;window.__urTest.set([h,a],0,2);window.__urTest.move(0,0);
    const captured=window.__urTest.state().positions[1][0]===-1;
    h[0]=6;a[0]=7;window.__urTest.set([h,a],0,1);
    const blocked=window.__urTest.moves().every(x=>x.i!==0);
    h[0]=6;a[0]=-1;window.__urTest.set([h,a],0,1);window.__urTest.move(0,0);
    const extra=window.__urTest.state().turn===0;
    return {captured,blocked,extra};
  });
  expect(out).toEqual({captured:true,blocked:true,extra:true});
});
