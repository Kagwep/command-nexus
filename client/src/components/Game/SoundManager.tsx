import { Scene, Sound, Vector3 } from "@babylonjs/core";

export class SoundManager {
    private scene: Scene;
    private sounds: Map<string, Sound>;

    constructor(scene: Scene) {
        this.scene = scene;
        this.sounds = new Map();
    }

    addSound(name: string, url: string, options?: {
        loop?: boolean,
        autoplay?: boolean,
        volume?: number,
        spatialSound?: boolean,
        maxDistance?: number,
        position?: Vector3
    }): void {
        const sound = new Sound(name, url, this.scene, null, {
            loop: options?.loop || false,
            autoplay: options?.autoplay || false,
            volume: options?.volume || 1,
            spatialSound: options?.spatialSound || false,
            maxDistance: options?.maxDistance || 100
        });

        if (options?.spatialSound && options?.position) {
            sound.setPosition(options.position);
        }

        this.sounds.set(name, sound);

    }

    playSound(name: string): void {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.play();
            sound.setVolume(0.3);
        } else {
            console.warn(`Sound ${name} not found`);
        }

    }

    stopSound(name: string): void {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.stop();
        } else {
            console.warn(`Sound ${name} not found`);
        }
    }

    setVolume(name: string, volume: number): void {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.setVolume(volume);
        } else {
            console.warn(`Sound ${name} not found`);
        }
    }

    setSoundPosition(name: string, position: Vector3): void {
        const sound = this.sounds.get(name);
        if (sound && sound.spatialSound) {
            sound.setPosition(position);
        } else {
            console.warn(`Sound ${name} not found or is not a spatial sound`);
        }
    }

    disposeSound(name: string): void {
        const sound = this.sounds.get(name);
        if (sound) {
            sound.dispose();
            this.sounds.delete(name);
        } else {
            console.warn(`Sound ${name} not found`);
        }
    }

    disposeAll(): void {
        this.sounds.forEach(sound => sound.dispose());
        this.sounds.clear();
    }
}

