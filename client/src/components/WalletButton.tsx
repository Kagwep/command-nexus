import { shortAddress } from '../utils/sanitizer';
import { Wallet } from 'lucide-react';
import { Button } from './UI/button';
import { useDojo } from '../dojo/useDojo';
import { useElementStore } from '../utils/nexus';

const WalletButton = () => {
  const {
    account: { account },
  } = useDojo();
  const { isWalletPanelOpen, setWalletPanelOpen } = useElementStore((state) => state);

  return (
    <Button className="p-2 flex gap-3 bg-white hover:bg-green-700" variant={"secondary"} onClick={() => setWalletPanelOpen(!isWalletPanelOpen)}>
      <Wallet size={16} /> <p className="font-vt323">{account?.address ? shortAddress(account?.address) : 'Connect'}</p>
    </Button>
  );
};

export default WalletButton;