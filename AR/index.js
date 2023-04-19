import * as THREE from 'three';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {FirstPersonControls} from 'three/addons/controls/FirstPersonControls.js';

import { initializeApp } from 'firebase/app';
//import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { getDatabase } from "firebase/database";
import { getDatabase, ref, onValue} from "firebase/database";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';

// TODO: Replace the following with your app's Firebase project configuration
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

const app = initializeApp(firebaseConfig);
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

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

init();
animate();

function init() {

	clock = new THREE.Clock();

	camera = new THREE.PerspectiveCamera(
		60, 
		window.innerWidth / window.innerHeight, 
		1, 
		5000);
	
	camera.position.y = 300;
	camera.position.z = 1000;

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xE9F1FF);
	scene.fog = new THREE.FogExp2(0xE9F1FF, 0.0007);

	renderer = new THREE.WebGLRenderer();

	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
	//~~~~~~~~~~~~~~ Plane ~~~~~~~~~~~~~~

	geometry = new THREE.PlaneGeometry(20000, 20000);
	geometry.rotateX(-Math.PI/2);
	
	//load the texture -> a matarial
	texture = new THREE.TextureLoader().load('/whitesky.jpg');

	material = new THREE.MeshBasicMaterial({
		color: 0xC9DEFF,
		map: texture,
		});

	mesh = new THREE.Mesh(geometry, material);
	mesh.rotation.y = Math.random()*2000;

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

	//for loop to create th
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
	controls.movementSpeed = 500;
	controls.lookSpeed = 0.05;
	
	//~~~~~ orbitControl ~~~~~~
	control = new OrbitControls(camera, renderer.domElement);

}

function animate() {

	render();
	requestAnimationFrame(animate);
}

function render() {

	let delta = clock.getDelta();

	//first person
	controls.update(delta);
	
	//orbit
	// control.update(delta);

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
		updateStarCount(postElement, data);
	});
}

function GetDataLayer(){
	const layerCountRef = ref(database, 'Layer');
	onValue(layerCountRef, (snapshot) => {
		const data2 = snapshot.val();
		updateStarCount(postElement, data2);
	});
}