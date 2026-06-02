// ShadCn
import { toast } from "@/components/ui/use-toast";

const useToasts = () => {
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

    const importInvoiceError = () => {
        toast({
            variant: "destructive",
            title: "Error",
            description: "导入发票时出现问题。请确保文件是有效的 JSON 导出。",
        });
    };

    return {
        newInvoiceSuccess,
        pdfGenerationSuccess,
        saveInvoiceSuccess,
        modifiedInvoiceSuccess,
        importInvoiceError,
    };
};

export default useToasts;
