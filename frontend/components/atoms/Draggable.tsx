import React, { ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface DraggableProps {
  draggableId: string;
  index: number;
  isDragDisabled?: boolean;
  children: (provided: any, snapshot: { isDragging: boolean }) => ReactNode;
}

export function Draggable({ draggableId, children, isDragDisabled }: DraggableProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: draggableId,
    disabled: isDragDisabled,
  });

  return children(
    { dragHandleProps: listeners, draggableProps: attributes, innerRef: setNodeRef },
    { isDragging }
  );
}
