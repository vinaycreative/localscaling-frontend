import { Suspense } from "react";
import PaymentClient from "./PaymentClient";
import Loading from "@/components/Loading";

export default function PaymentPage() {
  return (
    <Suspense fallback={<Loading/>}>
      <PaymentClient />
    </Suspense>
  );
}
