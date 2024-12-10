"use client";

// 反应签名画布

import SignatureCanvas from "react-signature-canvas";

// 鲥鱼 CN

import { Card, CardContent } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

// 成分

import { BaseButton, SignatureColorSelector } from "@/app/components";

// 上下文

import { useSignatureContext } from "@/contexts/SignatureContext";

// 图标

import { Check, Eraser } from "lucide-react";

// 类型

import { SignatureTabs } from "@/types";

type DrawSignatureProps = {
    handleSaveSignature: () => void;
};

const DrawSignature = ({ handleSaveSignature }: DrawSignatureProps) => {
    const {
        signatureData,
        signatureRef,
        colors,
        selectedColor,
        handleColorButtonClick,
        clearSignature,
        handleCanvasEnd,
    } = useSignatureContext();

    return (
        <TabsContent value={SignatureTabs.DRAW}>
            <Card className="border-none shadow-none">
                <CardContent className="space-y-2 p-0">
                    <div
                        style={{
                            width: "100%",
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    >
                        {/* 签名画布用于绘制签名 */}
                        <SignatureCanvas
                            velocityFilterWeight={1} // 调整velocityFilterWeight，让笔变得更轻

                            minWidth={1.4} // 调整 minWidth 以获得更细的线条

                            maxWidth={1.4} // 调整 maxWidth 以获得更细的线条

                            throttle={0}
                            ref={signatureRef}
                            penColor={selectedColor}
                            canvasProps={{
                                style: {
                                    background: "#efefef",
                                    borderRadius: "10px",
                                    width: "100%",
                                    height: "15rem",
                                },
                            }}
                            onEnd={handleCanvasEnd}
                        />
                    </div>
                </CardContent>
                <div className="flex justify-between gap-2 pt-2">
                    {/* 颜色选择器 */}
                    <SignatureColorSelector
                        colors={colors}
                        selectedColor={selectedColor}
                        handleColorButtonClick={handleColorButtonClick}
                    />

                    {signatureData && (
                        <BaseButton
                            tooltipLabel="Clear the signature board"
                            variant="outline"
                            className="w-fit gap-2"
                            onClick={clearSignature}
                        >
                            Erase
                            <Eraser />
                        </BaseButton>
                    )}
                    <BaseButton
                        tooltipLabel="Save changes"
                        disabled={!signatureData}
                        onClick={handleSaveSignature}
                    >
                        Done
                        <Check />
                    </BaseButton>
                </div>
            </Card>
        </TabsContent>
    );
};

export default DrawSignature;
