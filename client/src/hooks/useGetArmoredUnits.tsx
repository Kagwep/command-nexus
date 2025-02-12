import { useElementStore } from '../utils/nexus';


export const useArmoredUnits = () => {

  const { game_id } = useElementStore((state) => state);




  const armoredUnits = []

console.log(armoredUnits);

  return {
    armoredUnits,
    entitiesCount: armoredUnits.length
  };
};