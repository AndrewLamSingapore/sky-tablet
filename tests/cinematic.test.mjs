import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as THREE from 'three';

// Execute the shipped scene and camera code with real Three.js math/geometry.
// Only DOM and GPU presentation are substituted; this is not a WebGL render test.
function experience() {
  const html = readFileSync(new URL('../experience.html', import.meta.url), 'utf8');
  let source = html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
  source = source.replace(/let THREE;try\{THREE=await import[^\n]+\n/, '');
  const elements = new Map(), events = {};
  const context = new Proxy({}, { get: (_, key) => key === 'createLinearGradient' ? () => ({ addColorStop() {} }) : () => {} });
  const element = () => ({ style: {}, dataset: {}, clientWidth: 1280, clientHeight: 800, prepend() {}, setAttribute() {}, focus() {}, setPointerCapture() {}, getContext: () => context });
  const document = { hidden: false, querySelector(selector) { if (!elements.has(selector)) elements.set(selector, element()); return elements.get(selector); }, querySelectorAll: () => [], createElement: element, addEventListener: (name, fn) => events[name] = fn };
  class Renderer {
    domElement = element(); shadowMap = {}; capabilities = { getMaxAnisotropy: () => 8 };
    setSize() {} setPixelRatio() {} render() {}
  }
  class Loader { load() { return new THREE.Texture(); } }
  const api = new Function('THREE', 'document', 'addEventListener', 'requestAnimationFrame', 'performance', 'devicePixelRatio', source + '\nreturn {camera,scene,shots,home,startTour,tour,freeMode,roam,loop,keys, get elapsed(){return tourElapsed}, get state(){return state}};')(
    { ...THREE, WebGLRenderer: Renderer, TextureLoader: Loader }, document,
    (name, fn) => events[name] = fn, () => {}, { now: () => 0 }, 1
  );
  return { ...api, api, document, elements, events };
}
const world = experience();

test('free exploration preserves the direction of every cinematic shot', () => {
  let time = 0;
  for (const shot of world.shots) {
    world.startTour();world.tour(time + shot.d / 2);
    const before = world.camera.getWorldDirection(new THREE.Vector3());
    const position = world.camera.position.clone();
    world.freeMode();world.roam(1/60);
    assert.ok(before.distanceTo(world.camera.getWorldDirection(new THREE.Vector3())) < 1e-8);
    assert.ok(position.distanceTo(world.camera.position) < 1e-8);
    time += shot.d;
  }
});

test('tour clock pauses while hidden and bounds a delayed frame on resume', () => {
  world.startTour();world.loop(10);const before = world.api.elapsed;
  world.document.hidden = true;world.events.visibilitychange();world.loop(600000);
  assert.equal(world.api.elapsed,before);
  world.document.hidden = false;world.events.visibilitychange();world.loop(600016);
  assert.ok(world.api.elapsed - before <= .041);
});

test('free movement speed is independent of refresh rate', () => {
  function travel(fps) {world.home();world.freeMode();world.keys.w = 1;for(let i=0;i<fps;i++)world.roam(1/fps);return world.camera.position.clone();}
  assert.ok(travel(30).distanceTo(travel(120)) < 1e-8);
});

test('blur and mode switches release movement input; replay resets framing', () => {
  world.keys.w = 1;world.events.blur();assert.equal(world.keys.w,undefined);
  world.keys.w = 1;world.startTour();assert.equal(world.keys.w,undefined);
  assert.deepEqual(world.camera.position.toArray(),world.shots[0].p);
});

test('the threshold camera path does not intersect a solid gate or door', () => {
  world.scene.updateMatrixWorld(true);
  const gateway=[];const boxes=[];
  world.scene.traverse(mesh=>{if(!mesh.isMesh||!mesh.material?.isMeshStandardMaterial)return;gateway.push(mesh);if(mesh.geometry.type!=='BoxGeometry')return;mesh.geometry.computeBoundingBox();if(mesh.isInstancedMesh){for(let i=0;i<mesh.count;i++){const matrix=new THREE.Matrix4();mesh.getMatrixAt(i,matrix);boxes.push(mesh.geometry.boundingBox.clone().applyMatrix4(matrix.premultiply(mesh.matrixWorld)))}}else boxes.push(new THREE.Box3().setFromObject(mesh));});
  const start=world.shots.slice(0,3).reduce((sum,shot)=>sum+shot.d,0);
  for(let u=0;u<=1;u+=.01){world.tour(start+u*world.shots[3].d);for(const bounds of boxes)assert.ok(!bounds.containsPoint(world.camera.position),`camera inside solid geometry at ${u}`);}
  const ray=new THREE.Raycaster(new THREE.Vector3(0,5,12),new THREE.Vector3(0,0,-1),0,24);
  assert.equal(ray.intersectObjects(gateway,false).length,0,'gate has an open passage');
});

test('tour stays finite and continuous across shot boundaries', () => {
  let time=0;
  for(const shot of world.shots.slice(0,-1)){
    time+=shot.d;world.tour(time-.0001);const p=world.camera.position.clone(),q=world.camera.quaternion.clone();world.tour(time+.0001);
    assert.ok(p.distanceTo(world.camera.position)<.01);
    assert.ok(q.angleTo(world.camera.quaternion)<.01);
    assert.ok(world.camera.position.toArray().every(Number.isFinite));
  }
});

test('tablet dismissal remains dismissed without moving the tour clock', () => {
  world.startTour();world.tour(31.8);world.elements.get('#closeTablet').onclick();
  const before=world.api.elapsed;world.tour(31.9);
  assert.equal(world.elements.get('#tabletCard').style.display,'none');assert.equal(world.api.elapsed,before);
});

test('end of journey offers a conversation and pauses free movement while reading', () => {
  world.startTour();world.tour(60);
  assert.equal(world.api.state,'free');assert.equal(world.elements.get('#connectPanel').hidden,false);
  const p=world.camera.position.clone();world.keys.w=1;world.loop(100000);
  assert.ok(p.distanceTo(world.camera.position)<1e-8);
  world.elements.get('#closeConnect').onclick();assert.equal(world.elements.get('#connectPanel').hidden,true);
});

test('portrait framing preserves a usable horizontal view', () => {
  world.elements.get('#world').clientWidth=390;world.elements.get('#world').clientHeight=844;
  world.events.resize();world.home();
  const horizontal=2*Math.atan(Math.tan(THREE.MathUtils.degToRad(world.camera.fov)/2)*world.camera.aspect);
  assert.ok(horizontal>=THREE.MathUtils.degToRad(39.9));
});
