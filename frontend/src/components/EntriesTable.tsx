import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Card } from './ui/card';

const threats = [
  {
    id: 'THR-001',
    type: 'Malware',
    severity: 'critical',
    source: '192.168.1.45',
    target: 'Server-DB-01',
    status: 'blocked',
    timestamp: '2024-01-15 14:23:45',
  },
  {
    id: 'THR-002',
    type: 'Phishing Attempt',
    severity: 'high',
    source: 'external@suspicious.com',
    target: 'user@company.com',
    status: 'quarantined',
    timestamp: '2024-01-15 13:45:12',
  },
  {
    id: 'THR-003',
    type: 'Unauthorized Access',
    severity: 'high',
    source: '10.0.0.123',
    target: 'Admin Portal',
    status: 'blocked',
    timestamp: '2024-01-15 12:15:30',
  },
  {
    id: 'THR-004',
    type: 'DDoS Attack',
    severity: 'critical',
    source: 'Multiple IPs',
    target: 'Web Server',
    status: 'mitigating',
    timestamp: '2024-01-15 11:50:22',
  },
  {
    id: 'THR-005',
    type: 'Suspicious Traffic',
    severity: 'medium',
    source: '172.16.0.88',
    target: 'Firewall',
    status: 'monitoring',
    timestamp: '2024-01-15 10:30:18',
  },
  {
    id: 'THR-006',
    type: 'Ransomware',
    severity: 'critical',
    source: 'email-attachment',
    target: 'Workstation-42',
    status: 'blocked',
    timestamp: '2024-01-15 09:12:05',
  },
  {
    id: 'THR-007',
    type: 'SQL Injection',
    severity: 'high',
    source: '203.0.113.45',
    target: 'API Gateway',
    status: 'blocked',
    timestamp: '2024-01-15 08:45:33',
  },
  {
    id: 'THR-008',
    type: 'Port Scan',
    severity: 'low',
    source: '198.51.100.12',
    target: 'Network',
    status: 'logged',
    timestamp: '2024-01-15 07:22:19',
  },
];

const severityConfig = {
  critical: { label: 'Critical', color: 'bg-red-100 text-red-700' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-700' },
  medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  low: { label: 'Low', color: 'bg-gray-100 text-gray-700' },
};

const statusConfig = {
  blocked: { label: 'Blocked', color: 'bg-red-100 text-red-700' },
  quarantined: { label: 'Quarantined', color: 'bg-orange-100 text-orange-700' },
  mitigating: { label: 'Mitigating', color: 'bg-blue-100 text-blue-700' },
  monitoring: { label: 'Monitoring', color: 'bg-yellow-100 text-yellow-700' },
  logged: { label: 'Logged', color: 'bg-gray-100 text-gray-700' },
};

export function EntriesTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Recent Security Events</h2>
        <Button variant="outline" size="sm">
          View All Threats
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-gray-900">
                  Threat ID
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-gray-900">
                  Type
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-gray-900">
                  Severity
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-gray-900">
                  Status
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button className="flex items-center gap-1 hover:text-gray-900">
                  Timestamp
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {threats.map((threat) => {
              const severity = severityConfig[threat.severity as keyof typeof severityConfig];
              const status = statusConfig[threat.status as keyof typeof statusConfig];
              
              return (
                <TableRow key={threat.id}>
                  <TableCell>
                    <span className="font-medium">{threat.id}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{threat.type}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={severity.color}>
                      {severity.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-gray-600">{threat.source}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{threat.target}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={status.color}>
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {threat.timestamp}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Investigate</DropdownMenuItem>
                        <DropdownMenuItem>Create Report</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Mark as False Positive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}