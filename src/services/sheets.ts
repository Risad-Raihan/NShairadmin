import { google } from 'googleapis';

const SHEET_ID = '1basTADjo0L-SCz293hXefy7EebbUV7n-LjzxS_sskZM';

interface ShipmentData {
  totalShipments: number;
  totalProducts: number;
  topBuyers: Array<{ name: string; orders: number }>;
  productDistribution: { [key: string]: number };
  monthlyShipments: { [key: string]: number };
}

export async function getShipmentData(): Promise<ShipmentData> {
  try {
    // Using service account credentials directly
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Sheet1!A2:AK', // Adjust range based on your data
    });

    const rows = response.data.values || [];
    
    // Process the data
    const buyers = new Map<string, number>();
    const products = new Map<string, number>();
    const monthlyData = new Map<string, number>();

    rows.forEach((row: any[]) => {
      // Count buyers
      const buyer = row[3] || 'Unknown';
      buyers.set(buyer, (buyers.get(buyer) || 0) + 1);

      // Count products (columns G onwards are product quantities)
      for (let i = 6; i < row.length - 3; i++) {
        const productName = response.data.values?.[0][i] || `Product ${i-5}`;
        const quantity = parseInt(row[i]) || 0;
        products.set(productName, (products.get(productName) || 0) + quantity);
      }

      // Group by month
      const date = new Date(row[1]);
      const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
      monthlyData.set(monthYear, (monthlyData.get(monthYear) || 0) + 1);
    });

    // Sort and get top buyers
    const topBuyers = Array.from(buyers.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, orders]) => ({ name, orders }));

    // Get top products
    const productDistribution = Object.fromEntries(
      Array.from(products.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    );

    // Get last 6 months of shipments
    const monthlyShipments = Object.fromEntries(
      Array.from(monthlyData.entries())
        .sort((a, b) => new Date(b[0]) - new Date(a[0]))
        .slice(0, 6)
        .reverse()
    );

    return {
      totalShipments: rows.length,
      totalProducts: Array.from(products.values()).reduce((a, b) => a + b, 0),
      topBuyers,
      productDistribution,
      monthlyShipments,
    };
  } catch (error) {
    console.error('Error fetching shipment data:', error);
    throw error;
  }
} 