import { Scene, ParticleSystem, Texture, Color4, Vector3, CubeTexture, DirectionalLight, ParticleHelper, HemisphericLight, CreateSphere, AbstractMesh, MeshBuilder, PointLight, Color3, VolumetricLightScatteringPostProcess, ArcRotateCameraMouseWheelInput, ArcRotateCamera } from "@babylonjs/core";

export type WeatherType = "clear" | "rainy" | "snowy" | "stormy" | "foggy";

export class WeatherSystem {
  private scene: Scene;
  private currentWeather: WeatherType;
  private particleSystem: ParticleSystem | null;
  private countdown: number;
  private emitterSphere: AbstractMesh | null;
  private camera: ArcRotateCamera;

  constructor(scene: Scene, camera: ArcRotateCamera) {
    this.scene = scene;
    this.currentWeather = "clear";
    this.particleSystem = null;
    this.countdown = 600;  // 10 seconds at 60 fps
    this.setWeather("clear");
    this.camera = camera;
  }

  public setWeather(weatherType: WeatherType): void {
    this.currentWeather = weatherType;
    this.applyWeather();
  }

  private applyWeather(): void {
    if (this.particleSystem) {
      this.particleSystem.dispose();
      this.particleSystem = null;
    }

    if (this.emitterSphere) {
        this.emitterSphere.dispose();
        this.emitterSphere = null;
      }

    switch (this.currentWeather) {
      case "rainy":
        this.Rain();
        break;
      case "snowy":
        this.createSnowParticles();
        break;
      case "stormy":
        this.createStormParticles();
        break;
      case "foggy":
        this.setFoggyWeather();
        break;
      default:
        this.setClearWeather();
    }
  }

  private Rain(): void {
    // Set up environment

    // Light
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    light.intensity = 0;
 

    // Scene color
    this.scene.clearColor = new Color4(0.2, 0.2, 0.2, 1);


    this.emitterSphere = MeshBuilder.CreateSphere("rainEmitter", { diameter: 1 }, this.scene);
    this.emitterSphere.isVisible = false; // Make the sphere invisible

    const camera = this.scene.activeCamera;

    if (camera) {
        this.emitterSphere.position = camera.position.clone();
        //this.emitterSphere.position.y -= 2; // Adjust this value to change rain height
      }

    ParticleHelper.CreateAsync("rain", this.scene, false).then((set) => {
        this.scene.onBeforeRenderObservable.add(() => {
            if (this.emitterSphere && camera) {
              this.emitterSphere.position = camera.position.clone();
              //this.emitterSphere.position.y -= 2; // Keep the rain above the camera
            }
          });
        set.start(this.emitterSphere as AbstractMesh);
    });

    
  }

  private createSnowParticles(): void {
    // Implement snow particles here
    console.log("Snow weather not implemented yet");
  }

  private createStormParticles(): void {
    // Implement storm particles here
    console.log("Storm weather not implemented yet");
  }

  private setClearWeather(): void {

    // Remove any existing lights
    this.scene.lights.forEach(light => light.dispose());

    // Create a directional light to simulate sunlight
    const sunLight = new DirectionalLight("sunLight", new Vector3(1, -1, 1), this.scene);
    sunLight.intensity = 0.4;

    // Create a point light that follows the camera
    const cameraLight = new PointLight("cameraLight", this.scene.activeCamera.position, this.scene);
    cameraLight.intensity = 0.5;
    cameraLight.range = 500; // Adjust this value as needed

    // Make the camera light follow the camera
    this.scene.registerBeforeRender(() => {
        cameraLight.position = this.scene.activeCamera.position;
    });

    // Add very low intensity ambient light to prevent complete darkness
    const ambientLight = new HemisphericLight("ambientLight", new Vector3(0, 1, 0), this.scene);
    ambientLight.intensity = 0.1; // Very low intensity, adjust as needed


    // Optional: Add fog to enhance the radius effect
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogDensity = 0.009; // Adjust this value to change fog density
    this.scene.fogColor = new Color3(0.05, 0.05, 0.1);
    

 
      // Set clear weather sky color
    this.scene.clearColor = new Color4(0.7, 0.8, 1, 1);
    // You might want to reset the environment texture or lighting here
  }

  private setFoggyWeather(): void {
    // Remove any existing lights
    this.scene.lights.forEach(light => light.dispose());

    // Create a dim directional light to simulate minimal moonlight
    const moonLight = new DirectionalLight("moonLight", new Vector3(0.5, -1, 0.5), this.scene);
    moonLight.intensity = 0.1; // Very low intensity

    // Create a point light that follows the camera (like a flashlight effect)
    const cameraLight = new PointLight("cameraLight", this.camera.position, this.scene);
    cameraLight.intensity = 0.7;
    cameraLight.range = 50; // Reduced range for a more claustrophobic feel

    // Make the camera light follow the camera
    this.scene.registerBeforeRender(() => {
        cameraLight.position = this.scene.activeCamera.position;
    });

    // Add very low intensity ambient light
    const ambientLight = new HemisphericLight("ambientLight", new Vector3(0, 1, 0), this.scene);
    ambientLight.intensity = 0.05; // Extremely low intensity

    // Set up dense fog
    this.scene.fogMode = Scene.FOGMODE_EXP2;
    this.scene.fogDensity = 0.008; // Much denser fog
    this.scene.fogColor = new Color3(0.1, 0.1, 0.1); // Dark gray fog

    // Set dark sky color
    this.scene.clearColor = new Color4(0.05, 0.05, 0.05, 1); // Very dark gray, almost black

    // Adjust scene ambient color to enhance darkness
    this.scene.ambientColor = new Color3(0.1, 0.1, 0.1);

    // Optional: Add volumetric fog for more depth
    const volumetricFog = new VolumetricLightScatteringPostProcess(
        'volumetric', 1.0, this.camera, null, 50, Texture.BILINEAR_SAMPLINGMODE
    );
    volumetricFog.exposure = 0.15;
    volumetricFog.decay = 0.95;
    volumetricFog.weight = 0.3;
    volumetricFog.density = 0.7;
}

  public update(): void {
    // You can keep this method if you want to implement automatic weather changes
    // or remove it if you only want manual weather control
  }

  public getCurrentWeather(): WeatherType {
    return this.currentWeather;
  }
}