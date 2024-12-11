// React-email
import {
    Html,
    Body,
    Head,
    Heading,
    Hr,
    Container,
    Preview,
    Section,
    Text,
    Img,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";

// Variables
import { BASE_URL } from "@/lib/variables";

type SendPdfEmailProps = {
    invoiceNumber: string;
};

export default function SendPdfEmail({ invoiceNumber }: SendPdfEmailProps) {
    const logo = `https://i.czl.net/r2/img/2024/12/675829b6933fb.png`;
    return (
        <Html>
            <Head />
            <Preview>
                您的发票 #{invoiceNumber} 已可供下载
            </Preview>
            <Tailwind>
                <Body className="bg-gray-100">
                    <Container>
                        <Section className="bg-white border-black-950 my-10 px-10 py-4 rounded-md">
                            <Img
                                src={logo}
                                alt="CZL Express Logo"
                                width={100}
                                height={80}
                            />
                            <Heading className="leading-tight">
                                感谢您使用 CZL Express发票生成器!
                            </Heading>

                            <Text>
                                我们很高兴地通知您，您的发票{" "}
                                <b>#{invoiceNumber}</b> 已准备好下载。
                                请查看随附的 PDF 文档。
                            </Text>

                            <Hr />

                            <Text>
                                此致，
                                <br/>
                                CZL Express
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
