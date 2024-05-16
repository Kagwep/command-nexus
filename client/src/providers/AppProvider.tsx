import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react'
import { Contract } from 'starknet'
import { connect, disconnect } from 'starknetkit'
import { CONTRACT_ABI, CONTRACT_ADDRESS, PRAGMA_ABI, PRAGMA_CONTRACT_ADDRESS } from '../config/config'
import { modals } from '@mantine/modals'
import { Text,Button } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

const initialData = {
    contract: null as any,
    pragma_contract: null as any,
    account: null as any,
    address: null as any,
    connection: null as any,
    handleConnetWalletBtnClick: null as any,
    isSmallScreen: false,
    handleWalletDisconnect:null as any,
    disconnectWallet:null as any,
}

export const AppContext = createContext(initialData)

export const useAppContext = () => {
    return useContext(AppContext)
}

interface IAppProvider {
    children: ReactNode
}

const AppProvider = ({ children }: IAppProvider) => {

    const [contract, setContract] = useState<null | any>()
    const [pragma_contract, setPragmaContract] = useState<null | any>()
    const [connection, setConnection] = useState<null | any>();
    const [account, setAccount] = useState<null | any>();
    const [address, setAddress] = useState<null | any>("");
    const [isSmallScreen, setIsSmallScreen] = useState<boolean | any>(false)

    const matches = useMediaQuery('(max-width: 768px)');

    async function switchNetwork(connection: any) {
        if (connection && connection.chainId !== "SN_GOERLI") {
            try {
                if (window.starknet) {
                    console.log(connection.chainId)
                    await window.starknet.request({
                        type: "wallet_addStarknetChain",
                        params: {
                            chainId: "SN_GOERLI"
                        }
                    })
                }

            } catch (error) {
                
                console.log("Please manually switch your wallet network to testnet and reload the page");
            }
        }
    }

    const connectWallet = async () => {
        const connection = await connect({
            webWalletUrl: "https://web.argent.xyz",
            dappName: "Stark Pay",
        });

        console.log(connection.wallet)

        if (connection && connection.wallet?.isConnected) {
            setConnection(connection);
            setAccount(connection.wallet.account);
            setAddress(connection.wallet.selectedAddress);
        }

        //switchNetwork(connection)
    };

    const disconnectWallet = async () => {
        await disconnect({ clearLastWallet: true });
        setConnection(null);
        setAccount(null);
        setAddress("");
    };


    const openConfirmDisconnectModal = () => modals.openConfirmModal({
        
        title: 'Please confirm your action',
        centered: true,
        radius: "md",
        children: (
            <Text size="sm">
                Are you sure you want to disconnect your account?
            </Text>
        ),
        labels: { confirm: 'Disconnect', cancel: 'Cancel' },
        confirmProps: { radius: "md", variant: "light" },
        cancelProps: { radius: "md", variant: "light" },
        onCancel: () => { },
        onConfirm: () => disconnectWallet(),
    });


    const makeContractConnection = () => {
        if (account) {
            const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account)
            const pragma_contract = new Contract(PRAGMA_ABI, PRAGMA_CONTRACT_ADDRESS, account)
            setPragmaContract(pragma_contract)
            setContract(contract)
        }
    }

    const handleConnetWalletBtnClick = () => {
        console.log("clicked connect wallet")
        if (!account) {
            connectWallet();
        }else {


            
            modals.openConfirmModal({
        
                title: 'Please confirm your action',
                centered: true,
                radius: "md",
                children: (
                    <Text size="sm">
                        Are you sure you want to disconnect your account?
                    </Text>
                ),
                labels: { confirm: 'Disconnect', cancel: 'Cancel' },
                confirmProps: { radius: "md", variant: "light" },
                cancelProps: { radius: "md", variant: "light" },
                onCancel: () => { },
                onConfirm: () => disconnectWallet(),
            })

        }
    }

    const handleWalletDisconnect = () => {
        
            openConfirmDisconnectModal()
    }


    const contextValue = useMemo(() => ({
        contract,
        pragma_contract,
        account,
        address,
        connection,
        handleConnetWalletBtnClick,
        handleWalletDisconnect,
        isSmallScreen,
        disconnectWallet,
    }), [account, contract, address, pragma_contract]);

    useEffect(() => {
        const connectToStarknet = async () => {
            const connection = await connect({
                modalMode: "neverAsk",
                webWalletUrl: "https://web.argent.xyz",
                dappName: "Cycle Stark",
            });

            if (connection && connection.wallet?.isConnected) {
                setConnection(connection);
                setAccount(connection.wallet.account);
                setAddress(connection.wallet.selectedAddress);
            }
            switchNetwork(connection)

        };
        connectToStarknet();
    }, []);

    // useEffect(() => {
    //     makeContractConnection()
    // }, [account, address])

    useEffect(() => {
        setIsSmallScreen(matches)
    }, [matches])

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    )
}

export default AppProvider