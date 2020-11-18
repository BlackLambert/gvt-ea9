let gl;

// Scene
let scene;
let renderer;

let glPositionAttributeLocation = null;
let glColorAttributeLocation = null;
let glMatrixLocation = null;

let vertexBuffer = null;
let lineIndicesBuffer = null
let triangleColorBuffer = null;
let lineColorBuffer = null;
let triangleIndicesBuffer = null;


const torusInnerRadius = 120;
const torusOuterRadius = 170;
const torusPosition = new Vector3(0, 0, 0);
const torusDeltaRotation = new Vector3(1, 0, 0);
const torusResolution = 8;
const torusInnerResolution = 20;
const torusLineColor = Color.black();
const torusColor = Color.white();
const torusTexturePath = "./src/assets/Texture1.png";

const torus2InnerRadius = 50;
const torus2OuterRadius = 100;
const torus2Position = new Vector3(0, 0, 0);
const torus2DeltaRotation = new Vector3(0, 1, 0);
const torus2Resolution = 8;
const torus2InnerResolution = 20;
const torus2LineColor = Color.green();
const torus2Color = Color.white();
const torus2TexturePath = "./src/assets/Texture2.png";

const directionalLightDir = new Vector3(-0.2, 0.2, -0.75);
const directionalLightIntensity = 0.9;
const directionalLightColor = new Color(1.0, 1.0,1.0,1.0);
const directionalLightDeltaRotation = 2.5;
let directionalLightAngle = 90;
let dirLight;

const ambientLightIntensity = 0.3;
const ambientLightColor = Color.white();

let sphere;
let sphereAngle = 0;
const sphereDeltaAngle = 0.5;



function webglMain()
{
    renderer = new Renderer();
    gl = renderer.gl;
    scene = createScene();
}

function createScene()
{
    // ------------------------------------------
    // Creates meshes 
    // ------------------------------------------


    let glObjects = [];
    let sceneObjects = [];
    let lights = [];

    createTorus(glObjects, sceneObjects);
    createLights(sceneObjects, lights);
    let cam = createCamera(sceneObjects);

    // ------------------------------------------
    // Creates scene 
    // ------------------------------------------

    
    const clearColor = Color.black();
    //console.log(clearColor, sceneObjects, glObjects, cam, lights);
    return new Scene(clearColor, sceneObjects, glObjects, cam, lights);
}

function render()
{
    renderer.render(scene);
}

function colorRandom(glObject)
{
    for (let index = 0; index < glObject.vertices.length; index++) {
        glObject.setSingleFaceColor(index, Color.random());
    }
}

function createTorus(glObjects, sceneObjects)
{
    let torus = Torus.createBasic(torusInnerRadius, torusOuterRadius, 
        torusResolution, torusInnerResolution, torusPosition, torusLineColor, torusColor);
    createBasicTexture(gl, torus);
    torus.localPosition = torusPosition;
    torus.deltaRotation = torusDeltaRotation;
    glObjects.push(torus);
    sceneObjects.push(torus);
    loadTexture(gl, torusTexturePath, torus);

    let torus2 = Torus.createBasic(torus2InnerRadius, torus2OuterRadius, 
        torus2Resolution, torus2InnerResolution, torus2Position, torus2LineColor, torus2Color);
    createBasicTexture(gl, torus2);
    torus2.localPosition = torus2Position;
    torus2.deltaRotation = torus2DeltaRotation;
    glObjects.push(torus2);
    sceneObjects.push(torus2);
    loadTexture(gl, torus2TexturePath, torus2);
}

function createLights(sceneObjects, lights)
{
    dirLight = new DirectionalLight(directionalLightIntensity, 
        directionalLightColor, directionalLightDir);
    lights.push(dirLight)
    sceneObjects.push(dirLight);

    let ambientLight = new AmbientLight(ambientLightIntensity, 
        ambientLightColor);
    lights.push(ambientLight);
    sceneObjects.push(ambientLight);
}

function createCamera(sceneObjects)
{
    let cam = Camera.createPerspective();
    sceneObjects.push(cam);
    return cam;
}

function animateDirLight(factor)
{
    directionalLightAngle = (directionalLightAngle + directionalLightDeltaRotation*factor) % 360;
    directionalLightAngle = directionalLightAngle < 0 ? directionalLightAngle + 360 : directionalLightAngle;
    let s = Math.sin(angleToRadians(directionalLightAngle));
    let c = Math.cos(angleToRadians(directionalLightAngle));
    dirLight.direction = new Vector3(s, dirLight.direction.y, c);
    //console.log(sphere.localPosition.elements);
}