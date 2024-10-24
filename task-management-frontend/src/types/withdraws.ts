
export enum WithdrawStatusLabelRequest {
    PENDING_FOR_OPERATOR_CONFIRM = 'Waiting',
    CONFIRMED_BY_OPERATOR = 'Approved',
    REJECTED_BY_OPERATOR = 'Not Approved',
}

export enum WithdrawStatusLabelList {
    PENDING_FOR_OPERATOR_CONFIRM = 'Pending',
    CONFIRMED_BY_BLOCKCHAIN = 'Confirmed',
    REJECTED_BY_BLOCKCHAIN = 'Failed'
}