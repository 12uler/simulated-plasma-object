//Setup
const scene = new THREE.Scene();

const url = "https://assets.codepen.io/4332848/blueSwirl.png";

const molecules = [];

var colors = [0x7dff00, 0x4287f5, 0x1d2ba3, 0xf5426c, 0xf59e42, 0x03fc03];

//Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = -25;

//Renderer
const canvas = document.getElementById("canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Lighting
const ambientLight = new THREE.AmbientLight(0xd1d1b6, 1.5);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.BasicShadowMap;
ambientLight.castShadows = true;
scene.add(ambientLight);

const particleLight = new THREE.Mesh(
new THREE.SphereBufferGeometry( 0.001, 16, 16 ),
new THREE.MeshBasicMaterial( { color: 0xffffff } ));
scene.add( particleLight );

particleLight.add( new THREE.PointLight( 0xffffff, 2, 300, 2 ) );

//Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = false;
controls.update();

//Textures
//const urlTexture = new THREE.TextureLoader().load(url);
const moleculeTexture = new THREE.MeshPhongMaterial({
    //map: urlTexture,
    color: colors[5],
    opacity: 0.9,
    transparent: false
  }),
  altTexture = new THREE.MeshPhongMaterial({
    opacity: 0.25,
    transparent: true
  });

//Geometries
const torusGeo = new THREE.TorusGeometry(10, 3, 16, 100, 16),
  moleculeGeo = new THREE.SphereGeometry(0.1, 32, 32),
  outerRing = new THREE.Mesh(torusGeo, altTexture);
  scene.add(outerRing);

//Load molecules
for (let i = 0; i < 200; i++) {
  const mesh = new THREE.Mesh(moleculeGeo, moleculeTexture);
			mesh.position.x = Math.random() * 10 - 5;
			mesh.position.y = Math.random() * 10 - 5;
			mesh.position.z = Math.random() * 10 - 5;
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.sin(3.14) + Math.sin(3.14) * 3 + 1;
  mesh.scale.x = Math.sin(3.14) * 1.8;
  mesh.scale.y = Math.cos(3.14) * 1.8;
  scene.add(mesh);
  molecules.push(mesh);
}

//resize 
function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize( width, height );
}

//Animation updater
var counter = 0;
function animate() {
  const time = 0.00058 * Date.now();
  for (let i = 0, length = molecules.length; i < length; i++) {
    counter += Math.sin(time);
    const molecule = molecules[i];
    var a = Math.sin(time) +3;
    var b = Math.PI * Math.cos(time) +3;
    var c = Math.sin(time + i * 0.8);
    var d = Math.PI * Math.tan(Math.sin(a) / Math.sin(b));
    molecule.position.x = Math.PI * Math.cos( time + a+i * c);
	  molecule.position.y = Math.PI * Math.sin( time + a+i * c );
    molecule.position.z = c * Math.sin( time + b+i * d );
  molecule.rotation.y = Math.cos(counter);
  }
  let red =  Math.floor(Math.abs(a)*5)+100,
      green = Math.floor(Math.abs(b)*5)+ 50,
      blue = Math.floor(Math.abs(a)*100)+Math.floor(Math.abs(d*0.018));
  
  let e = `rgb(${red},${green},${blue})`;
  outerRing.geometry =  new THREE.TorusBufferGeometry(b, a, 32, 100);
  outerRing.material = new THREE.MeshPhongMaterial({
    color: e,
    opacity: 0.4,
    transparent: true
  });
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
};

animate();
