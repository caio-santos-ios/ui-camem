import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import CertificateTable from "@/components/pages/custom-certificate/CertificateTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CAMEM | Customizar Certificados",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function CerticatePage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="MdBrush" pageTitle="Customizar Certificados" pageSubTitle="" />
      <CertificateTable />
    </div>
  );
}