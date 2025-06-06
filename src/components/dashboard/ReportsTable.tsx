import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/common/Button";
import { Eye, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExecutionData } from "@/lib/reportUtils";
import { motion, AnimatePresence } from "framer-motion";

interface ReportsTableProps {
  data?: ExecutionData[];
  className?: string;
}

const rowVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.05,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const ReportsTable = ({ data = [], className }: ReportsTableProps) => {
  if (data.length === 0) {
    return (
      <div className={cn("", className)}>
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F7F7F7]">
              <TableHead className="font-semibold">Execution ID</TableHead>
              <TableHead className="font-semibold">Host Name</TableHead>
              <TableHead className="font-semibold">Host IP</TableHead>
              <TableHead className="font-semibold">Execution Name</TableHead>
              <TableHead className="font-semibold">Start Date</TableHead>
              <TableHead className="font-semibold">Execution State</TableHead>
              <TableHead className="font-semibold">Type</TableHead>
              <TableHead className="font-semibold">Executed by</TableHead>
              <TableHead className="font-semibold">Logs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <motion.tr
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                No data found for the selected filters
              </TableCell>
            </motion.tr>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F7F7F7]">
            <TableHead className="font-semibold">Execution ID</TableHead>
            <TableHead className="font-semibold">Host Name</TableHead>
            <TableHead className="font-semibold">Host IP</TableHead>
            <TableHead className="font-semibold">Execution Name</TableHead>
            <TableHead className="font-semibold">Start Date</TableHead>
            <TableHead className="font-semibold">Execution State</TableHead>
            <TableHead className="font-semibold">Type</TableHead>
            <TableHead className="font-semibold">Executed by</TableHead>
            <TableHead className="font-semibold">Logs</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AnimatePresence mode="popLayout">
            {data.map((row, index) => (
              <motion.tr
                key={row.id}
                custom={index}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                layout
                className="hover:bg-gray-50 border-b border-gray-200"
                whileHover={{
                  backgroundColor: "rgba(249, 250, 251, 1)",
                  transition: { duration: 0.2 },
                }}
              >
                <TableCell>
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                  >
                    {row.id}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">{row.hostName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.hostIP}
                </TableCell>
                <TableCell>{row.executionName}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.startDate}
                </TableCell>
                <TableCell>
                  <StatusBadge
                    status={row.executionState}
                    progress={row.progress}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{row.type}</span>
                </TableCell>
                <TableCell>{row.executedBy}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  );
};

export { ReportsTable };
