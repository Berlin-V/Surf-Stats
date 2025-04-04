// src/utils/decodeData.js
/**
 * Decodes base64 encoded data and returns the parsed JSON
 * @param {string} base64String - The base64 encoded string to decode
 * @returns {Object} The decoded data as a JavaScript object
 */
export const decodeBase64Data = (base64String) => {
    try {
        if (!base64String) {
            throw new Error("Invalid base64 string: No data provided");
        }

        // Decode the base64 string to text
        const decodedString = atob(base64String);
        
        // Clean the JSON string to handle any special characters or control characters
        // Remove control characters and other potentially problematic characters
        const cleanedString = decodedString
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
            .replace(/([{\[,:])\s*([,\]}])/g, '$1null$2')  // Replace empty values with null
            .replace(/,\s*([,\]}])/g, '$1')                // Fix trailing commas
            .replace(/([{,])\s*}/g, '$1}')                 // Fix empty objects
            .replace(/}([^,\]}])/g, '},$1');               // Add missing commas

        // Try to parse the JSON
        try {
            return JSON.parse(cleanedString);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            
            // Additional attempt - try to fix common JSON syntax errors
            const fixedString = cleanedString
                .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":') // Ensure property names are quoted
                .replace(/'/g, '"');                                  // Replace single quotes with double quotes
            
            return JSON.parse(fixedString);
        }
    } catch (error) {
        console.error("Error decoding base64 data:", error);
        throw error;
    }
};
