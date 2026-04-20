import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import CustomCertificateForm from "@/components/pages/custom-certificate/CustomCertificateForm";
import TemplateForm from "@/components/pages/settings/template/TemplateForm";
import Button from "@/components/ui/button/Button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "CAMEM | Customizar Certificado",
  description:
    "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default async function CustomCertificateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div>
      <PageBreadcrumb pageIcon="MdBrush" pageTitle="Customizar Certificados" pageSubTitle="" />
      {/* <div className="flex justify-end mb-2">
        <Link href="/custom-certificates">
          <Button type="submit" variant="outline" size="sm">Voltar</Button>
        </Link>
      </div> */}
      <CustomCertificateForm id={id} />
    </div>
  );
}