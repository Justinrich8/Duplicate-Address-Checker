export async function checkDuplicateAddress(inputLine1: string): Promise<boolean> {
    // Use dynamic variables for apiKey and businessId
    const apiKey = '${{apiKey}}';
    const businessId = '${{businessId}}';

    // Construct the API endpoint using the variables
    const ENDPOINT = `https://api.yextapis.com/v2/accounts/${businessId}/entities?api_key=${apiKey}&v=20240930&entityTypes=location`;

    console.log('Constructed ENDPOINT:', ENDPOINT);

    try {
        const response = await fetch(ENDPOINT);

        console.log('API response status:', response.status);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched entities data:', data);

        if (!data.response || !Array.isArray(data.response.entities)) {
            console.error('Error: The API response data is not in the expected format.');
            throw new Error('The API response data is not in the expected format.');
        }

        const isDuplicate = data.response.entities.some((entity: any) => {
            const line1 = entity?.address?.line1 || '';
            return line1.includes(inputLine1);
        });

        return isDuplicate;

    } catch (error) {
        console.error('Error fetching entities:', error.message);
        throw new Error('Failed to fetch existing entities.');
    }
}
