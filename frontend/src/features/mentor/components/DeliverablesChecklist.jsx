import React from "react";
import { ClipboardCheck, Plus, X, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Sortable Item Wrapper
function SortableItem({ id, index, onRemove, register, errors }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 p-3.5 bg-white border ${
        errors?.deliverables?.[index] ? "border-red-300 bg-red-50/20" : "border-gray-200"
      } rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all`}
    >
      {/* Grab Handle */}
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Title Input */}
      <div className="flex-1">
        <input
          type="text"
          {...register(`deliverables.${index}.title`)}
          placeholder="e.g., GitHub Repository, PDF Report..."
          className="w-full bg-transparent border-0 outline-none focus:ring-0 text-sm font-semibold text-gray-800"
        />
        {errors?.deliverables?.[index]?.title && (
          <p className="text-[10px] text-red-500 font-medium mt-0.5">
            {errors.deliverables[index].title.message}
          </p>
        )}
      </div>

      {/* Required checkbox */}
      <label className="flex items-center gap-1.5 cursor-pointer select-none border-l border-gray-200 pl-3">
        <input
          type="checkbox"
          {...register(`deliverables.${index}.required`)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
        />
        <span className="text-xs font-semibold text-gray-600">Required</span>
      </label>

      {/* Delete button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function DeliverablesChecklist({
  register,
  errors,
  deliverablesFields,
  appendDeliverable,
  removeDeliverable,
  moveDeliverable,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Avoid triggering drag on click
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = deliverablesFields.findIndex((f) => f.id === active.id);
      const newIndex = deliverablesFields.findIndex((f) => f.id === over.id);
      moveDeliverable(oldIndex, newIndex);
    }
  };

  const handleAdd = () => {
    appendDeliverable({
      id: `del-${Date.now()}`,
      title: "",
      required: true,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Required Deliverables</h3>
            <p className="text-xs text-gray-500">Configure what files, URLs, or artifacts students must submit.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-200 text-blue-600 bg-blue-50 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Item
        </button>
      </div>

      {/* Drag and drop Context */}
      {deliverablesFields.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={deliverablesFields.map((f) => f.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {deliverablesFields.map((field, index) => (
                <SortableItem
                  key={field.id}
                  id={field.id}
                  index={index}
                  onRemove={removeDeliverable}
                  register={register}
                  errors={errors}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <p className="text-xs text-gray-400 font-medium">No deliverables added. Click 'Add Item' to define deliverables.</p>
        </div>
      )}

      {errors.deliverables && !Array.isArray(errors.deliverables) && (
        <p className="text-xs text-red-500 font-medium">{errors.deliverables.message}</p>
      )}
    </div>
  );
}
