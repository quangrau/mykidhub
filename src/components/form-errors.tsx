import { AlertDestructive } from "./ui/alert-destructive";

type Props = {
  message?: string;
};

export default function FormErrors({ message }: Props) {
  if (!message) {
    return null;
  }

  return <AlertDestructive title="Error" description={message} />;
}
