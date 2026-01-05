import { StateColours } from "@/utils/quiz";

type LegendLabelProps = {
    stateColour: StateColours
    label: string
}

export function LegendLabel({stateColour, label}: LegendLabelProps) {
    return (
        <div className="flex flex-row items-left">
            <div className="w-[25px] h-[25px]" style={{ backgroundColor: `#${stateColour}`}} />
            <span className="ml-2">
                {label}
            </span>
        </div>
    );
}