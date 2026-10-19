const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const site = process.env.SKY_BASE_URL || 'http://127.0.0.1:8765';
const gameUrl = site + '/royal-game-of-ur.html';
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
  await page.evaluate(()=>{Math.random=()=>0.99});
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
    return {ready: true};
  });
  expect(result.error).toBeUndefined();
  await page.locator('#hint').click();
  await expect(page.locator('#status')).toContainText('Bear off a piece');
  await page.getByRole('button',{name:'Bear off a piece'}).click();
  await expect(page.locator('#humanScore')).toHaveText('7/7');
  await expect(page.locator('#bearOff')).toBeHidden();
  await expect(page.locator('#roll')).toBeDisabled();
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

test('zero roll skips turn and AI completes its turn without a JS exception',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(gameUrl);
 await page.evaluate(()=>{Math.random=()=>0.1});
 await page.locator('#roll').click();
 await expect(page.locator('#board .piece')).toHaveCount(0);
 await expect(page.locator('#roll')).toBeEnabled();
 expect(errors).toEqual([]);
});
test('iPhone-sized touch input, scroll and article navigation',async({page,browserName})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto(gameUrl);
 await page.evaluate(()=>{Math.random=()=>0.99});
 if(browserName==='webkit') await page.locator('#roll').tap(); else await page.locator('#roll').click();
 await expect(page.locator('#board .cell.legal').first()).toBeVisible();
 if(browserName==='webkit') await page.locator('#board .cell.legal').first().tap(); else await page.locator('#board .cell.legal').first().click();
 await expect(page.locator('#board .piece.human')).toHaveCount(1);
 await page.getByRole('heading',{name:'Further reading and attribution'}).scrollIntoViewIfNeeded();
 await expect(page.getByRole('heading',{name:'Further reading and attribution'})).toBeVisible();
 await expect(page.getByRole('link',{name:/base-60 mathematics/i}).first()).toHaveAttribute('href','/base-60.html');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 expect(overflow).toBeLessThanOrEqual(0);
});

test('Interpretation Lens hub and source registry link all learning modules',async({page})=>{
 await page.goto(site + '/interpretation-lens.html');
 await expect(page.getByRole('heading',{name:'Interpretation Lens'})).toBeVisible();
 await expect(page.getByRole('link',{name:/Play and learn/})).toHaveAttribute('href','/royal-game-of-ur.html');
 await expect(page.getByRole('link',{name:/Examine the evidence/})).toHaveAttribute('href','/sources.html');
 await page.getByLabel('I can explain a base-60 place value.').check();
 await expect(page.locator('#progress')).toHaveText('1 of 4 stages completed.');
 await page.reload();
 await expect(page.getByLabel('I can explain a base-60 place value.')).toBeChecked();
 await page.getByRole('button',{name:'Reset my checklist'}).click();
 await expect(page.locator('#progress')).toHaveText('0 of 4 stages completed.');
 await page.goto(site + '/sources.html');
 await expect(page.getByRole('heading',{name:'Historical source library'})).toBeVisible();
});
test('optional game hint never automatically moves a piece',async({page})=>{
 await page.goto(gameUrl);
 await page.evaluate(()=>{Math.random=()=>0.99});
 await expect(page.locator('#hint')).toBeDisabled();
 await page.locator('#roll').click();
 await page.locator('#hint').click();
 await expect(page.locator('#status')).toContainText('Hint:');
 await expect(page.locator('#board .piece')).toHaveCount(0);
});


test('seven pieces finish through visible controls from a fresh game', async ({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(gameUrl);
  for(let moves=0;moves<105;moves++) {
    // Ivory rolls one; Indigo rolls zero. No game state or move function is patched.
    await page.evaluate(()=>{let calls=0;Math.random=()=>++calls===1?0.99:0.1});
    await page.locator('#roll').click();
    if(await page.locator('#bearOff').isVisible()) await page.locator('#bearOff').click();
    else await page.locator('#board .cell.legal').first().click();
    if(await page.locator('#humanScore').textContent()==='7/7')break;
    await expect(page.locator('#roll')).toBeEnabled();
  }
  await expect(page.locator('#humanScore')).toHaveText('7/7');
  await expect(page.locator('#status')).toContainText('Ivory wins');
  await expect(page.locator('#roll')).toBeDisabled();
  await page.locator('#restart').click();
  await expect(page.locator('#humanScore')).toHaveText('0/7');
  await expect(page.locator('#roll')).toBeEnabled();
  expect(errors).toEqual([]);
});
