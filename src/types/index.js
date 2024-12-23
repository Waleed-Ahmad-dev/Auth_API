export function getErrorMessage(error) {
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unknown error occurred';
}
