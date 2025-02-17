"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Student } from "@prisma/client";
import { useState } from "react";

interface StudentsDisableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Student | null;
}

export function StudentsDisableDialog({
  open,
  onOpenChange,
  currentRow,
}: StudentsDisableDialogProps) {
  const [selectedAction, setSelectedAction] = useState<"graduate" | "drop">();
  const name = currentRow?.firstName + " " + currentRow?.lastName;

  const onConfirm = (action: "graduate" | "drop") => {
    console.log(action);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Disable {name}</DialogTitle>
          <DialogDescription>
            Are you sure you want to disable{" "}
            <span className="font-semibold">{name}</span>? This will turn off
            all notifications, messaging, and billing.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <RadioGroup
            value={selectedAction}
            onValueChange={(value) =>
              setSelectedAction(value as "graduate" | "drop")
            }
            className="gap-6"
          >
            <div className="flex items-start space-x-3 space-y-3">
              <RadioGroupItem value="graduate" id="graduate" />
              <Label htmlFor="graduate" className="font-normal !mt-0">
                <div>Graduate student</div>
                <span className="text-sm text-muted-foreground">
                  Move the student into an inactive classroom called
                  &quot;Graduated&quot;
                </span>
              </Label>
            </div>

            <div className="flex items-start space-x-3 space-y-3">
              <RadioGroupItem value="drop" id="drop" />
              <Label htmlFor="drop" className="font-normal !mt-0">
                <div>Drop student</div>
                <span className="text-sm text-muted-foreground">
                  Move the student into an inactive classroom called
                  &quot;Dropped&quot;
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={() => selectedAction && onConfirm(selectedAction)}
            disabled={!selectedAction}
          >
            Disable Awesome Kid
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
