let myShader;
let isLit = false;

let from, to;
let interA, interB;

let currentRotation = 0;
let targetRotation = 0;
let rotationSpeed = 0.05;
let rotating = false;

function setup() {
  createCanvas(400, 400, WEBGL);

  from = color(110, 85, 260);  
  to = color(95, 75, 300);     

  interA = lerpColor(from, to, 0.30);
  interB = lerpColor(from, to, 0.90);

  myShader = baseMaterialShader().modify({
    uniforms: {
      'vec4 uColor': [0, 0, 0, 0]
    },
    declarations: 'vec3 myNormal;',
    'Inputs getPixelInputs': `(Inputs inputs) {
      myNormal = inputs.normal;
      return inputs;
    }`,
    'vec4 getFinalColor': `(vec4 color) {
      vec4 baseColor = uColor;
      return baseColor * color;
    }`
  });
}

function draw() {
  background(5);
  orbitControl();

  
  if (rotating) {
    let diff = targetRotation - currentRotation;
    let step = Math.sign(diff) * rotationSpeed;

    if (abs(diff) <= abs(step)) {
      currentRotation = targetRotation;
      rotating = false;
    } else {
      currentRotation += step;
    }
  }

  if (isLit) {
    ambientLight(85, 75, 135);             
    directionalLight(50, 300, 10, 0, -1, 0); 
  }

  shader(myShader);
  noStroke();

  push();
  rotateZ(currentRotation);  

  myShader.setUniform('uColor', [
    red(interA) / 140,
    green(interA) / 150,
    blue(interA) / 40,
    alpha(interA) / 260
  ]);
  ellipsoid(100);

  myShader.setUniform('uColor', [
    red(interB) / 265,
    green(interB) / 160,
    blue(interB) / 111,
    alpha(interB) / 260
  ]);
  torus(100);

  myShader.setUniform('uColor', [1, 1, 1, 1]);
  torus(100, 20, 8, 2);

  pop();
}

function doubleClicked() {
  if (!rotating) {
    targetRotation += HALF_PI;  
    rotating = true;
    isLit = !isLit;             
    console.log("Double click: rotation started, lighting toggled:", isLit);
  }
}
