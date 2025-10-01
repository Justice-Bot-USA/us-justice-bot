import React, { useState } from 'react';
import { PaymentOptions } from '@/components/PaymentOptions';
import { PaymentStatus } from '@/components/PaymentStatus';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SEOHead } from '@/components/SEOHead';

export const PaymentsPage: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Pricing & Payments - US Justice Bot"
        description="Choose the perfect legal assistance plan. Monthly ($79.99), Yearly ($499.99), or Pay-per-form ($5.99). Professional legal guidance for all Americans."
        keywords="legal subscription, legal pricing, legal payments, monthly legal plan, yearly legal plan"
        url="https://justicebot-usa.com/payments"
      />
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