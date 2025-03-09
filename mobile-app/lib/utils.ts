import { ExpenseItem, FileExtract } from "./stubs/ocr-service-dev/ocr_service_pb";

export function computeAvgExpenseConfidence(expense: ExpenseItem.AsObject): number {
    let sum = 0;
    let count = 0;

    for (const key in expense.data) {
        if (!expense.data.hasOwnProperty(key)) {
            continue
        }
        const field = expense.data[key as keyof FileExtract.AsObject];
        if(!field || field instanceof String || typeof field === 'string' || field instanceof Number || typeof field === 'number') {
            continue
        }
        if((field.text === "" && field.confidence === 0)) {
            continue
        }
        sum += field.confidence;
        count++;
    }

    if (count === 0) {
        return 0;
    }

    return Math.round(((sum / count) + Number.EPSILON) * 100) / 100;
}