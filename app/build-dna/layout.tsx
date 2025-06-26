'use client'; 
import React from "react";
import TopBanner from "../../components/TopBanner";
import DashboardLayout from "../../components/DashboardLayout";

export default function BuildDnaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout>
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-radial-gradient-purple opacity-40 blur-2xl"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-radial-gradient-blue opacity-40 blur-2xl"></div>
      </div>
      <div className="sticky top-0 z-30 w-full bg-black/80 backdrop-blur-md">
          <TopBanner
            title={<><span className="font-normal">BUILD</span> <span className="font-extrabold">DNA</span></>}
            subtitle={
              <>
                Build a DNA on Soundverse and earn passive income as your DNA is used by other creators.{' '}
                <a href="#" className="underline text-[#FFFFFF]">Learn more</a>
              </>
            }
          />
      </div>
      <div className="max-w-4xl w-full py-8 pr-8 pl-4 sm:pl-[99px]">
        {children}
      </div>
    </DashboardLayout>
  );
} 