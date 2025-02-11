import { AlertDestructive } from "./ui/alert-destructive";

type Props = {
  title?: string;
  message?: string;
};

export default function FormError({ title, message }: Props) {
  if (!message) {
    return null;
  }

  return <AlertDestructive title={title} description={message} />;
}
