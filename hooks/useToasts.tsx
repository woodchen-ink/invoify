// ShadCn
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";

const useToasts = () => {
    type SendErrorType = {
        email: string;
        sendPdfToMail: (email: string) => void;
    };

    const newInvoiceSuccess = () => {
        toast({
            variant: "default",
            title: "创建新发票",
            description: "成功创建新发票",
        });
    };

    const pdfGenerationSuccess = () => {
        toast({
            variant: "default",
            title: "您的发票已生成！",
            description:
                "您可以预览、下载或从操作选项卡保存它",
        });
    };

    const saveInvoiceSuccess = () => {
        toast({
            variant: "default",
            title: "保存发票",
            description: "您的发票详情已保存",
        });
    };

    const modifiedInvoiceSuccess = () => {
        toast({
            variant: "default",
            title: "修改发票",
            description: "成功修改您的发票",
        });
    };

    const sendPdfSuccess = () => {
        toast({
            variant: "default",
            title: "Email sent",
            description: "您的发票已发送至指定邮箱",
        });
    };

    const sendPdfError = ({ email, sendPdfToMail }: SendErrorType) => {
        toast({
            variant: "destructive",
            title: "错误",
            description: "发送失败。请稍后再试",
            action: (
                <ToastAction
                    onClick={() => sendPdfToMail(email)}
                    altText="Try again"
                >
                    重试
                </ToastAction>
            ),
        });
    };

    const importInvoiceError = () => {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Something went importing the invoice. Make sure the file is a valid Invoify JSON export",
        });
    };

    return {
        newInvoiceSuccess,
        pdfGenerationSuccess,
        saveInvoiceSuccess,
        modifiedInvoiceSuccess,
        sendPdfSuccess,
        sendPdfError,
        importInvoiceError,
    };
};

export default useToasts;
