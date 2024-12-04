import Footer from "@/components/navigation/footer";
import Navbar from "@/components/navigation/navbar";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const ContentLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center w-full">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default ContentLayout;
