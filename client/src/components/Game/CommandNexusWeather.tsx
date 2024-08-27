import { Scene, ParticleSystem, Texture, Color4, Vector3, CubeTexture, DirectionalLight, ParticleHelper, HemisphericLight, CreateSphere, AbstractMesh, MeshBuilder } from "@babylonjs/core";

export type WeatherType = "clear" | "rainy" | "snowy" | "stormy";

export class WeatherSystem {
  private scene: Scene;
  private currentWeather: WeatherType;
  private particleSystem: ParticleSystem | null;
  private countdown: number;
  private emitterSphere: AbstractMesh | null;

  constructor(scene: Scene) {
    this.scene = scene;
    this.currentWeather = "clear";
    this.particleSystem = null;
    this.countdown = 600;  // 10 seconds at 60 fps
    this.setWeather("clear");
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

      // Light
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene);
    light.intensity = 0.4;
        // Set clear weather conditions
    this.scene.clearColor = new Color4(0.8, 0.8, 0.8);
    // You might want to reset the environment texture or lighting here
  }

  public update(): void {
    // You can keep this method if you want to implement automatic weather changes
    // or remove it if you only want manual weather control
  }

  public getCurrentWeather(): WeatherType {
    return this.currentWeather;
  }
}