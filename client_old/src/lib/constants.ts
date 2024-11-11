// UI PARAMS
export const MIN_BALANCE = 100000000000000; // 0.00001ETH or $0.15
export const getWaitRetryInterval = (network: string) =>
  network === "mainnet" || network === "sepolia" ? 3000 : 10; // 6 seconds on sepolia + mainnet, 10ms on katana
export const ETH_INCREMENT = 0.001;
export const LORDS_INCREMENT = 5;
export const getMaxFee = (network: string) =>
  network === "mainnet" || network === "sepolia"
    ? 0.3 * 10 ** 18
    : 0.03 * 10 ** 18; // 0.003ETH on mainnet or sepolia, 0.0003ETH on goerli
export const ETH_PREFUND_AMOUNT = (network: string) =>
  network === "mainnet" || network === "sepolia"
    ? "0x2386F26FC10000"
    : "0x38D7EA4C68000"; // 0.01ETH on Mainnet or Sepolia, 0.001ETH on Testnet


  export const prologue =
  "An adventurer stirs from a slumber in a cold, dark cave.";
export const chapter1 =
  "Disoriented, they scour the darkness, the only sound a dripping echo and the biting whisper of wind.";
export const chapter2 =
  "Where? How? Water whispers nearby. They move, reaching through the mist. Suddenly, a fountain materializes, an ethereal sentinel obscured by the swirling vapor.";
export const chapter3 =
  "Intrigued, they draw closer, their form dancing on the water's surface. Four oddities lie within - a wand, a book, a club, and a sword.";
export const chapter4 =
  "They find golden coins in their pocket, glimmering in the dim light - an enigma wrapped in the shroud of the unexpected.";
export const battle = "A beast lurks in the shadow, prepare for battle!";
