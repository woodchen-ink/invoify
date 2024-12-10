// 阴影 cn

import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

// 组件

import { BaseButton } from "@/app/components";

// 上下文

import { useSignatureContext } from "@/contexts/SignatureContext";

// 图标

import { Check, Trash2 } from "lucide-react";

// 类型

import { SignatureTabs } from "@/types";

type UploadSignatureProps = {
    handleSaveSignature: () => void;
};

const UploadSignature = ({ handleSaveSignature }: UploadSignatureProps) => {
    const {
        uploadSignatureRef,
        uploadSignatureImg,
        handleUploadSignatureChange,
        handleRemoveUploadedSignature,
    } = useSignatureContext();

    return (
        <TabsContent value={SignatureTabs.UPLOAD}>
            <Card className="border-none shadow-none">
                <CardContent className="space-y-2 p-0">
                    <div style={{ height: "15rem" }}>
                        {uploadSignatureImg ? (
                            <img
                                style={{
                                    borderRadius: "10px",
                                    width: "100%",
                                    height: "15rem",
                                }}
                                width={300}
                                src={uploadSignatureImg}
                            />
                        ) : (
                            <div>Upload image</div>
                        )}
                        {/* 在此上传文件 */}
                        <input
                            ref={uploadSignatureRef}
                            type="file"
                            onChange={handleUploadSignatureChange}
                            accept="image/*"
                        />
                    </div>
                </CardContent>
                <div className="flex justify-end gap-2 pt-2">
                    {/* 按钮和操作 */}
                    {uploadSignatureImg && (
                        <BaseButton
                            tooltipLabel="删除签名图片"
                            variant="outline"
                            onClick={handleRemoveUploadedSignature}
                        >
                            删除
                            <Trash2 />
                        </BaseButton>
                    )}
                    <BaseButton
                        tooltipLabel="保存更改"
                        disabled={!uploadSignatureImg}
                        onClick={handleSaveSignature}
                    >
                        完成
                        <Check />
                    </BaseButton>
                </div>
            </Card>
        </TabsContent>
    );
};

export default UploadSignature;
