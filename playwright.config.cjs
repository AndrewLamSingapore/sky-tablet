const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
  testDir:'./tests',testMatch:'**/*.spec.cjs',timeout:60000,retries:process.env.CI?1:0,
  use:{screenshot:'only-on-failure',trace:'retain-on-failure',baseURL:process.env.SKY_BASE_URL||'http://127.0.0.1:8765'},
  webServer:process.env.SKY_BASE_URL?undefined:{command:'npm run serve',url:'http://127.0.0.1:8765',reuseExistingServer:!process.env.CI,timeout:30000},
  projects:[{name:'desktop-chromium',use:{browserName:'chromium',viewport:{width:1280,height:800},launchOptions:{args:['--enable-unsafe-swiftshader']}}},{name:'iphone-webkit',use:{...devices['iPhone 13'],browserName:'webkit'}}]
});
