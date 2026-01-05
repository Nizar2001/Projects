
export type ProgressBarProps = {
    total: number,
    current: number
};

export function ProgressBar({total, current}: ProgressBarProps) {
    return (
        <div>
            <div className="bg-[#D9D9D9] shadow-lg dark:shadow-xl rounded-full overflow-hidden flex flex-col h-4">
                <div
                    className="h-full bg-[#36517D] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${100 * (current/total)}%` }}
                ></div>
            </div>
            <div className="mt-3" style={{ fontSize: '13px' }}>
                <p>
                    {current} of {total} questions answered
                </p>
            </div>
        </div>
    );
}