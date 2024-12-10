"use client";

// RHF
import { useFieldArray, useFormContext } from "react-hook-form";

// Components
import {
    BaseButton,
    FormCustomInput,
    FormInput,
    Subheading,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// Icons
import { Plus } from "lucide-react";

const BillFromSection = () => {
    const { control } = useFormContext();

    const { _t } = useTranslationContext();

    const CUSTOM_INPUT_NAME = "sender.customInputs";
    const { fields, append, remove } = useFieldArray({
        control: control,
        name: CUSTOM_INPUT_NAME,
    });

    const addNewCustomInput = () => {
        append({
            key: "",
            value: "",
        });
    };

    const removeCustomInput = (index: number) => {
        remove(index);
    };

    return (
        <section className="flex flex-col gap-3">
            <Subheading>{_t("form.steps.fromAndTo.billFrom")}:</Subheading>

            <FormInput
                name="sender.companyName"
                label={_t("form.steps.fromAndTo.companyName")}
                placeholder="请输入公司名"
            />
            <FormInput
                name="sender.individualName"
                label={_t("form.steps.fromAndTo.individualName")}
                placeholder="请输入人名"
            />
            <FormInput
                name="sender.address"
                label={_t("form.steps.fromAndTo.address")}
                placeholder="请输入地址"
            />
            <FormInput
                name="sender.zipCode"
                label={_t("form.steps.fromAndTo.zipCode")}
                placeholder="请输入邮政编码"
            />
            <FormInput
                name="sender.city"
                label={_t("form.steps.fromAndTo.city")}
                placeholder="请输入城市"
            />
            <FormInput
                name="sender.country"
                label={_t("form.steps.fromAndTo.country")}
                placeholder="请输入国家"
            />
            <FormInput
                name="sender.email"
                label={_t("form.steps.fromAndTo.email")}
                placeholder="请输入邮箱"
            />
            <FormInput
                name="sender.phone"
                label={_t("form.steps.fromAndTo.phone")}
                placeholder="请输入电话号码"
            />

            {/* //? key = field.id fixes a bug where wrong field gets deleted  */}
            {fields?.map((field, index) => (
                <FormCustomInput
                    key={field.id}
                    index={index}
                    location={CUSTOM_INPUT_NAME}
                    removeField={removeCustomInput}
                />
            ))}

            <BaseButton
                tooltipLabel="添加发件人自定义输入"
                size="sm"
                variant="link"
                className="w-fit"
                onClick={addNewCustomInput}
            >
                <Plus />
                {_t("form.steps.fromAndTo.addCustomInput")}
            </BaseButton>
        </section>
    );
};

export default BillFromSection;
