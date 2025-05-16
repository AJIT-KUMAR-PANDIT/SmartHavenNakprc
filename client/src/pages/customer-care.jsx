import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Check, Clock, HelpCircle, MessageSquare, PhoneCall, RefreshCw, Send, User } from 'lucide-react';
import { addLog } from '@/lib/db';

const CustomerCare = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketCategory, setTicketCategory] = useState('technical');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Demo support tickets
  const [supportTickets, setSupportTickets] = useState([
    {
      id: 'ticket-1',
      subject: 'Device connection issue',
      message: 'My living room light keeps disconnecting from the network. I\'ve tried resetting it multiple times.',
      status: 'open',
      category: 'technical',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      replies: [
        {
          author: 'Support Agent',
          message: 'Thank you for reporting this issue. Please try the following steps: 1) Power cycle the device, 2) Check if your Wi-Fi signal is strong enough, 3) Update the device firmware.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
        }
      ]
    },
    {
      id: 'ticket-2',
      subject: 'Billing inquiry',
      message: 'I was charged twice for my premium subscription this month. Please help resolve this.',
      status: 'in-progress',
      category: 'billing',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
      lastUpdate: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
      replies: [
        {
          author: 'Support Agent',
          message: 'I apologize for the inconvenience. I\'ve checked your account and confirmed the double charge. Our finance team will process a refund within 3-5 business days.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12) // 12 hours ago
        }
      ]
    }
  ]);

  // FAQs data
  const faqs = [
    {
      question: 'How do I connect a new device to SmartHaven?',
      answer: 'To connect a new device, go to the Devices page and tap the "+" button. Then follow the on-screen instructions to pair your device with the app. Make sure your device is powered on and in pairing mode before starting this process.'
    },
    {
      question: 'What should I do if my device goes offline?',
      answer: 'If your device goes offline, try these troubleshooting steps: 1) Check if the device is powered on, 2) Ensure your Wi-Fi network is working properly, 3) Move the device closer to your router if signal strength is low, 4) Restart the device, and 5) If problems persist, try removing the device from the app and adding it again.'
    },
    {
      question: 'How do I set up automation routines?',
      answer: 'To create an automation, navigate to the Automations page and tap "Create New Automation." You can then set triggers (like time of day, device status, or location) and actions (turn devices on/off, adjust settings). You can also create conditions for when the automation should run.'
    },
    {
      question: 'Can I control my devices when I\'m away from home?',
      answer: 'Yes, SmartHaven allows you to control your connected devices from anywhere with an internet connection. Make sure your home hub stays connected to the internet for remote access to work properly.'
    },
    {
      question: 'How do I update device firmware?',
      answer: 'Device firmware updates are typically handled automatically. However, you can manually check for updates by going to the device details page and tapping on "Check for Updates" in the settings menu.'
    },
    {
      question: 'What\'s the difference between scenes and automations?',
      answer: 'Scenes are groups of device settings that you can activate with a single tap. For example, a "Movie Night" scene might dim the lights and turn on the TV. Automations are rules that run automatically based on triggers like time, location, or device status without requiring manual activation.'
    },
    {
      question: 'How do I cancel my subscription?',
      answer: 'To cancel your subscription, go to the "My Plan" page, select "Manage Subscription," and then choose "Cancel Subscription." You\'ll continue to have access to premium features until the end of your current billing period.'
    }
  ];

  // Contact methods
  const contactMethods = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: <MessageSquare className="h-6 w-6" />,
      availability: 'Available 24/7',
      action: 'Start Chat',
      enabled: true
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with a support representative',
      icon: <PhoneCall className="h-6 w-6" />,
      availability: 'Mon-Fri, 9am-6pm',
      action: 'Call Now',
      phoneNumber: '+1-888-SMART-HOME',
      enabled: true
    },
    {
      title: 'Email Support',
      description: 'Get help via email',
      icon: <Send className="h-6 w-6" />,
      availability: 'Response within 24hrs',
      action: 'Send Email',
      email: 'support@smarthaven.example.com',
      enabled: true
    }
  ];

  // Submit a new support ticket
  const handleSubmitTicket = (e) => {
    e.preventDefault();
    
    if (!ticketSubject || !ticketMessage) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    // Simulate API call to create a ticket
    setTimeout(() => {
      const newTicket = {
        id: `ticket-${Date.now()}`,
        subject: ticketSubject,
        message: ticketMessage,
        status: 'open',
        category: ticketCategory,
        createdAt: new Date(),
        lastUpdate: new Date(),
        replies: []
      };
      
      setSupportTickets(prev => [newTicket, ...prev]);
      setIsSubmitting(false);
      setSuccessMessage('Your support ticket has been submitted successfully. Our team will get back to you soon.');
      
      // Clear form
      setTicketSubject('');
      setTicketMessage('');
      
      // Add to log
      addLog('Support', `New support ticket created: ${ticketSubject}`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }, 1500);
  };

  // Format date to readable string
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge based on ticket status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-600 hover:bg-blue-700">Open</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-600 hover:bg-amber-700">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-600 hover:bg-green-700">Resolved</Badge>;
      case 'closed':
        return <Badge className="bg-gray-600 hover:bg-gray-700">Closed</Badge>;
      default:
        return <Badge className="bg-gray-600 hover:bg-gray-700">{status}</Badge>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      <h1 className="text-3xl font-bold mb-2">Customer Care</h1>
      <p className="text-gray-400 mb-6">Get help and support for your SmartHaven system</p>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="contact" className="data-[state=active]:bg-[#2563eb]">
            Contact Support
          </TabsTrigger>
          <TabsTrigger value="tickets" className="data-[state=active]:bg-[#2563eb]">
            My Tickets
          </TabsTrigger>
          <TabsTrigger value="faq" className="data-[state=active]:bg-[#2563eb]">
            FAQs
          </TabsTrigger>
        </TabsList>
        
        {/* Contact Support Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="bg-[#1e1e2e] border-gray-700">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-blue-900/20 rounded-full mb-4">
                      {method.icon}
                    </div>
                    <h3 className="text-lg font-medium mb-1">{method.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{method.description}</p>
                    <p className="text-xs text-gray-500 mb-4">{method.availability}</p>
                    
                    <Button 
                      disabled={!method.enabled}
                      onClick={() => {
                        if (method.title === 'Phone Support' && method.phoneNumber) {
                          window.location.href = `tel:${method.phoneNumber}`;
                        } else if (method.title === 'Email Support' && method.email) {
                          window.location.href = `mailto:${method.email}`;
                        } else if (method.title === 'Live Chat') {
                          // Open chat window (would be implemented with a real chat service)
                          alert('Chat functionality would be integrated with a real chat service in production.');
                        }
                      }}
                    >
                      {method.action}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>Our team will respond to your inquiry within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket-subject">Subject</Label>
                  <Input 
                    id="ticket-subject" 
                    placeholder="Briefly describe your issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="bg-[#121218] border-gray-700"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ticket-category">Category</Label>
                  <select
                    id="ticket-category"
                    value={ticketCategory}
                    onChange={(e) => setTicketCategory(e.target.value)}
                    className="w-full h-10 px-3 py-2 bg-[#121218] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing & Subscription</option>
                    <option value="account">Account Management</option>
                    <option value="feedback">Feedback & Suggestions</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ticket-message">Message</Label>
                  <Textarea 
                    id="ticket-message" 
                    placeholder="Please provide details about your issue or question"
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="bg-[#121218] border-gray-700 min-h-[150px]"
                    required
                  />
                </div>
                
                {errorMessage && (
                  <div className="p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400">
                    {errorMessage}
                  </div>
                )}
                
                {successMessage && (
                  <div className="p-3 bg-green-900/20 border border-green-800 rounded-md text-green-400">
                    {successMessage}
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Ticket
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* My Tickets Tab */}
        <TabsContent value="tickets" className="space-y-6">
          {supportTickets.length === 0 ? (
            <Card className="bg-[#1e1e2e] border-gray-700">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <HelpCircle className="h-16 w-16 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium">No Support Tickets</h3>
                <p className="text-gray-400 mb-4">You haven't created any support tickets yet</p>
                <Button onClick={() => setActiveTab('contact')}>
                  Create a Ticket
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {supportTickets.map(ticket => (
                <Card key={ticket.id} className="bg-[#1e1e2e] border-gray-700">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                        <CardDescription>
                          <span className="capitalize">{ticket.category}</span> • Ticket #{ticket.id.split('-')[1]}
                        </CardDescription>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-[#171720] rounded-md">
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-400">You</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-300">{ticket.message}</p>
                    </div>
                    
                    {/* Replies */}
                    {ticket.replies.map((reply, index) => (
                      <div key={index} className="p-3 bg-[#171720] rounded-md border-l-2 border-blue-600">
                        <div className="flex items-center mb-2">
                          <User className="h-4 w-4 mr-2 text-blue-400" />
                          <span className="text-sm text-blue-400">{reply.author}</span>
                          <span className="text-xs text-gray-500 ml-auto">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {formatDate(reply.timestamp)}
                          </span>
                        </div>
                        <p className="text-gray-300">{reply.message}</p>
                      </div>
                    ))}
                    
                    {/* Reply Form */}
                    <div className="pt-3 border-t border-gray-800">
                      <div className="flex space-x-2">
                        <Textarea 
                          placeholder="Write a reply..."
                          className="bg-[#121218] border-gray-700 flex-grow"
                        />
                        <Button className="shrink-0">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 pt-2">
                      <span>
                        <Clock className="h-3 w-3 inline mr-1" />
                        Last updated: {formatDate(ticket.lastUpdate)}
                      </span>
                      {ticket.status !== 'closed' && (
                        <Button variant="outline" size="sm" className="text-xs border-gray-700">
                          Close Ticket
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* FAQs Tab */}
        <TabsContent value="faq" className="space-y-4">
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions about SmartHaven</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group">
                  <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-3 rounded-md hover:bg-[#171720]">
                    <span>{faq.question}</span>
                    <span className="transition group-open:rotate-180">
                      <svg fill="none" height="24" width="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  </summary>
                  <p className="text-gray-400 mt-2 mb-4 px-4">{faq.answer}</p>
                </details>
              ))}
            </CardContent>
          </Card>
          
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>Can't find what you're looking for?</CardTitle>
              <CardDescription>Our support team is here to help</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Button onClick={() => setActiveTab('contact')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default CustomerCare;