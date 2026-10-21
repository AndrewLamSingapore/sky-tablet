const {test,expect}=require('@playwright/test');
test('malformed note fragments recover to the list and allow normal navigation',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/notes.html#%');
  await expect(page.getByRole('heading',{name:'Notes from the build'})).toBeVisible();
  await page.locator('#cards a').first().click();
  await expect(page.locator('#article-body h1')).toBeVisible();
  await page.getByRole('button',{name:'Back to notes'}).click();
  await expect(page.getByRole('heading',{name:'Notes from the build'})).toBeVisible();
  expect(errors).toEqual([]);
});
test('public notes and learning pages work without a 3D scene',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/notes.html?from=tablet#001');
  await expect(page.locator('#article-body h1')).toBeVisible();
  await expect(page.locator('#return-to-scene')).toHaveAttribute('href','/?scene=tablet');
  await page.goto('/interpretation-lens.html');
  await page.getByRole('link',{name:'Read the mathematics article →'}).click();
  await expect(page.locator('h1')).toContainText('Base-60');
  await page.getByRole('link',{name:'Sources',exact:true}).click();
  await expect(page.locator('h1')).toHaveText('Historical source library');
  expect(errors).toEqual([]);
});
test('GPU scene loads locally served Three.js and tablet navigation remains usable',async({page,browserName})=>{
  test.skip(browserName!=='chromium','GPU rendering exercised in Chromium; mobile WebKit covers learning and game journeys.');
  const errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('request',r=>{if(r.url().includes('jsdelivr'))external.push(r.url())});
  await page.goto('/?scene=tablet');
  const scene=page.frameLocator('#experience');
  await expect(scene.locator('#world canvas').first()).toBeVisible({timeout:45000});
  await expect(scene.locator('#mode')).toHaveText('TABLET ENCOUNTER');
  await scene.locator('#stoneHint').click();
  await expect(scene.getByRole('dialog')).toBeVisible();
  await scene.getByRole('link',{name:'Play the Royal Game of Ur ↗'}).click();
  await expect(page.locator('h1')).toHaveText('The Royal Game of Ur');
  await page.getByRole('link',{name:'← Return to Sky Tablet'}).click();
  await expect(page.frameLocator('#experience').locator('#mode')).toHaveText('TABLET ENCOUNTER',{timeout:45000});
  expect(external).toEqual([]);expect(errors).toEqual([]);
});
