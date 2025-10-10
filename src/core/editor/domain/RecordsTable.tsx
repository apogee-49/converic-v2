import { Button } from "@/components/ui/button";
import { CopyIcon } from 'lucide-react';

interface DNSRecord {
  type: string;
  name: string;
  value: string;
}

interface DNSRecordsTableProps {
  records: DNSRecord[];
  onCopy: (value: string) => void;
}

export function DNSRecordsTable({ records, onCopy }: DNSRecordsTableProps) {
  return (
    <div className="rounded-md border mt-4">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted">
            <th className="px-4 py-2 text-left text-sm font-medium">Type</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium">Value</th>
            <th className="px-4 py-2 w-[50px]"></th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec, i) => (
            <tr key={i} className="border-b last:border-0">
              <td className="px-4 py-2 font-mono text-sm">{rec.type}</td>
              <td className="px-4 py-2 font-mono text-sm">
                <div className="flex items-center gap-2">
                  {rec.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopy(rec.name)}
                    className="h-6 w-6"
                  >
                    <CopyIcon className="h-3 w-3" />
                  </Button>
                </div>
              </td>
              <td className="px-4 py-2 font-mono text-sm">
                <div className="flex items-center gap-2">
                  {rec.value}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopy(rec.value)}
                    className="h-6 w-6"
                  >
                    <CopyIcon className="h-3 w-3" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 