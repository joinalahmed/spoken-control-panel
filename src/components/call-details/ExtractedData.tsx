
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';

interface ExtractedDataProps {
  extractedData: any | null;
}

const ExtractedData = ({ extractedData }: ExtractedDataProps) => {
  const renderExtractedDataTable = (extractedData: any) => {
    if (!extractedData || typeof extractedData !== 'object') {
      return <p className="text-gray-500 text-sm">No extracted data available.</p>;
    }

    const entries = Object.entries(extractedData);
    if (entries.length === 0) {
      return <p className="text-gray-500 text-sm">No extracted data available.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Field</th>
              <th className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-700">Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value], index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-200 px-4 py-2 font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, ' ')}
                </td>
                <td className="border border-gray-200 px-4 py-2 text-gray-900">
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-gray-900">Extracted Call Data</CardTitle>
        <CardDescription className="text-gray-600">
          Key information extracted from the call
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderExtractedDataTable(extractedData)}
      </CardContent>
    </Card>
  );
};

export default ExtractedData;
