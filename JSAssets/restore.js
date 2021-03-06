function animateRestore(){
    console.log('running');
    $("#avengersImage").css('display', 'block').css("z-index",1);
    //$("#content").css("z-index:")
}

var scene, cam, renderer, clock, portalParticles = [], portalLight, smokeParticles = [];

function initscene(){
  scene = new THREE.Scene();

  //add the light to the scene
  sceneLight = new THREE.DirectionalLight(0xffffff,0.5); //set the light to white, with a 50% intensity
  sceneLight.position.set(0,0,1); //light direction is front to back
  scene.add(sceneLight);

  portalLight = new THREE.PointLight(0x062d89, 30, 600, 1.7);
  portalLight.position.set(0,0,250);
  scene.add(portalLight);

  //add the camera angle and perspective
  cam = new THREE.PerspectiveCamera(80,window.innerWidth/window.innerHeight,1,10000); //set the camera angle to 80 degrees
  cam.position.z = 1000; //set the distance of the camera to 1000 units
  scene.add(cam);

  //add the renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x000000,1);
  renderer.setSize(window.innerWidth , window.innerHeight);
  document.body.appendChild(renderer.domElement);

  particleSetup();
}

function particleSetup(){
  let loader = new THREE.TextureLoader();

  loader.load('images/smoke.png', function (texture){
    portalGeo = new THREE.PlaneBufferGeometry(350,350);
    portalMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true
    });

    smokeGeo = new THREE.PlaneBufferGeometry(1000,1000);
    smokeMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true
    });

    let particle = new THREE.Mesh(portalGeo, portalMaterial);
    particle.position.set(2,2,2);

    // a conical (cone) spiral equation to draw multiple smoke images in a cone shape
    for(let p=880;p>250;p--) {
        let particle = new THREE.Mesh(portalGeo,portalMaterial);
        particle.position.set(
          0.5 * p * Math.cos((4 * p * Math.PI) / 180),
          0.5 * p * Math.sin((4 * p * Math.PI) / 180),
          0.1 * p
        );
        particle.rotation.z = Math.random() *360;
        portalParticles.push(particle);
        scene.add(particle);
    }

    for(let p=0;p<40;p++) {
        let particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(
          Math.random() * 1000-500,
          Math.random() * 400-200,
          25
        );
        particle.rotation.z = Math.random() *360;
        particle.material.opacity = 0.4;
        portalParticles.push(particle);
        scene.add(particle);
    }

    Clock = new THREE.Clock();
    animate();
  });
}


function animate(){
  let delta = Clock.getDelta();
  portalParticles.forEach(p => {
    p.rotation.z -= delta * 1.5;
  });
  smokeParticles.forEach(p => {
    p.rotation.z -= delta * 0.2;
  });
  if(Math.random() > 0.9){
    portalLight.power = 350 + Math.random()*500;
  }
  renderer.render(scene, cam);
  requestAnimationFrame(animate);
}
