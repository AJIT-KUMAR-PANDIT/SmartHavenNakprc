import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Check, 
  Clock, 
  CreditCard, 
  Download, 
  History, 
  Package, 
  RefreshCw,
  Shield, 
  Star, 
  Zap,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth.jsx';

const MyPlan = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('subscription');
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentError, setPaymentError] = useState('');
  
  // Mock subscription data
  const [subscription, setSubscription] = useState({
    plan: 'premium',
    status: 'active',
    nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days from now
    price: 9.99,
    interval: 'monthly',
    features: [
      'Unlimited device connections',
      'Advanced automation features',
      'Energy usage analytics',
      'Priority customer support',
      'Cloud backup and restore',
      'Remote access from anywhere'
    ],
    usageStats: {
      devices: {
        used: 8,
        total: 'Unlimited'
      },
      scenes: {
        used: 12,
        total: 'Unlimited'
      },
      automations: {
        used: 7,
        total: 'Unlimited'
      },
      storage: {
        used: 128,
        total: 1024,
        unit: 'MB'
      }
    }
  });
  
  // Mock billing history
  const [billingHistory, setBillingHistory] = useState([
    {
      id: 'inv-2023112501',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
      amount: 9.99,
      status: 'paid',
      description: 'Premium Plan - Monthly Subscription',
      paymentMethod: 'Visa ending in 4242',
      downloadUrl: '#'
    },
    {
      id: 'inv-2023102501',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60), // 60 days ago
      amount: 9.99,
      status: 'paid',
      description: 'Premium Plan - Monthly Subscription',
      paymentMethod: 'Visa ending in 4242',
      downloadUrl: '#'
    },
    {
      id: 'inv-2023092501',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90), // 90 days ago
      amount: 9.99,
      status: 'paid',
      description: 'Premium Plan - Monthly Subscription',
      paymentMethod: 'Visa ending in 4242',
      downloadUrl: '#'
    }
  ]);
  
  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'card-1',
      type: 'credit_card',
      brand: 'visa',
      last4: '4242',
      expMonth: 12,
      expYear: 2025,
      isDefault: true
    }
  ]);
  
  // Mock pending payments
  const [pendingPayments, setPendingPayments] = useState([
    {
      id: 'pay-2023120101',
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
      amount: 9.99,
      description: 'Premium Plan - Monthly Subscription',
      status: 'upcoming'
    }
  ]);
  
  // Available plans
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 4.99,
      interval: 'monthly',
      description: 'Perfect for beginners with a few devices',
      features: [
        'Connect up to 5 devices',
        'Basic automation features',
        'Standard customer support',
        '100MB cloud storage',
        '7-day history'
      ],
      limits: {
        devices: 5,
        scenes: 10,
        automations: 5,
        storage: 100
      },
      recommended: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      interval: 'monthly',
      description: 'Ideal for smart home enthusiasts',
      features: [
        'Unlimited device connections',
        'Advanced automation features',
        'Energy usage analytics',
        'Priority customer support',
        'Cloud backup and restore',
        'Remote access from anywhere'
      ],
      limits: {
        devices: 'Unlimited',
        scenes: 'Unlimited',
        automations: 'Unlimited',
        storage: 1024
      },
      recommended: true
    },
    {
      id: 'family',
      name: 'Family',
      price: 14.99,
      interval: 'monthly',
      description: 'Share with up to 5 family members',
      features: [
        'All Premium features',
        'Family sharing (5 accounts)',
        'Access control and permissions',
        'Enhanced security features',
        '5GB cloud storage',
        '30-day history'
      ],
      limits: {
        devices: 'Unlimited',
        scenes: 'Unlimited',
        automations: 'Unlimited',
        storage: 5120
      },
      recommended: false
    }
  ];
  
  // Simulate loading Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          resolve(true);
        };
        script.onerror = () => {
          resolve(false);
        };
        document.body.appendChild(script);
      });
    };
    
    const initializeRazorpay = async () => {
      const res = await loadRazorpayScript();
      if (res) {
        setShowRazorpay(true);
      } else {
        setPaymentError('Razorpay SDK failed to load. Please check your internet connection.');
      }
    };
    
    initializeRazorpay();
  }, []);
  
  // Handle payment with Razorpay
  const handlePayment = async (amount) => {
    setIsLoadingPayment(true);
    setPaymentError('');
    setPaymentAmount(amount);
    
    // For demo purposes, we simulate the API call to create an order
    setTimeout(() => {
      if (!showRazorpay) {
        setPaymentError('Razorpay SDK is not loaded. Please refresh the page and try again.');
        setIsLoadingPayment(false);
        return;
      }
      
      // In a real implementation, this would be an API call to your backend
      // which would then create a Razorpay order and return the order ID
      const options = {
        key: "rzp_test_YOUR_KEY_ID", // This would be your actual Razorpay key in production
        amount: amount * 100, // Razorpay expects amount in smallest currency unit (paise for INR)
        currency: "USD",
        name: "SmartHaven",
        description: "Payment for Premium Plan Subscription",
        order_id: "order_" + Math.random().toString(36).substring(2, 15), // Would come from your backend
        handler: function (response) {
          // This function is called when payment is successful
          handlePaymentSuccess(response);
        },
        prefill: {
          name: currentUser?.username || "User",
          email: "user@example.com",
          contact: "+1234567890"
        },
        notes: {
          address: "SmartHaven Inc."
        },
        theme: {
          color: "#2563eb"
        },
        modal: {
          ondismiss: function () {
            setIsLoadingPayment(false);
          }
        }
      };
      
      try {
        // In a real app, this would be initialized with actual Razorpay
        // For this demo, we'll show an alert instead
        setIsLoadingPayment(false);
        alert(`In a live environment, this would open the Razorpay payment modal to process a payment of $${amount}.`);
        
        // Simulate successful payment
        handlePaymentSuccess({
          razorpay_payment_id: "pay_" + Math.random().toString(36).substring(2, 15),
          razorpay_order_id: options.order_id,
          razorpay_signature: "sig_" + Math.random().toString(36).substring(2, 15)
        });
        
        // The actual Razorpay implementation would be:
        // const paymentObject = new window.Razorpay(options);
        // paymentObject.open();
      } catch (error) {
        console.error('Error during payment initialization:', error);
        setPaymentError('Failed to initialize payment. Please try again.');
        setIsLoadingPayment(false);
      }
    }, 1500);
  };
  
  // Handle successful payment
  const handlePaymentSuccess = (response) => {
    // In a real app, you would verify the payment with your backend
    console.log('Payment successful:', response);
    
    // Update the billing history with the new payment
    const newPayment = {
      id: 'inv-' + new Date().toISOString().substring(0, 10).replace(/-/g, ''),
      date: new Date(),
      amount: paymentAmount,
      status: 'paid',
      description: 'Premium Plan - Monthly Subscription',
      paymentMethod: 'Razorpay Payment',
      downloadUrl: '#',
      paymentId: response.razorpay_payment_id
    };
    
    setBillingHistory(prev => [newPayment, ...prev]);
    
    // Remove from pending payments
    setPendingPayments(prev => prev.filter(payment => payment.amount !== paymentAmount));
    
    // Update next billing date
    setSubscription(prev => ({
      ...prev,
      nextBillingDate: new Date(prev.nextBillingDate.getTime() + 1000 * 60 * 60 * 24 * 30) // Add 30 days
    }));
    
    // Show success message (in a real app, you would use a toast notification)
    alert(`Payment of $${paymentAmount} was successful! Thank you.`);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Format expiry date
  const formatExpiry = (month, year) => {
    return `${String(month).padStart(2, '0')}/${String(year).slice(-2)}`;
  };
  
  // Get status badge for billing history
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-600 hover:bg-green-700">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-amber-600 hover:bg-amber-700">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-600 hover:bg-red-700">Failed</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Upcoming</Badge>;
      default:
        return <Badge className="bg-gray-600 hover:bg-gray-700">{status}</Badge>;
    }
  };
  
  // Calculate days until next billing
  const daysUntilNextBilling = () => {
    const today = new Date();
    const nextBilling = new Date(subscription.nextBillingDate);
    const diffTime = Math.abs(nextBilling - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Calculate usage percentage
  const calculateUsagePercentage = (used, total) => {
    if (total === 'Unlimited') return 0;
    return (used / total) * 100;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      <h1 className="text-3xl font-bold mb-2">My Plan</h1>
      <p className="text-gray-400 mb-6">Manage your subscription and billing</p>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="subscription" className="data-[state=active]:bg-[#2563eb]">
            Subscription
          </TabsTrigger>
          <TabsTrigger value="billing" className="data-[state=active]:bg-[#2563eb]">
            Billing
          </TabsTrigger>
          <TabsTrigger value="plans" className="data-[state=active]:bg-[#2563eb]">
            Available Plans
          </TabsTrigger>
        </TabsList>
        
        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5 text-blue-500" />
                    <span className="capitalize">{subscription.plan} Plan</span>
                  </CardTitle>
                  <CardDescription>
                    {formatCurrency(subscription.price)}/{subscription.interval}
                  </CardDescription>
                </div>
                <Badge className={`${
                  subscription.status === 'active'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-amber-600 hover:bg-amber-700'
                }`}>
                  {subscription.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium">Next billing date</p>
                    <p className="text-sm text-gray-400">
                      {formatDate(subscription.nextBillingDate)} 
                      <span className="ml-2 text-xs text-gray-500">
                        ({daysUntilNextBilling()} days remaining)
                      </span>
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-gray-700"
                  onClick={() => setActiveTab('plans')}
                >
                  Change Plan
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Your Plan Includes</h3>
                <ul className="space-y-2">
                  {subscription.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="mr-2 h-4 w-4 text-green-500 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">Usage Statistics</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Devices</span>
                      <span>
                        {subscription.usageStats.devices.used} / 
                        {subscription.usageStats.devices.total}
                      </span>
                    </div>
                    {subscription.usageStats.devices.total !== 'Unlimited' && (
                      <Progress 
                        value={calculateUsagePercentage(
                          subscription.usageStats.devices.used, 
                          subscription.usageStats.devices.total
                        )} 
                        className="h-2"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Scenes</span>
                      <span>
                        {subscription.usageStats.scenes.used} / 
                        {subscription.usageStats.scenes.total}
                      </span>
                    </div>
                    {subscription.usageStats.scenes.total !== 'Unlimited' && (
                      <Progress 
                        value={calculateUsagePercentage(
                          subscription.usageStats.scenes.used, 
                          subscription.usageStats.scenes.total
                        )} 
                        className="h-2"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Automations</span>
                      <span>
                        {subscription.usageStats.automations.used} / 
                        {subscription.usageStats.automations.total}
                      </span>
                    </div>
                    {subscription.usageStats.automations.total !== 'Unlimited' && (
                      <Progress 
                        value={calculateUsagePercentage(
                          subscription.usageStats.automations.used, 
                          subscription.usageStats.automations.total
                        )} 
                        className="h-2"
                      />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Storage</span>
                      <span>
                        {subscription.usageStats.storage.used} / 
                        {subscription.usageStats.storage.total} 
                        {subscription.usageStats.storage.unit}
                      </span>
                    </div>
                    <Progress 
                      value={calculateUsagePercentage(
                        subscription.usageStats.storage.used, 
                        subscription.usageStats.storage.total
                      )} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 items-start pt-0">
              <Button 
                variant="outline" 
                className="text-red-500 hover:text-red-400 hover:bg-red-900/20 border-red-900/20"
              >
                Cancel Subscription
              </Button>
              <p className="text-xs text-gray-500">
                Cancelling your subscription will remove premium features at the end of your current billing period.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          {/* Payment Methods */}
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-blue-500" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your payment methods and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map(method => (
                <div 
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-gray-800 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="p-2 rounded-md bg-[#121218] mr-4">
                      {method.brand === 'visa' && <i className="ri-visa-line text-xl text-blue-500"></i>}
                      {method.brand === 'mastercard' && <i className="ri-mastercard-line text-xl text-orange-500"></i>}
                      {method.brand === 'amex' && <i className="ri-bank-card-line text-xl text-purple-500"></i>}
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {method.brand} •••• {method.last4}
                        {method.isDefault && (
                          <Badge className="ml-2 bg-blue-600 hover:bg-blue-700">Default</Badge>
                        )}
                      </p>
                      <p className="text-sm text-gray-400">
                        Expires {formatExpiry(method.expMonth, method.expYear)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-700"
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-gray-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
          
          {/* Pending Payments */}
          {pendingPayments.length > 0 && (
            <Card className="bg-[#1e1e2e] border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-amber-500" />
                  Pending Payments
                </CardTitle>
                <CardDescription>
                  Payments that are due soon
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingPayments.map(payment => (
                  <div 
                    key={payment.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-800 rounded-lg gap-4"
                  >
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="mr-2 h-4 w-4" />
                        Due {formatDate(payment.dueDate)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                      <p className="font-medium text-lg">{formatCurrency(payment.amount)}</p>
                      <Button 
                        onClick={() => handlePayment(payment.amount)}
                        disabled={isLoadingPayment}
                      >
                        {isLoadingPayment ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>Pay Now</>
                        )}
                      </Button>
                    </div>
                  </div>
                ))}
                
                {paymentError && (
                  <div className="p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400 flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                    <div>{paymentError}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
          
          {/* Billing History */}
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="mr-2 h-5 w-5 text-blue-500" />
                Billing History
              </CardTitle>
              <CardDescription>
                View your past payment history and download invoices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {billingHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <History className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>No billing history available yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {billingHistory.map(invoice => (
                    <div 
                      key={invoice.id}
                      className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-medium">{invoice.description}</p>
                        <div className="flex flex-wrap items-center gap-x-3 text-sm text-gray-400">
                          <span>{formatDate(invoice.date)}</span>
                          <span>•</span>
                          <span>{invoice.id}</span>
                          <span>•</span>
                          <span>{invoice.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {getStatusBadge(invoice.status)}
                        <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-gray-700"
                          onClick={() => window.open(invoice.downloadUrl, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Available Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
              <Card 
                key={plan.id} 
                className={`bg-[#1e1e2e] border-gray-700 relative ${
                  plan.recommended ? 'border-blue-600 shadow-lg shadow-blue-600/10' : ''
                }`}
              >
                {plan.recommended && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Recommended
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    {plan.id === 'basic' && <Shield className="mr-2 h-5 w-5 text-gray-500" />}
                    {plan.id === 'premium' && <Star className="mr-2 h-5 w-5 text-amber-500" />}
                    {plan.id === 'family' && <Zap className="mr-2 h-5 w-5 text-purple-500" />}
                    {plan.name}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <span className="text-3xl font-bold">{formatCurrency(plan.price)}</span>
                    <span className="text-gray-400">/{plan.interval}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-400 mb-2">Plan includes:</p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="mr-2 h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center pt-2">
                  <Button 
                    variant={plan.id === subscription.plan ? "outline" : "default"} 
                    className={plan.id === subscription.plan ? "border-gray-700" : ""}
                    disabled={plan.id === subscription.plan}
                  >
                    {plan.id === subscription.plan ? "Current Plan" : "Select Plan"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>Plan Comparison</CardTitle>
              <CardDescription>Compare features across different plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead className="border-b border-gray-800">
                    <tr>
                      <th className="text-left pb-3">Feature</th>
                      {plans.map(plan => (
                        <th key={plan.id} className="text-center pb-3 capitalize">{plan.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr>
                      <td className="py-3">Price</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-3">
                          {formatCurrency(plan.price)}/{plan.interval}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Device Limit</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-3">
                          {plan.limits.devices}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Scene Limit</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-3">
                          {plan.limits.scenes}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Automation Limit</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-3">
                          {plan.limits.automations}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Cloud Storage</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-3">
                          {plan.limits.storage} MB
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Energy Analytics</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-3">
                          {plan.id === 'basic' ? (
                            <i className="ri-close-line text-red-500"></i>
                          ) : (
                            <i className="ri-check-line text-green-500"></i>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Family Sharing</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-3">
                          {plan.id === 'family' ? (
                            <i className="ri-check-line text-green-500"></i>
                          ) : (
                            <i className="ri-close-line text-red-500"></i>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3">Premium Support</td>
                      {plans.map(plan => (
                        <td key={plan.id} className="text-center py-3">
                          {plan.id === 'basic' ? (
                            <i className="ri-close-line text-red-500"></i>
                          ) : (
                            <i className="ri-check-line text-green-500"></i>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default MyPlan;