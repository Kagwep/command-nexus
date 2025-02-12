interface StarknetErrorDetail {
    execution_error: string;
    transaction_index: number;
}

export class StarknetErrorParser {
    static parseError(error: any): string {

        console.log(error)
        // Check if it's a LibraryError containing a Starknet error
        if (error?.message?.includes('RPC')) {
            try {
                // Extract the error message if it exists
                const match = error.message.match(/Failure reason: (0x[a-fA-F0-9]+) \('([^']+)'\)/);
                if (match) {
                    return match[2]; // Return the human-readable message
                }

                // If there's an execution_error object
                const errorMatch = error.message.match(/execution_error":"([^"]+)"/);
                if (errorMatch) {
                    const executionError = errorMatch[1];
                    // Try to find any readable messages
                    const readableMatch = executionError.match(/Failure reason: [^']*'([^']+)'/);
                    if (readableMatch) {
                        return readableMatch[1];
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