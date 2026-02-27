import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface LogoutModalProps {
  className?: string;
  text?: string;
  onConfirmation: () => void,
  onCancel: () => void,
}

export default function LogoutModal({ className, text = "Logout", onConfirmation, onCancel }: LogoutModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className={className}>{text}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure, You want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be logout of our application
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmation}>Logout</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
