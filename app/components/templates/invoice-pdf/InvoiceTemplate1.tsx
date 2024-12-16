import React from "react";

// Components
import { InvoiceLayout } from "@/app/components";

// Helpers
import { formatNumberWithCommas, isDataUrl } from "@/lib/helpers";

// Variables
import { DATE_OPTIONS } from "@/lib/variables";

// Types
import { InvoiceType } from "@/types";

const InvoiceTemplate = (data: InvoiceType) => {
    const { sender, receiver, details } = data;

    return (
        <InvoiceLayout data={data}>
            <div className="flex justify-between">
                <div>
                    {details.invoiceLogo && (
                        <img
                            src={details.invoiceLogo}
                            width={140}
                            height={100}
                            alt={`Logo of ${sender.companyName}`}
                        />
                    )}
                    <h1 className="mt-2 text-normal md:text-xl font-semibold text-blue-600">
                        {sender.companyName}
                    </h1>
                    <p className="text-gray-800 font-medium">{sender.individualName}</p>
                    <p className="text-sm  text-gray-500">
                        {sender.email}
                    </p>
                    <p className="text-sm  text-gray-500">
                        {sender.phone}
                    </p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                        Proforma Invoice #
                    </h2>
                    <span className="mt-1 block text-gray-500">
                        {details.invoiceNumber}
                    </span>
                    <address className="mt-4 not-italic text-gray-800">
                        {sender.address}
                        <br />
                        {sender.zipCode}, {sender.city}
                        <br />
                        {sender.country}
                        <br />
                    </address>
                </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                        Receiver:
                    </h3>
                    <h3 className="text-lg font-semibold text-gray-800">
                        {receiver.companyName}
                    </h3>
                    <p className="text-gray-700">{receiver.individualName}</p>
                    <p className="text-sm  text-gray-500">Email: {receiver.email}</p>
                    <p className="text-sm  text-gray-500">Phone: {receiver.phone}</p>
                    {receiver.customInputs?.map((input, index) => (
                        <p key={index} className="text-sm text-gray-500">
                            {input.key}: {input.value}
                        </p>
                    ))}
                    <div className="mt-2 not-italic text-gray-500 max-w-sm text-xs">
                        Address: {receiver.address} <br />
                        {receiver.city}, {receiver.zipCode}<br />
                        {receiver.country}
                    </div>
                </div>
                <div className="sm:text-right space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                        <dl className="grid sm:grid-cols-6 gap-x-3">
                            <dt className="col-span-3 font-semibold text-gray-800">
                                Invoice date:
                            </dt>
                            <dd className="col-span-3 text-gray-500">
                                {details.invoiceDate ?
                                    new Date(details.invoiceDate).toISOString().split('T')[0] :
                                    'N/A'
                                }
                            </dd>
                        </dl>
                        {details.dueDate && (
                            <dl className="grid sm:grid-cols-6 gap-x-3">
                                <dt className="col-span-3 font-semibold text-gray-800">
                                    Due date:
                                </dt>
                                <dd className="col-span-3 text-gray-500">
                                    {details.invoiceDate ?
                                        new Date(details.invoiceDate).toISOString().split('T')[0] :
                                        'N/A'
                                    }
                                </dd>
                            </dl>
                        )}
                        {details.airwaybillNumber && (
                            <dl className="grid sm:grid-cols-6 gap-x-3">
                                <dt className="col-span-3 font-semibold text-gray-800">
                                    AWB No:
                                </dt>
                                <dd className="col-span-3 text-gray-500">
                                    {details.airwaybillNumber}
                                </dd>
                            </dl>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-3">
                <div className="border border-gray-200 p-1 rounded-lg space-y-1">
                    <div className="hidden sm:grid sm:grid-cols-6">
                        <div className="sm:col-span-2 text-xs font-medium text-gray-500 uppercase">
                            Full Description of Goods
                        </div>
                        <div className="text-left text-xs font-medium text-gray-500 uppercase">
                            HS Code
                        </div>
                        <div className="text-left text-xs font-medium text-gray-500 uppercase">
                            Qty
                        </div>
                        <div className="text-left text-xs font-medium text-gray-500 uppercase">
                            Unit Value
                        </div>
                        <div className="text-right text-xs font-medium text-gray-500 uppercase">
                            Total Value
                        </div>

                    </div>
                    <div className="hidden sm:block border-b border-gray-200"></div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-1">
                        {details.items.map((item, index) => (
                            <React.Fragment key={index}>
                                <div className="col-span-full sm:col-span-2 border-b border-gray-300 flex justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800 whitespace-pre-line">{item.name}</p>
                                        <p className="text-xs text-gray-600 whitespace-pre-line">{item.description}</p>
                                    </div>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="text-gray-800 truncate">{item.hsCode}</p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="text-gray-800">{item.quantity}</p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="text-gray-800">{item.unitPrice} {details.currency}</p>
                                </div>
                                <div className="border-b border-gray-300">
                                    <p className="sm:text-right text-gray-800">{item.total} {details.currency}</p>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="sm:hidden border-b border-gray-200"></div>
                </div>
            </div>

            <div className="mt-2 flex sm:justify-end">
                <div className="sm:text-right space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-2">
                        <dl className="grid sm:grid-cols-5 gap-x-3">
                            <dt className="col-span-3 font-semibold text-gray-800">
                                Total Declared Value:
                            </dt>
                            <dd className="col-span-2 text-gray-500">
                                {formatNumberWithCommas(
                                    Number(details.subTotal)
                                )}{" "}
                                {details.currency}
                            </dd>
                        </dl>
                        {details.discountDetails?.amount != undefined &&
                            details.discountDetails?.amount > 0 && (
                                <dl className="grid sm:grid-cols-5 gap-x-3">
                                    <dt className="col-span-3 font-semibold text-gray-800">
                                        Discount:
                                    </dt>
                                    <dd className="col-span-2 text-gray-500">
                                        {details.discountDetails.amountType ===
                                            "amount"
                                            ? `- ${details.discountDetails.amount} ${details.currency}`
                                            : `- ${details.discountDetails.amount}%`}
                                    </dd>
                                </dl>
                            )}
                        {details.taxDetails?.amount != undefined &&
                            details.taxDetails?.amount > 0 && (
                                <dl className="grid sm:grid-cols-5 gap-x-3">
                                    <dt className="col-span-3 font-semibold text-gray-800">
                                        Tax:
                                    </dt>
                                    <dd className="col-span-2 text-gray-500">
                                        {details.taxDetails.amountType ===
                                            "amount"
                                            ? `+ ${details.taxDetails.amount} ${details.currency}`
                                            : `+ ${details.taxDetails.amount}%`}
                                    </dd>
                                </dl>
                            )}
                        {details.shippingDetails?.cost != undefined &&
                            details.shippingDetails?.cost > 0 && (
                                <dl className="grid sm:grid-cols-5 gap-x-3">
                                    <dt className="col-span-3 font-semibold text-gray-800">
                                        Shipping:
                                    </dt>
                                    <dd className="col-span-2 text-gray-500">
                                        {details.shippingDetails.costType ===
                                            "amount"
                                            ? `+ ${details.shippingDetails.cost} ${details.currency}`
                                            : `+ ${details.shippingDetails.cost}%`}
                                    </dd>
                                </dl>
                            )}
                        <dl className="grid sm:grid-cols-5 gap-x-3">
                            <dt className="col-span-3 font-semibold text-gray-800">
                                Total:
                            </dt>
                            <dd className="col-span-2 text-gray-500">
                                {formatNumberWithCommas(
                                    Number(details.totalAmount)
                                )}{" "}
                                {details.currency}
                            </dd>
                        </dl>
                        {details.totalAmountInWords && (
                            <dl className="grid sm:grid-cols-5 gap-x-3">
                                <dt className="col-span-3 font-semibold text-gray-800">
                                    Total in words:
                                </dt>
                                <dd className="col-span-2 text-gray-500">
                                    <em>
                                        {details.totalAmountInWords}{" "}
                                        {details.currency}
                                    </em>
                                </dd>
                            </dl>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                    <p className="font-semibold text-blue-600">Type of Export:</p>
                    <p className="font-regular text-gray-800">
                        {details.typeOfExport || "Permanent"}
                    </p>
                </div>
                <div>
                    <p className="font-semibold text-blue-600">Incoterm:</p>
                    <p className="font-regular text-gray-800">
                        {details.incoterm || "DAP-Delivered at Place"}
                    </p>
                </div>
            </div>

            <div>
                <div className="my-4">
                    {details.additionalNotes && (
                        <div className="my-2 flex items-center">
                            <p className="font-semibold text-blue-600 mr-2">Additional notes:</p>
                            <p className="font-regular text-gray-800">{details.additionalNotes}</p>
                        </div>
                    )}
                    {details.paymentTerms && (
                        <div className="my-2 flex items-center">
                            <p className="font-semibold text-blue-600 mr-2">Payment terms:</p>
                            <p className="font-regular text-gray-800">{details.paymentTerms}</p>
                        </div>
                    )}
                    {details.paymentInformation?.bankName && (
                        <div className="my-2">
                            <span className="font-semibold text-md text-gray-800">
                                Please send the payment to this address
                                <p className="text-sm">
                                    Bank: {details.paymentInformation?.bankName}
                                </p>
                                <p className="text-sm">
                                    Account name:{" "}
                                    {details.paymentInformation?.accountName}
                                </p>
                                <p className="text-sm">
                                    Account no:{" "}
                                    {details.paymentInformation?.accountNumber}
                                </p>
                            </span>
                        </div>
                    )}
                    <p className="text-sm text-gray-500 mt-4">I/We hereby certify that the information of this invoice is true and correct and that the contents of this shipment are as stated above.</p>
                </div>
            </div>

            {/* Signature */}
            {details?.signature?.data && isDataUrl(details?.signature?.data) ? (
                <div className="mt-6 flex flex-row items-center">
                    <p className="font-semibold text-gray-800 mr-2">Signature:</p>
                    <img
                        src={details.signature.data}
                        width={120}
                        height={60}
                        alt={`Signature of ${sender.companyName}`}
                    />
                </div>
            ) : details.signature?.data ? (
                <div className="mt-6 flex flex-row items-center">
                    <p className="text-gray-800 mr-2">Signature:</p>
                    <p
                        style={{
                            fontSize: 30,
                            fontWeight: 400,
                            fontFamily: `${details.signature.fontFamily}, cursive`,
                            color: "black",
                        }}
                    >
                        {details.signature.data}
                    </p>
                </div>
            ) : null}
            {sender.companyName && (
                <div className="mt-8 flex flex-row">
                    <p className="font-semibold text-gray-800 mr-2">Name of Company: </p>
                    <p className="font-normal text-gray-500">{sender.companyName}</p>
                </div>
            )}
        </InvoiceLayout>
    );
};

export default InvoiceTemplate;
