import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon, CheckIcon } from 'lucide-react';

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedKey) return;
    const t = setTimeout(() => setCopiedKey(null), 1200);
    return () => clearTimeout(t);
  }, [copiedKey]);

  const handleCopy = (key: string, value: string) => {
    onCopy(value);
    setCopiedKey(key);
  };

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full ">
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
                    onClick={() => handleCopy(`name-${i}`, rec.name)}
                    className="h-6 w-6 relative overflow-hidden"
                  >
                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${copiedKey === `name-${i}` ? 'opacity-0 blur-[2px]' : 'opacity-100 blur-0'}`}>
                      <CopyIcon className="h-3 w-3" />
                    </span>
                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${copiedKey === `name-${i}` ? 'opacity-100 blur-0' : 'opacity-0 blur-[2px]'}`}>
                      <CheckIcon className="h-3 w-3" />
                    </span>
                  </Button>
                </div>
              </td>
              <td className="px-4 py-2 font-mono text-sm">
                <div className="flex items-center gap-2">
                  {rec.value}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(`value-${i}`, rec.value)}
                    className="h-6 w-6 relative overflow-hidden"
                  >
                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${copiedKey === `value-${i}` ? 'opacity-0 blur-[2px]' : 'opacity-100 blur-0'}`}>
                      <CopyIcon className="h-3 w-3" />
                    </span>
                    <span className={`absolute inset-0 flex items-center justify-center transition-all duration-200 ${copiedKey === `value-${i}` ? 'opacity-100 blur-0' : 'opacity-0 blur-[2px]'}`}>
                      <CheckIcon className="h-3 w-3" />
                    </span>
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