import {MultipuleChoiceTypeData, BaseAnswerBoxProps} from "@/utils/quiz";

export type MultipuleChoiceProps = BaseAnswerBoxProps & {
    data: MultipuleChoiceTypeData,
    GetBGHighlightColour: (selectedQuestionIndex: number, item: string) => string,
    GetTextHighlightColour: (selectedQuestionIndex: number, item: string) => string,
};

export function MultipuleChoice({GetBGHighlightColour, GetTextHighlightColour, onAnswerSelected, selectedQuestionIndex, data}: MultipuleChoiceProps) {
    return (
        <ul className="flex flex-col gap-4">
            {data.choices.map((item, index) => (
                <li key={index}>
                    <button
                    onClick={() => onAnswerSelected && onAnswerSelected(selectedQuestionIndex, item)}
                    className={`rounded-lg overflow-hidden flex items-center justify-start w-full px-4 py-2 ${GetBGHighlightColour(selectedQuestionIndex, item)}`}>
                        <p className={`${ GetTextHighlightColour(selectedQuestionIndex, item)}`}>
                            {item}
                        </p>
                    </button>
                </li>
            ))}
        </ul>
    );
}