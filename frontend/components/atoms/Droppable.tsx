import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";

interface DroppableProps {
  droppableId: string;
  isDropDisabled?: boolean;
  children: (provided: any, snapshot: { isDraggingOver: boolean }) => ReactNode;
}

export function Droppable({
  droppableId,
  children,
  isDropDisabled,
}: DroppableProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    disabled: isDropDisabled,
  });

  return children(
    { innerRef: setNodeRef, droppableProps: {} },
    { isDraggingOver: isOver },
  );
}
