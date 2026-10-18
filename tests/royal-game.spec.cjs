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
  await expect(page.locator('#humanScore')).toHaveText('0/5');
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
