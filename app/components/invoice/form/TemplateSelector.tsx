"use client";

import Image from "next/image";

// RHF
import { useFormContext } from "react-hook-form";

// ShadCn
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

// Components
import {
    BaseButton,
    InvoiceTemplate1,
    InvoiceTemplate2,
} from "@/app/components";

// Icons
import { Check } from "lucide-react";

// Types
import { InvoiceType } from "@/types";

const TemplateSelector = () => {
    const { watch, setValue } = useFormContext<InvoiceType>();
    const formValues = watch();
    const templates = [
        {
            id: 1,
            name: "形式发票",
            description: "形式发票描述",
            img: "https://i-cf.czl.net/oracle/img/2024/12/67582d42bc805.png",
            component: <InvoiceTemplate1 {...formValues} />,
        },
        {
            id: 2,
            name: "商业发票",
            description: "商业发票描述",
            img: "https://i-cf.czl.net/oracle/img/2024/12/67582e487c917.png",
            component: <InvoiceTemplate2 {...formValues} />,
        },
    ];
    return (
        <>
            <div>
                <Label>选择发票模板:</Label>

                <div>
                    <Card>
                        <CardHeader>
                            模板
                            <CardDescription>
                                选择预定义模板
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="">
                            <div className="flex overflow-x-auto">
                                {templates.map((template, idx) => (
                                    <div
                                        key={idx}
                                        className="flex flex-col flex-shrink-0 mr-4 gap-y-3"
                                    >
                                        <p>{template.name}</p>

                                        <div className="relative">
                                            {formValues.details.pdfTemplate ===
                                                template.id && (
                                                <div className="shadow-lg absolute right-2 top-2 rounded-full bg-blue-300 dark:bg-blue-600">
                                                    <Check />
                                                </div>
                                            )}
                                            <Image
                                                src={template.img}
                                                alt={template.name}
                                                width={300}
                                                height={700}
                                                className="cursor-pointer rounded-lg border-2 hover:border-blue-600"
                                                onClick={() =>
                                                    setValue(
                                                        "details.pdfTemplate",
                                                        template.id
                                                    )
                                                }
                                                unoptimized
                                            />
                                            {/* {template.component} */}
                                        </div>

                                        <BaseButton
                                            onClick={() =>
                                                setValue(
                                                    "details.pdfTemplate",
                                                    template.id
                                                )
                                            }
                                        >
                                            选择
                                        </BaseButton>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default TemplateSelector;
