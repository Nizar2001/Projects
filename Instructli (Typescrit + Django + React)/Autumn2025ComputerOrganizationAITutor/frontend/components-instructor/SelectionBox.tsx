import { Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export type SelectionItem = {
    id: number;
    icon: string;
    title: string;
    length: number;
    quantifier: string;
};

type SelectionBoxProps = {
    title: string;
    items: SelectionItem[];
    onClick?: (id: number) => void;
    onAdd?: () => void;
    onDelete?: (id: number) => void;
    onEdit?: (id: number) => void;
    onEditName?: (id: number, newName: string) => void;
    onEditIcon?: (id: number, newIcon: string) => void;
    availableIcons?: string[];
}

export function SelectionBox({title, items, onClick, onAdd, onDelete, onEdit, onEditName, onEditIcon, availableIcons}: SelectionBoxProps) {
    const [editingItemId, setEditingItemId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState("");
    const [iconPopupId, setIconPopupId] = useState<number | null>(null);

    const startEditingName = (item: SelectionItem) => {
        if (onEditName == null) {
            return;
        }
        setEditingItemId(item.id);
        setEditingName(item.title);
    };

    const stopEditingName = (id: number) => {
        if (onEditName == null) {
            return;
        }
        onEditName(id, editingName);
        setEditingItemId(null);
    };

    const startSelectingIcon = (id: number) => {
        if (onEditIcon == null) {
            return;
        }
        setIconPopupId(id);
    };

    const stopSelectingIcon = (icon: string) => {
        if (onEditIcon == null) {
            return;
        }
        if (iconPopupId !== null) {
            onEditIcon(iconPopupId, icon);
        }
        setIconPopupId(null);
    };

    return (
        <section>
            {/* Section header */}
            {onEdit != null && (
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-medium">{title}</h2>
                    <div className="flex items-center gap-2 text-gray-700 select-none">
                        <h2 className="text-3xl font-medium">All</h2>
                        <div 
                            className="rounded-full bg-[#1C1D1D]/5 w-13 h-13 flex justify-center items-center transition cursor-pointer"
                            onClick={() => onAdd && onAdd()}
                        >
                            <Plus size={20} />
                        </div>
                    </div>
                </div>
            )}
            {/* Grid of cards */}
            <div className="grid lg:grid-cols-3 gap-6">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white rounded-2xl p-6 shadow-sm transition cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between ${onClick != null && "cursor-pointer" || ""}`}
                        onClick = {() => onClick && onClick(item.id)}
                    >
                        {/* Top row: icon and edit/delete */}
                        <div className="flex justify-between items-start">
                            <div
                                className={`text-4xl w-22 h-22 bg-[#1C1D1D]/5 rounded-2xl flex justify-center ${onEdit != null && "cursor-pointer" || ""}`}
                                style = {{}}
                                onClick={() => startSelectingIcon(item.id)}
                            >
                                <Image
                                    src={item.icon}
                                    alt="Icon"
                                    width={100}
                                    height={100}
                                    className="object-cover"
                                />
                            </div>
                            {onEdit != null && (
                                <div className="flex gap-2">
                                    <Pencil
                                        size={18}
                                        className="text-green-500 cursor-pointer hover:text-green-600"
                                        onClick={() => onEdit && onEdit(item.id)}
                                    />
                                    <Trash2
                                        size={18}
                                        className="text-red-500 cursor-pointer hover:text-red-600"
                                        onClick={() => onDelete && onDelete(item.id)}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Bottom text: title editing */}
                        <div className="mt-6">
                            {editingItemId === item.id ? (
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) => setEditingName(e.target.value)}
                                    onBlur={() => stopEditingName(item.id)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") stopEditingName(item.id);
                                    }}
                                    autoFocus
                                    className={`border-b border-gray-400 text-lg font-medium w-full ${onEdit != null && "focus:outline-none" || ""}`}
                                />
                            ) : (
                                <h3
                                    className={`text-lg font-medium ${onEdit != null && "cursor-pointer hover:underline" || ""}`}
                                    onClick={() => startEditingName(item)}
                                >
                                    {item.title}
                                </h3>
                            )}
                            <p className="text-gray-500 text-sm">{item.length} {item.quantifier}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Icon selection popup */}
            {iconPopupId !== null && availableIcons != null && (
                <div 
                    className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
                    onClick={() => setIconPopupId(null)}
                >
                    <div 
                        className="bg-white p-6 rounded-xl flex flex-wrap gap-4 max-w-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {availableIcons.map((icon) => (
                            <div
                                key={icon}
                                className="w-20 h-20 cursor-pointer border rounded border-2 border-[#36517D] hover:border-[#b6c8e3]"
                                onClick={() => stopSelectingIcon(icon)}
                            >
                                <Image src={icon} alt="" width={80} height={80} className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
