import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {FirstPersonControls} from 'three/addons/controls/FirstPersonControls.js';
import { FontLoader } from 'https://unpkg.com/three@0.138.3/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.138.3/examples/jsm/geometries/TextGeometry.js';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getDatabase, ref, onValue} from "https://www.gstatic.com/firebasejs/9.20.0/firebase-database.js";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHxvcBPO1-XmVm8JxOFghe5BAIZqU_Oxc",
  authDomain: "plantar-22f2c.firebaseapp.com",
  databaseURL: "https://plantar-22f2c-default-rtdb.firebaseio.com",
  projectId: "plantar-22f2c",
  storageBucket: "plantar-22f2c.appspot.com",
  messagingSenderId: "220359011124",
  appId: "1:220359011124:web:ae10179eee5858c85d5361",
  measurementId: "G-M5EMC79RDC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

let camera, scene, renderer, light;

//control
let controls, //firstPerson
	control; //orbitConrol

//plane
let geometry, texture, backTexture, material, mesh ;

let placeWidth, placeHeight;



let clock;

let video, backvideo;
var videos = [];
let currentVideoIndex = 0;

let time = 0;

let cellCount, layerCount;

var layers=[];

let planeGeometry, planeMesh, planeMaterial;

let cellText, layerText;

let canvas, context, text;
let canvasDef, contextDef, textDef;
let cellDef1, cellDef2;
let cTexture, cGeometry, cMesh, cMaterial;

let hideText;

// let textMesh, textMaterial, textGeometry;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

init();
animate();
GetDataLayer();
GetDataCell();

//console.log(GetDataCell())

function init() {
	clock = new THREE.Clock();

	cellDef1 = "Stem cells are special cells in plants that can grow into different parts of a plant.";
	cellDef2 = "They are like a blank sheet of paper that can be turned into any picture.";

	videos = [
		"p1.mp4",
		"p2.mp4",
		"p3.mp4",
		"p4.mp4",
	];

	camera = new THREE.PerspectiveCamera(
		60, 
		window.innerWidth / window.innerHeight, 
		1, 
		5000);
	
	camera.position.y = 1755;
	camera.position.z = 1742;
	camera.position.x = 1740;

	console.log(camera.position);

	backvideo = document.createElement('video');
	backvideo.src = videos[currentVideoIndex];

	backvideo.loop = true;
	backvideo.muted = true;
	backvideo.play();

	backTexture = new THREE.VideoTexture(backvideo);
	backTexture.needsUpdate = true;


	scene = new THREE.Scene();
	scene.background = backTexture;
	//scene.fog = new THREE.FogExp2(0xE9F1FF, 0.0007);

	renderer = new THREE.WebGLRenderer();

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	scene.add(light);
	
	//~~~~~~~~~~~~~~ Plane ~~~~~~~~~~~~~~

	placeWidth = 1200;
	placeHeight = 800;

	geometry = new THREE.PlaneGeometry(placeWidth, placeHeight);
	geometry.rotateX(-Math.PI/2);
	
	video = document.createElement('video');
	video.src = '/cell.webm';

	video.loop = true;
	video.muted = true;
	video.play();
	
	//load the texture -> a matarial
	texture = new THREE.VideoTexture(video);
	texture.format = THREE.RGBAFormat;
	texture.minFilter = THREE.LinearFilter;
	texture.magFilter = THREE.LinearFilter;
	texture.wrapS = THREE.ClampToEdgeWrapping;
	texture.wrapT = THREE.ClampToEdgeWrapping;
	texture.needsUpdate = true;

	// texture.wrapS = THREE.RepeatWrapping;
	// texture.wrapT = THREE.RepeatWrapping;
	// texture.repeat.set(10, 10);

	material = new THREE.MeshBasicMaterial({
		color: 0xC9DEFF,
		map: texture,
		transparent: true,
		toneMapped: false
		});
	material.needsUpdate = true;

	mesh = new THREE.Mesh(geometry, material);
	mesh.position.y-=400;
	// mesh.rotation.y = Math.random()*100;

	scene.add(mesh);
	
	// ~~~~~ first person control ~~~~~~
	controls = new FirstPersonControls(camera, renderer.domElement);
	//controls.movementSpeed = 500;
	controls.lookSpeed = 0.05;
	
	//~~~~~ orbitControl ~~~~~~
	control = new OrbitControls(camera, renderer.domElement);

	control.minDistance = 500;
	control.maxDistance = 3000;
	control.minPolarAngle = Math.PI / 6; // 45 degrees
	control.maxPolarAngle = Math.PI / 3; // 90 degrees

	//GeneratePlane();
	//DataCreate();
	//LoadLayer();
	setText();

	hideText = false;
}

function animate() {
	//GeneratePlane();
	//AnimatePlane();

	requestAnimationFrame(animate);

	if (video.readyState === video.HAVE_ENOUGH_DATA) {
		texture.needsUpdate = true;
	}
	render();
	DataUpdate();
	
	// Update the text
	updateText(cellText);

	//time += .1;
	//planeGeometry.dispose();
}

function render() {
	let delta = clock.getDelta();

	//first person
	controls.update(delta);
	
	//orbit
	control.update(delta);

	renderer.render(scene, camera);
}

function DataUpdate(){
	cellText = "Together, we've made " + cellCount +  " cells.";
	layerText = "Together, we've made " + layerCount + " layers.";

	console.log(cellText);

	GenerateLayer();
}

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function GetDataCell(){
	const cellCountRef = ref(database, 'Cell');
	onValue(cellCountRef, (snapshot) => {
		cellCount = snapshot.val();
		console.log(cellCount);
	});
}

function GetDataLayer(){
	const layerCountRef = ref(database, 'Layer');
	onValue(layerCountRef, (snapshot) => {
		layerCount= snapshot.val();
		console.log(layerCount);
	});
}

function GenerateLayer(){
	if(layers.length < layerCount){
		var geometry   = new THREE.SphereGeometry(10, 700, 700)
		var material = new THREE.MeshBasicMaterial({
			color: 0xffffff
		  });
		var sphere = new THREE.Mesh(geometry, material)

		sphere.position.x = Math.random() * 10000 - 5000;
		sphere.position.y = Math.random() * 10000 - 5000;
		sphere.position.z = Math.random() * 10000 - 5000;
		scene.add(sphere);
		layers.push(sphere);
		console.log(layers.length);
	}
}

document.addEventListener("click", changeBack);

function changeBack(){

	if((currentVideoIndex+1) % 2 == 0){
		hideText = true;
	}
	else{
		hideText = false;
	}

	console.log("click");
	currentVideoIndex = (currentVideoIndex + 1) % videos.length;
	backvideo = document.createElement('video');
	backvideo.src = videos[currentVideoIndex];

	backvideo.loop = true;
	backvideo.muted = true;
	backvideo.play();

	backTexture = new THREE.VideoTexture(backvideo);
	backTexture.needsUpdate = true;

	scene.background = backTexture;
}

setInterval(GenerateLayer, 20000);

function setText(){
	// Create a canvas element
	canvas = document.createElement("canvas");
	canvas.width = 700;
	canvas.height = 200;

	// Get the 2D context of the canvas
	context = canvas.getContext("2d");

	// Set the font and color of the text
	context.font = "48px Arial";
	context.fillStyle = "white";

	// Initial text
	text = cellText;
	context.fillText(text, 10, 50);

	// Create a canvas texture
	cTexture = new THREE.CanvasTexture(canvas);

	// Create a material using the texture
	cMaterial = new THREE.MeshBasicMaterial({ map: cTexture, transparent: true, opacity: 1 });

	// Create a plane geometry and mesh using the material
	cGeometry = new THREE.PlaneGeometry(700, 200);
	cMesh = new THREE.Mesh(cGeometry, cMaterial);
	cMesh.rotateX(-Math.PI/2);
	scene.add(cMesh);
}

// Function to update the text
function updateText(newText) {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  if(!hideText){
	// Draw the new text
	//context.fillText("What's a stem cell?", 10, 50);
	context.fillText(newText, 20, 120);
  }
  else{
	context.fillText(layerText, 20, 120);
  }

  // Update the texture
  cTexture.needsUpdate = true;
}

//console.log();

// 3D text, but too many performance issues
// const loader = new FontLoader();
// // Loading the JSON font file from CDN. Can be a file path too.
// loader.load('https://unpkg.com/three@0.77.0/examples/fonts/helvetiker_regular.typeface.json', (font) => {

// // Create the text geometry
// textGeometry = new TextGeometry(cellText, {
// font: font,
// size: 50,
// height: 10,
// curveSegments: 32,
// bevelEnabled: true,
// bevelThickness: 0.5,
// bevelSize: 0.5,
// bevelSegments: 8,
// });
// //textGeometry.needsUpdate;



// // Create a standard material with red color and 50% gloss
// textMaterial = new THREE.MeshStandardMaterial({
// color: 'white',
// roughness: 0.5
// });

// // Geometries are attached to meshes so that they get rendered
// textMesh = new THREE.Mesh(textGeometry, textMaterial);
// // Update positioning of the text
// textMesh.position.set(0, 0, 0);
// textMesh.rotateX(-Math.PI/2);

// scene.add(textMesh);
// });

// function GeneratePlane(){
// 	const width = 2000;
// 	const height = 1000;
// 	const widthSegments = 300;
// 	const heightSegments = 300;

// 	planeGeometry = new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments);
// 	const vertices = planeGeometry.getAttribute('position').count;

// 	for (let i = 0; i < vertices; i++) {
// 		const radius = Math.sqrt(planeGeometry.attributes.position.getX(i) ** 2 + planeGeometry.attributes.position.getY(i) ** 2);
// 		const theta = Math.atan2(planeGeometry.attributes.position.getY(i), planeGeometry.attributes.position.getX(i));
// 		const displacement = Math.sin(radius * 0.1 + time) * 2;

// 		const x = planeGeometry.attributes.position.getX(i) * Math.cos(theta + time * 0.1);
// 		const y = planeGeometry.attributes.position.getY(i) * Math.sin(theta + time * 0.1);
// 		//const z = Math.sin(x * 5 + Date.now() * 0.002) * 0.5; // modify z-coordinate based on a sine function
// 		const z = displacement;
// 		planeGeometry.attributes.position.setZ(i, z);
// 	}

// 	planeGeometry.rotateX(-Math.PI/2);

// 	planeGeometry.attributes.position.needsUpdate = true;

// 	const r = Math.random();
// 	const g = Math.random();
// 	const b = Math.random();

// 	planeMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), transparent: true, opacity: .1 });
// 	planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
// 	scene.add(planeMesh);
// }

// function AnimatePlane(){
// 	const widthSegments = 100;
// 	const heightSegments = 300;

// 	// create a new geometry object
// 	const newPlaneGeometry = new THREE.PlaneBufferGeometry(placeWidth, placeHeight, widthSegments, heightSegments);

// 	const vertices = newPlaneGeometry.getAttribute('position').count;

// 	for (let i = 0; i < vertices; i++) {
// 		const radius = Math.sqrt(newPlaneGeometry.attributes.position.getX(i) ** 2 + newPlaneGeometry.attributes.position.getY(i) ** 2);
// 		const theta = Math.atan2(newPlaneGeometry.attributes.position.getY(i), newPlaneGeometry.attributes.position.getX(i));
// 		const displacement = Math.sin(radius * 0.1 + time) * 4;

// 		const x = newPlaneGeometry.attributes.position.getX(i) * Math.cos(theta + time * 0.3);
// 		const y = newPlaneGeometry.attributes.position.getY(i) * Math.sin(theta + time * 0.3);
// 		//const z = Math.sin(x * 5 + Date.now() * 0.002) * 0.5; // modify z-coordinate based on a sine function
// 		const z = displacement;
// 		newPlaneGeometry.attributes.position.setZ(i, z);
// 	}

// 	const r = Math.random();
// 	const g = Math.random();
// 	const b = Math.random();

// 	// create a new material object
// 	//const newPlaneMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), transparent: true, opacity: .1 });
// 	const newPlaneMaterial = planeMaterial;
	
// 	// create a new mesh object with the new geometry and material
// 	const newPlaneMesh = new THREE.Mesh(newPlaneGeometry, newPlaneMaterial);

// 	// remove the old plane mesh from the scene
// 	scene.remove(planeMesh);

// 	// dispose the old geometry to free up memory
// 	planeGeometry.dispose();

// 	// assign the new geometry to the planeGeometry variable
// 	planeGeometry = newPlaneGeometry;

// 	// update the position and material of the new plane mesh
// 	newPlaneMesh.position.copy(planeMesh.position);
// 	newPlaneMesh.rotation.copy(planeMesh.rotation);
// 	newPlaneMesh.material = newPlaneMaterial;

// 	// add the new plane mesh to the scene
// 	scene.add(newPlaneMesh);

// 	planeGeometry.rotateX(-Math.PI/2);

// 	// set the planeMesh variable to the new mesh
// 	planeMesh = newPlaneMesh;
// }