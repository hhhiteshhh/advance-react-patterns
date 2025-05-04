import Card from "@/features/shared/components/ui/Card";
import { Button } from "@/features/shared/components/ui/Button";
import { useState } from "react";
import { UserAvatar } from "@/features/users/components/UserAvatar";
import { CommentForList } from "../types";
import { CommentEditForm } from "./CommentEditForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog"
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";


type CommentCardProps = {
  comment: CommentForList;
};

export function CommentCard({ comment }: CommentCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return <CommentEditForm comment={comment} setIsEditing={setIsEditing} />;
  }
  return (
    <Card className="space-y-4">
      <CommentCardHeader comment={comment} />
      <CommentCardContent comment={comment} />
      <CommentCardButtons setIsEditing={setIsEditing} comment={comment} />

    </Card>
  );
}

type CommentCardHeaderProps = Pick<CommentCardProps, "comment">;

function CommentCardHeader({ comment }: CommentCardHeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <div>{comment.user.name}</div>
            <UserAvatar user={comment.user} />

      <time className="text-sm text-neutral-500">
        · {new Date(comment.createdAt).toLocaleDateString()}
      </time>
    </div>
  );
}

type CommentCardContentProps = Pick<CommentCardProps, "comment">;

function CommentCardContent({ comment }: CommentCardContentProps) {
  return <p>{comment.content}</p>;
}


type CommentCardButtonsProps = Pick<CommentCardProps, "comment"> & {
  setIsEditing: (value: boolean) => void;
};

function CommentCardButtons({ comment, setIsEditing }: CommentCardButtonsProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const utils = trpc.useUtils();
  const { toast } = useToast();


  const deleteMutation = trpc.comments.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.comments.byExperienceId.invalidate({
          experienceId: comment.experienceId,
        }),
        utils.experiences.feed.invalidate(),
      ]);

      setIsEditing(false);

      toast({
        title: "Comment deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  return (
    <div className="flex gap-4">
      <Button variant="link" onClick={() => setIsEditing(true)}>
        Edit
      </Button>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger>
          <Button variant={"destructive-link"} >Delete</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action is irreversible
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant={"outline"} onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant={"destructive"} disabled={deleteMutation.isPending} onClick={() => deleteMutation.mutate({ id: comment.id })}>{deleteMutation.isPending ? "Deleting..." : "Delete"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
