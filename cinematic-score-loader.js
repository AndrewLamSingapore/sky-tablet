// Attach the cinematic score without modifying the 3D scene implementation.
import './cinematic-score.js';
const start=document.querySelector('#start'),free=document.querySelector('#free'),home=document.querySelector('#home');
start?.addEventListener('click',()=>window.SkyTabletScore?.start(),{capture:true});
free?.addEventListener('click',()=>window.SkyTabletScore?.stop());
home?.addEventListener('click',()=>window.SkyTabletScore?.stop());
