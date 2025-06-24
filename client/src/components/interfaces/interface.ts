export interface redirectObject {
    address: string;
    status_code: number;
    redirect_url: string;
    expected_url?: string;
}

export interface tableData {
    jobId: number,
    status: string,
    createdAt: string
}