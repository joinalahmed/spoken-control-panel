
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';

interface CallNotesProps {
  notes: string | null;
}

const CallNotes = ({ notes }: CallNotesProps) => {
  return (
    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow mt-6">
      <CardHeader>
        <CardTitle className="text-gray-900">Call Notes</CardTitle>
        <CardDescription className="text-gray-600">
          Additional notes and observations from the call
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notes ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 text-sm leading-relaxed">{notes}</p>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No notes available for this call.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CallNotes;
