interface AssetStrength {
    [key: string]: number;
}

class LoyalAssetManager {
    private assetStrength: AssetStrength;

    constructor() {
        this.assetStrength = {
            loyalpalace: 200,
            farmhouse1: 50,
            farm1: 40,
            palace1: 90,
            bridge1: 30,
            memorial: 20,
            church: 60,
            highlands: 70,
            ruinspalace: 80,
            whitepalace: 110,
            darkpalace: 120,
            fortvillage: 95,
            fort: 85,
            plains: 25,
            highlandstop: 55
        };
    }

    getAssetStrength(assetName: string): number | undefined {
        return this.assetStrength[assetName];
    }

    setAssetStrength(assetName: string, strength: number): void {
        if (this.assetStrength[assetName] !== undefined) {
            this.assetStrength[assetName] = strength;
        } else {
            console.warn(`Asset ${assetName} does not exist.`);
        }
    }

    displayAllAssetStrengths(): void {
        console.log(this.assetStrength);
    }
}