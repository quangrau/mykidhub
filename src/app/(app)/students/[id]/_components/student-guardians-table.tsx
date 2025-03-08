"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GuardianWithStatus } from "@/lib/guardian/guardian.types";
import { MoreHorizontal } from "lucide-react";

interface DataTableProps {
  data: GuardianWithStatus[];
}

export function StudentGuardiansTable({ data }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Relationship</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-24 text-center text-muted-foreground"
              >
                No guardians found
              </TableCell>
            </TableRow>
          ) : (
            data.map((guardian) => (
              <TableRow key={guardian.id}>
                <TableCell>{guardian.name}</TableCell>
                <TableCell>{guardian.email}</TableCell>
                <TableCell>{guardian.phone || "-"}</TableCell>
                <TableCell>{guardian.relationship}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      guardian.status === "signed_up" ? "default" : "secondary"
                    }
                  >
                    {guardian.status === "signed_up" ? "Active" : "Invited"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => {
                          // TODO: Implement remove guardian functionality
                        }}
                      >
                        Remove Guardian
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
