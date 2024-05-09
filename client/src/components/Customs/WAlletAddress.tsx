import React from 'react';

interface WalletDressProps {
    address: string
}

const WalletAddress:React.FC<WalletDressProps> = ({ address }) => {

    const formatWalletAddress = (address: string, maxLength = 8, ellipsis = '...') => {
        // Check if address is valid
        if (!address || typeof address !== 'string') {
            return 'Invalid address';
        }

        // Define the length of characters to display before and after ellipsis
        const prefixLength = 6; // '0x' + 4 characters
        const suffixLength = 4; // Last 4 characters to show

        // Check if the address is longer than the prefix and suffix combined
        if (address.length <= prefixLength + suffixLength) {
            return address; // If it's shorter, return the full address
        }

        // Construct the formatted address
        const prefix = address.slice(0, prefixLength); // '0x' + 4 characters
        const suffix = address.slice(-suffixLength); // Last 4 characters
        const formattedAddress = `${prefix}${ellipsis}${suffix}`;

        return formattedAddress;
    };

    const formattedAddress = formatWalletAddress(address);

    return <span className='text-green-500  text-2xl'>{formattedAddress}</span>;
};

export default WalletAddress;
