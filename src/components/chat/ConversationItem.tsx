import { MessageSquare, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
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

interface ConversationItemProps {
  id: string;
  title: string;
  lastMessage?: string;
  messageCount?: number;
  updatedAt: string;
  isActive?: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateTitle: (id: string, newTitle: string) => void;
}

export const ConversationItem = ({
  id,
  title,
  lastMessage,
  messageCount = 0,
  updatedAt,
  isActive = false,
  onSelect,
  onDelete,
  onUpdateTitle,
}: ConversationItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleSaveTitle = () => {
    if (editedTitle.trim() && editedTitle !== title) {
      onUpdateTitle(id, editedTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  const timeAgo = formatDistanceToNow(new Date(updatedAt), { addSuffix: true });

  return (
    <div
      className={`group relative flex cursor-pointer flex-col gap-2 rounded-lg border p-3 transition-colors hover:bg-accent ${
        isActive ? "border-primary bg-accent" : ""
      }`}
      onClick={() => !isEditing && onSelect(id)}
    >
      {/* Title Section */}
      <div className="flex items-start justify-between gap-2">
        {isEditing ? (
          <div className="flex flex-1 items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveTitle();
                if (e.key === "Escape") handleCancelEdit();
              }}
              className="h-8 text-sm"
              autoFocus
              maxLength={100}
            />
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveTitle}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-1 items-start gap-2">
              <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium">{title}</h3>
                {lastMessage && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{lastMessage}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Conversation?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this conversation and all its messages. This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </>
        )}
      </div>

      {/* Footer Section */}
      {!isEditing && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{messageCount} messages</span>
          <span>{timeAgo}</span>
        </div>
      )}
    </div>
  );
};
