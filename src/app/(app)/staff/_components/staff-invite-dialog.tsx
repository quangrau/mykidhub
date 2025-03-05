"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StaffWithStatus } from "@/lib/staff/staff.types";

interface StaffInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: StaffWithStatus | null;
}

export function StaffInviteDialog({
  open,
  onOpenChange,
  currentRow,
}: StaffInviteDialogProps) {
  if (!currentRow) return null;

  const name = currentRow.name || currentRow.email;

  const handleSendSMS = () => {
    // TODO: Implement SMS sending logic
    console.log('Send SMS to:', name);
  };

  const handleSendEmail = () => {
    // TODO: Implement email sending logic
    console.log('Send email to:', name);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send invite</DialogTitle>
          <DialogDescription>
            Send a signup link to {name}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-6">
            Signup links expire after 7 days. If unused, a new one will need to be sent.
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleSendSMS}
            >
              Send as SMS
            </Button>
            <Button
              className="flex-1"
              onClick={handleSendEmail}
            >
              Send as email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}