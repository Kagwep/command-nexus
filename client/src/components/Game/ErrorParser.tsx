interface StarknetErrorDetail {
    execution_error: string;
    transaction_index: number;
}

export class StarknetErrorParser {
    static parseError(error: any): string {
        console.log(error);
        
        // Check if it's a LibraryError containing a Starknet error
        if (error?.message?.includes('RPC')) {
            try {
                // First try to match the simple format: Failure reason: 0x... ('message')
                const simpleMatch = error.message.match(/Failure reason: (0x[a-fA-F0-9]+) \('([^']+)'\)/);
                if (simpleMatch) {
                    return simpleMatch[2];
                }

                // Try to extract the execution_error object
                const errorMatch = error.message.match(/execution_error":"([^"]+)"/);
                if (errorMatch) {
                    const executionError = errorMatch[1];
                    
                    // Look for hex-encoded error messages
                    const hexMatch = executionError.match(/0x[a-fA-F0-9]+\s\('([^']+)'\)/);
                    if (hexMatch) {
                        return hexMatch[1];
                    }
                    
                    // Try to find any readable messages with "Failure reason:"
                    const readableMatch = executionError.match(/Failure reason: [^']*'([^']+)'/);
                    if (readableMatch) {
                        return readableMatch[1];
                    }
                    
                    // Last attempt: look for any string within single quotes
                    const quotedMatch = executionError.match(/'([^']+)'/);
                    if (quotedMatch) {
                        return quotedMatch[1];
                    }
                }
            } catch (parseError) {
                console.error('Error parsing Starknet error:', parseError);
            }
        }
        
        // If all parsing fails, return the original error message or a default
        return error?.message || 'Unknown Starknet error occurred';
    }
}