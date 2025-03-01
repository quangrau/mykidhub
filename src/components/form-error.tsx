import { AlertDestructive } from "./ui/alert-destructive";

type Props = {
  title?: string;
  message?: string;
};

export default function FormError({ title = "Error", message }: Props) {
  if (!message) {
    return null;
  }

  return <AlertDestructive title={title} description={message} />;
}
