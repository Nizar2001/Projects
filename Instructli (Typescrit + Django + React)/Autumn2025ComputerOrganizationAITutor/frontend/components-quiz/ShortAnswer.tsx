import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import {ShortAnswerTypeData, BaseAnswerBoxProps, answerType} from "@/utils/quiz";

export type ShortAnswerProps = BaseAnswerBoxProps & {
    data: ShortAnswerTypeData,
    inputText: answerType,
    GetTextBoxHighlightColour: (selectedQuestionIndex: number, isEditing: boolean) => string,
};

export function ShortAnswer({GetTextBoxHighlightColour, onAnswerSelected, inputText, selectedQuestionIndex, data}: ShortAnswerProps) {

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onAnswerSelected) {
            onAnswerSelected(selectedQuestionIndex, event.target.value);
        }
    };

    function isDisabled() {
        return onAnswerSelected == null;
    }

    return (
        <div className={`h-full w-full ${GetTextBoxHighlightColour(selectedQuestionIndex, isEditing)}`}>
            <textarea
                className="w-full h-full bg-transparent outline-none border-none p-2 text-base text-black"
                id="myInput"
                placeholder="Type here..."
                value={typeof inputText == "string" ? inputText : ""}
                onFocus={() => setIsEditing(true)}
                onBlur={() => setIsEditing(false)}
                onChange={handleChange}
                disabled={isDisabled()}
            />
        </div>
    );
}