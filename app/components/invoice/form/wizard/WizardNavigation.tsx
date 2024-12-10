"use client";

// React Wizard
import { useWizard } from "react-use-wizard";

// Components
import { BaseButton } from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";

// Icons
import { ArrowLeft, ArrowRight } from "lucide-react";

const WizardNavigation = () => {
    const { isFirstStep, isLastStep, handleStep, previousStep, nextStep } =
        useWizard();

    const { _t } = useTranslationContext();
    return (
        <div className="flex justify-end gap-5">
            {!isFirstStep && (
                <BaseButton
                    tooltipLabel="返回上一步"
                    onClick={previousStep}
                >
                    <ArrowLeft />
                    {_t("form.wizard.back")}
                </BaseButton>
            )}
            <BaseButton
                tooltipLabel="前往下一步"
                disabled={isLastStep}
                onClick={nextStep}
            >
                {_t("form.wizard.next")}
                <ArrowRight />
            </BaseButton>
        </div>
    );
};

export default WizardNavigation;
