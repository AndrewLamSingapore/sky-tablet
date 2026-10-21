const {test,expect}=require('@playwright/test');

async function isolate(page) {
  const origin=new URL(process.env.SKY_BASE_URL||'http://127.0.0.1:8765').origin;
  const external=[];
  await page.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.origin!==origin){external.push(url.origin);return route.abort()}
    if(url.pathname.startsWith('/api/'))return route.abort();
    return route.continue();
  });
  return external;
}

test('learning, saved checklist and game remain usable with optional integrations unavailable',async({page})=>{
  const external=await isolate(page),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/interpretation-lens.html');
  await page.getByLabel('I can explain a base-60 place value.').check();
  await page.reload();
  await expect(page.getByLabel('I can explain a base-60 place value.')).toBeChecked();
  await page.getByRole('link',{name:/Play and learn/}).click();
  await expect(page.getByRole('heading',{name:'The Royal Game of Ur'})).toBeVisible();
  await page.evaluate(()=>{Math.random=()=>0.99});
  await page.locator('#roll').click();
  await page.locator('#board .cell.legal').first().click();
  await expect(page.locator('#board .piece.human')).toHaveCount(1);
  await page.getByRole('link',{name:'Base-60 mathematics',exact:true}).click();
  await expect(page.locator('h1')).toContainText('Base-60');
  await page.getByRole('link',{name:'Sources',exact:true}).click();
  await expect(page.locator('h1')).toHaveText('Historical source library');
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});

test('local 3D tablet and public notes survive unavailable signup and sovereign peers',async({page,browserName},testInfo)=>{
  test.skip(browserName!=='chromium','3D GPU path is covered in Chromium; this does not certify a physical iPhone.');
  const external=await isolate(page),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/?scene=tablet');
  const scene=page.frameLocator('#experience');
  await expect(scene.locator('#mode')).toHaveText('TABLET ENCOUNTER',{timeout:45000});
  await expect(scene.locator('#world canvas').first()).toBeVisible();
  const screenshot=testInfo.outputPath('independent-tablet.png');
  await page.screenshot({path:screenshot});
  await testInfo.attach('Independent tablet rendering',{path:screenshot,contentType:'image/png'});
  await scene.locator('#stoneHint').click();
  await expect(scene.locator('#evidenceStatus')).toHaveText('Email updates are temporarily unavailable. All build notes remain public.');
  await expect(scene.locator('#evidenceSignupWrap')).toBeHidden();
  await scene.getByRole('link',{name:'Read the full build note →'}).click();
  await expect(page.locator('#article-body h1')).toBeVisible();
  expect(external).toEqual([]);
  expect(errors).toEqual([]);
});
