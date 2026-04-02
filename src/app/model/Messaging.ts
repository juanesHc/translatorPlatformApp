export interface SendEmailRequestDto{
    translationId: string;
    senderEmail: string;
    recipientEmail: string;
    subject: string;
    message: string;
}

export interface SendEmailResponseDto{
    message: string;
}