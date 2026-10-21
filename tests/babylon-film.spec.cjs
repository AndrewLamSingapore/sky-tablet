const {test,expect}=require('@playwright/test');
test('Babylon previews stay opt-in, readable and return to the journey',async({page})=>{
 await page.goto('/babylon-film.html');
 await expect(page.getByRole('heading',{name:'Babylon, imagined in motion.'})).toBeVisible();
 await expect(page.getByRole('link',{name:'← Return to the interactive Sky Tablet'})).toHaveAttribute('href','/');
 const videos=page.locator('video');
 expect(await videos.count()).toBeGreaterThan(0);
 for(const video of await videos.all()){
  await expect(video).toHaveAttribute('preload','none');
  expect(await video.getAttribute('autoplay')).toBeNull();
  expect(await video.evaluate(v=>v.paused)).toBe(true);
 }
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
test('a failed video offers a return and playing another pauses its peer',async({page})=>{
 await page.goto('/babylon-film.html');
 await page.locator('video source').first().dispatchEvent('error');
 await expect(page.getByRole('status').first()).toBeVisible();
 const count=await page.locator('video').count();
 if(count>1){
  const paused=await page.evaluate(()=>{const videos=[...document.querySelectorAll('video')];let called=false;videos[0].pause=()=>{called=true};videos[1].dispatchEvent(new Event('play'));return called});
  expect(paused).toBe(true);
 }
});

test('archived local preview decodes, plays and seeks',async({page})=>{
 await page.goto('/babylon-film.html');
 const video=page.locator('video').first();
 await video.evaluate(async clip=>{clip.muted=true;await clip.play()});
 await expect.poll(()=>video.evaluate(clip=>clip.currentTime)).toBeGreaterThan(0);
 await video.evaluate(clip=>{clip.pause();clip.currentTime=Math.min(2,clip.duration/2)});
 await expect.poll(()=>video.evaluate(clip=>clip.readyState)).toBeGreaterThanOrEqual(2);
 expect(await video.evaluate(clip=>clip.error?.message||null)).toBeNull();
 expect(await video.evaluate(clip=>clip.currentTime)).toBeGreaterThan(0);
 await expect(video.locator('source')).toHaveAttribute('src','/assets/films/ishtar-gate.mp4');
});
