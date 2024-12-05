import Footer from "@/components/navigation/footer";
import Navbar from "@/components/navigation/navbar";
import React, { Suspense } from "react";
import Loading from "./loading";
interface Props {
  children: React.ReactNode;
}

const ContentLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center w-full">
      <Navbar />
      <Suspense fallback={<Loading />} >
      {children}
      </Suspense>
      <Footer />
    </div>
  );
};

export default ContentLayout;
