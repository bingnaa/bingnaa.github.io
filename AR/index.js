import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {FirstPersonControls} from 'three/addons/controls/FirstPersonControls.js';
//import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

//https://sbcode.net/threejs/loaders-fbx/

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

let camera, scene, renderer;

//control
let controls, //firstPerson
	control; //orbitConrol

//plane
let geometry, texture, material, mesh ;

	
//cell
let cloudGeo, cloudTexture, cloudMaterial ;


let clock;

let video;

let time = 0;

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

init();
animate();

//console.log(GetDataCell())

function init() {

	clock = new THREE.Clock();

	camera = new THREE.PerspectiveCamera(
		60, 
		window.innerWidth / window.innerHeight, 
		1, 
		5000);
	
	camera.position.y = 1755;
	camera.position.z = 1742;
	camera.position.x = 1740;

	console.log(camera.position);

	scene = new THREE.Scene();
	scene.background = new THREE.Color('black');
	//scene.fog = new THREE.FogExp2(0xE9F1FF, 0.0007);

	renderer = new THREE.WebGLRenderer();

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	//~~~~~~~~~~~~~~ Plane ~~~~~~~~~~~~~~

	geometry = new THREE.PlaneGeometry(10000, 6000);
	geometry.rotateX(-Math.PI/2);
	
	video = document.createElement('video');
	video.src = '/cell.mp4';

	video.loop = true;
	video.muted = true;
	video.play();
	
	//load the texture -> a matarial
	texture = new THREE.VideoTexture(video);
	texture.needsUpdate = true;

	// texture.wrapS = THREE.RepeatWrapping;
	// texture.wrapT = THREE.RepeatWrapping;
	// texture.repeat.set(10, 10);

	material = new THREE.MeshBasicMaterial({
		color: 0xC9DEFF,
		map: texture,
		toneMapped: false
		});
	material.needsUpdate = true;

	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.y = Math.random()*100;

	scene.add(mesh);

	//~~~~~~~~~~~~~~ cloud ~~~~~~~~~~~~~~~~

	cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
	cloudTexture = new THREE.TextureLoader().load("/smoke-1.png")
	cloudMaterial = new THREE.MeshBasicMaterial({
		color: 0x0084ff,
		map: cloudTexture,
		transparent: true,
		opacity: 0.09
		});

	// //for loop to create th
	// for (let i = 0; i < 10; i++) {
	// 	let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
	// 	cloud.position.set(
	// 		Math.random() * 100,
	// 		400,
	// 		Math.random() * 100
	// 	);

	// 	cloud.rotation.x = 1;
	// 	cloud.rotation.y = 0;
	// 	cloud.rotation.z = Math.random() *100;

	// 	scene.add(cloud);

	// }
	
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

	GeneratePlane();

}

function animate() {
	requestAnimationFrame(animate);

	if (video.readyState === video.HAVE_ENOUGH_DATA) {
		texture.needsUpdate = true;
	}
	render();

	time += 0.01;
}

function render() {

	let delta = clock.getDelta();

	//first person
	controls.update(delta);
	
	//orbit
	control.update(delta);

	renderer.render(scene, camera);
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
		const data = snapshot.val();
		//updateStarCount(postElement, data);
	});
}

function GetDataLayer(){
	const layerCountRef = ref(database, 'Layer');
	onValue(layerCountRef, (snapshot) => {
		const data2 = snapshot.val();
		//updateStarCount(postElement, data2);
	});
}

function GeneratePlane(){
	const width = 10000;
	const height = 10000;
	const widthSegments = 300;
	const heightSegments = 300;

	const planeGeometry = new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments);
	const vertices = planeGeometry.getAttribute('position').count;

	for (let i = 0; i < vertices; i++) {
		const radius = Math.sqrt(planeGeometry.attributes.position.getX(i) ** 2 + planeGeometry.attributes.position.getY(i) ** 2);
		const theta = Math.atan2(planeGeometry.attributes.position.getY(i), planeGeometry.attributes.position.getX(i));
		const displacement = Math.sin(radius * 0.1 + time) * 2;

		const x = planeGeometry.attributes.position.getX(i) * Math.cos(theta + time * 0.1);
		const y = planeGeometry.attributes.position.getY(i) * Math.sin(theta + time * 0.1);
		//const z = Math.sin(x * 5 + Date.now() * 0.002) * 0.5; // modify z-coordinate based on a sine function
		const z = displacement;
		planeGeometry.attributes.position.setZ(i, z);
	}

	planeGeometry.rotateX(-Math.PI/2);

	planeGeometry.attributes.position.needsUpdate = true;

	const r = Math.random();
	const g = Math.random();
	const b = Math.random();

	const planeMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(r, g, b), transparent: true, opacity: 0.1 });
	const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
	scene.add(planeMesh);
}