import { Scene, Vector3, FreeCamera, Mesh, ArcRotateCamera } from '@babylonjs/core';

enum BattlefieldName {
  None,
  RadiantShores,
  Ironforge,
  Skullcrag,
  NovaWarhound,
  SavageCoast,
}

interface CameraOffset {
  position: Vector3;
  lookAtOffset: Vector3;
}

export class BattlefieldCameraManager {
  private scene: Scene;
  private camera: ArcRotateCamera;
  private landmarks: Map<BattlefieldName, Mesh>;
  private cameraOffsets: Map<BattlefieldName, CameraOffset>;

  constructor(scene: Scene,camera) {
    this.scene = scene;
    this.camera = camera;
    this.landmarks = new Map();
    this.cameraOffsets = new Map();

    this.initializeCameraOffsets();
  }

  private initializeCameraOffsets() {
    this.cameraOffsets.set(BattlefieldName.RadiantShores, {
      position: new Vector3(0, 10, -20),
      lookAtOffset: new Vector3(0, 0, 0)
    });
    this.cameraOffsets.set(BattlefieldName.Ironforge, {
      position: new Vector3(15, 8, -15),
      lookAtOffset: new Vector3(0, 2, 0)
    });
    this.cameraOffsets.set(BattlefieldName.SavageCoast, {
      position: new Vector3(-10, 12, -10),
      lookAtOffset: new Vector3(0, 5, 0)
    });
    this.cameraOffsets.set(BattlefieldName.NovaWarhound, {
      position: new Vector3(5, 15, -25),
      lookAtOffset: new Vector3(0, 3, 0)
    });
    this.cameraOffsets.set(BattlefieldName.Skullcrag, {
      position: new Vector3(-5, 7, -18),
      lookAtOffset: new Vector3(0, 1, 0)
    });
  }

  public registerLandmark(battlefield: BattlefieldName, landmark: Mesh) {
    this.landmarks.set(battlefield, landmark);
  }

  public setCameraForBattlefield(battlefield: BattlefieldName) {
    const landmark = this.landmarks.get(battlefield);
    const offset = this.cameraOffsets.get(battlefield);

    if (landmark && offset) {
      const landmarkPosition = landmark.getAbsolutePosition();
      this.camera.position = landmarkPosition.add(offset.position);
      const targetPosition = landmarkPosition.add(offset.lookAtOffset);
      this.camera.setTarget(targetPosition);
    } else {
      console.warn(`Landmark or camera offset not defined for battlefield: ${battlefield}`);
    }
  }
}
