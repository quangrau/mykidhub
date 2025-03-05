"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GuardianWithStatus } from "@/lib/guardian/guardian.types";
import { useTransition } from "react";
import { toast } from "sonner";
import { reInviteGuardianInvitationAction } from "../actions";

interface GuardiansInviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: GuardianWithStatus | null;
}

export function GuardiansInviteDialog({
  open,
  onOpenChange,
  currentRow,
}: GuardiansInviteDialogProps) {
  const [isPending, startTransition] = useTransition();

  if (!currentRow) return null;

  const name = currentRow.name || currentRow.email;

  const handleSendSMS = () => {
    // TODO: Implement SMS sending logic
    console.log("Send SMS to:", name);
  };

  const handleSendEmail = () => {
    startTransition(async () => {
      try {
        const result = await reInviteGuardianInvitationAction(currentRow.id);
        if (result.success) {
          toast.success(result.message);
          onOpenChange(false);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to send invitation");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Send invite</DialogTitle>
          <DialogDescription>Send a signup link to {name}</DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <p className="mb-6">
            Signup links expire after 7 days. If unused, a new one will need to
            be sent.
          </p>
          <div className="flex gap-4">
            {currentRow.phone ? (
              <Button
                disabled
                variant="outline"
                className="flex-1"
                onClick={handleSendSMS}
              >
                Send as SMS
              </Button>
            ) : null}
            <Button
              className="flex-1"
              onClick={handleSendEmail}
              aria-disabled={isPending}
              disabled={isPending}
            >
              {isPending ? "Sending..." : "Send as email"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
