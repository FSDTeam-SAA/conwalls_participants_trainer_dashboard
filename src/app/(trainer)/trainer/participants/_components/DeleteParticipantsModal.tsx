import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash2, X } from "lucide-react";

interface DeleteParticipantsModalProps {
  id: string | number;
}

export function DeleteParticipantsModal({ id }: DeleteParticipantsModalProps) {
  const handleDelete = () => {
    console.log("Deleted id:", id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-red-100 hover:bg-red-200 rounded-md text-red-500"
        >
          <Trash2 size={14} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[380px] p-0 gap-0 rounded-2xl border-0 shadow-2xl [&>button]:hidden bg-white">
        <DialogHeader className="px-6 pt-8 pb-0 flex flex-col items-center text-center">
          <DialogTitle className="text-xl font-bold text-gray-800">
            Are you sure?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Are you sure you want to Remove This Perticipants?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="px-6 pt-5 pb-7 flex items-center gap-3 sm:justify-center">
          {/* Cancel */}
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 rounded-lg border-gray-200 text-gray-600 font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
            >
              <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                <X size={11} className="text-gray-500" />
              </span>
              Cancel
            </Button>
          </DialogClose>

          {/* Remove */}
          <DialogClose asChild>
            <Button
              type="button"
              onClick={handleDelete}
              className="flex-1 h-11 rounded-lg bg-[#6abf4b] hover:bg-[#59a83c] text-white font-semibold flex items-center justify-center gap-2"
            >
              <Trash2 size={16} />
              Remove
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
