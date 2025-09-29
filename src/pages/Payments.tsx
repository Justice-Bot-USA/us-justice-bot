import React, { useState } from 'react';
import { PaymentOptions } from '@/components/PaymentOptions';
import { PaymentStatus } from '@/components/PaymentStatus';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const PaymentsPage: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  return (
    <div className="min-h-screen bg-background">
      <Header language={language} onLanguageChange={setLanguage} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Legal Bot Pricing & Payments</h1>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your legal assistance needs
            </p>
          </div>

          <Tabs defaultValue="pricing" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pricing">Pricing Plans</TabsTrigger>
              <TabsTrigger value="status">Payment Status</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pricing" className="mt-8">
              <PaymentOptions />
            </TabsContent>
            
            <TabsContent value="status" className="mt-8">
              <PaymentStatus />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};