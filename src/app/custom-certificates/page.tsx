import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import { CustomCertificateButtonCreate } from "@/components/pages/custom-certificate/CustomCertificateButtonCreate";
import CustomCertificateTable from "@/components/pages/custom-certificate/CustomCertificateTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CAMEM | Customizar Certificados",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function CerticatePage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="MdBrush" pageTitle="Customizar Certificados" pageSubTitle="" />
      <div className="flex justify-end mb-2">
        <CustomCertificateButtonCreate />
      </div>
      <CustomCertificateTable />
    </div>
  );
}