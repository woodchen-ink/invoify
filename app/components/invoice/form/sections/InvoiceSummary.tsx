"use client";

// Components
import {
    Charges,
    FormTextarea,
    SignatureModal,
    Subheading,
} from "@/app/components";

// Contexts
import { useTranslationContext } from "@/contexts/TranslationContext";
import { SignatureContextProvider } from "@/contexts/SignatureContext";

const InvoiceSummary = () => {
    const { _t } = useTranslationContext();

    return (
        <section>
            <Subheading>{_t("form.steps.summary.heading")}:</Subheading>
            <div className="flex flex-wrap gap-x-5 gap-y-10">
                <div className="flex flex-col gap-3">
                    <SignatureContextProvider>
                        {/* Signature dialog */}
                        <SignatureModal />
                    </SignatureContextProvider>

                    {/* Additional notes & Payment terms */}
                    <FormTextarea
                        name="details.additionalNotes"
                        label={_t("form.steps.summary.additionalNotes")}
                        placeholder="您的补充说明"
                    />
                    <FormTextarea
                        name="details.paymentTerms"
                        label={_t("form.steps.summary.paymentTerms")}
                        placeholder="Ex: Net 30"
                    />
                    <FormTextarea
                        name="details.typeOfExport"
                        label={_t("form.steps.summary.typeOfExport")}
                        placeholder="出口类型"
                        defaultValue="Permanent"
                    />
                    <FormTextarea
                        name="details.incoterm"
                        label={_t("form.steps.summary.incoterm")}
                        placeholder="贸易术语"
                        defaultValue="DAP-Delivered at Place"
                    />
                </div>

                {/* Final charges */}
                <Charges />
            </div>
        </section>
    );
};

export default InvoiceSummary;
