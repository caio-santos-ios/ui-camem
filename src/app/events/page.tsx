import PageBreadcrumb from "@/components/pageBreadcrumb/PageBreadcrumb";
import { EventButtonCreate } from "@/components/pages/event/EventButtonCreate";
import EventTable from "@/components/pages/event/EventTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de Gestão | Eventos",
  description: "This is Next.js Form Elements page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

export default function EventPage() {
  return (
    <div>
      <PageBreadcrumb pageIcon="MdEvent" pageTitle="Eventos" pageSubTitle="" />
      <div className="flex justify-end mb-2">
        <EventButtonCreate />
      </div>
      <EventTable />
    </div>
  );
}