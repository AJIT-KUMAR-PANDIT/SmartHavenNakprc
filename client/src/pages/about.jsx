import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Building,
  Code,
  FileText,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Send,
  Shield,
  Users,
  Zap
} from 'lucide-react';

const AboutPage = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  // Company information
  const companyInfo = {
    name: 'SmartHaven Inc.',
    founded: '2021',
    mission: 'To create intelligent, secure, and user-friendly smart home solutions that enhance comfort, energy efficiency, and peace of mind for everyone.',
    employees: '120+',
    headquarters: 'San Francisco, California',
    offices: ['San Francisco, CA', 'New York, NY', 'London, UK', 'Bangalore, India'],
    values: [
      {
        title: 'Innovation',
        description: 'We constantly push the boundaries of what is possible in smart home technology.',
        icon: <Zap className="h-6 w-6" />
      },
      {
        title: 'Security',
        description: 'We prioritize the privacy and security of our users data and homes.',
        icon: <Shield className="h-6 w-6" />
      },
      {
        title: 'Sustainability',
        description: 'We develop energy-efficient solutions that help reduce environmental impact.',
        icon: <Globe className="h-6 w-6" />
      },
      {
        title: 'Community',
        description: 'We believe in building a community of users who help each other get the most from their smart homes.',
        icon: <Users className="h-6 w-6" />
      }
    ],
    socialMedia: [
      { name: 'Twitter', url: 'https://twitter.com/smarthaven', icon: 'ri-twitter-x-line' },
      { name: 'Facebook', url: 'https://facebook.com/smarthaven', icon: 'ri-facebook-fill' },
      { name: 'Instagram', url: 'https://instagram.com/smarthaven', icon: 'ri-instagram-line' },
      { name: 'LinkedIn', url: 'https://linkedin.com/company/smarthaven', icon: 'ri-linkedin-fill' },
      { name: 'GitHub', url: 'https://github.com/smarthaven', icon: 'ri-github-fill' }
    ],
    contactInfo: {
      email: 'info@smarthaven.example.com',
      phone: '+1 (800) 123-4567',
      address: '123 Tech Avenue, San Francisco, CA 94105, USA',
      supportHours: 'Monday-Friday: 9AM-6PM EST'
    }
  };
  
  // Team members
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      bio: 'Sarah has 15+ years of experience in IoT technology and previously led product at Nest.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVzaW5lc3MlMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      bio: 'Michael is a technology visionary with background in systems architecture and security.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhlYWRzaG90JTIwbWFufGVufDB8fDB8fHww'
    },
    {
      name: 'Alex Rodriguez',
      role: 'Head of Product',
      bio: 'Alex leads our product team, bringing seamless user experiences to complex technology.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhlYWRzaG90JTIwbWFufGVufDB8fDB8fHww'
    },
    {
      name: 'Priya Patel',
      role: 'Lead Engineer',
      bio: 'Priya oversees our engineering team, focusing on scalable and reliable software infrastructure.',
      image: 'https://images.unsplash.com/photo-1619857638054-080b9c99118e?w=250&h=250&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8d29tYW4lMjBpbmRpYW58ZW58MHx8MHx8fDA%3D'
    }
  ];
  
  // Handle contact form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle contact form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormError('Please fill in all required fields');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    // Submit form (this would be an API call in a real app)
    setIsSubmitting(true);
    setFormError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSuccess('Your message has been sent. We will get back to you shortly!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setFormSuccess('');
      }, 5000);
    }, 1500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-6"
    >
      <h1 className="text-3xl font-bold mb-2">About SmartHaven</h1>
      <p className="text-gray-400 mb-6">Learn about our company and get in touch with us</p>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="about" className="data-[state=active]:bg-[#2563eb]">
            About Us
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-[#2563eb]">
            Our Team
          </TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-[#2563eb]">
            Contact Us
          </TabsTrigger>
        </TabsList>
        
        {/* About Us Tab */}
        <TabsContent value="about" className="space-y-6">
          {/* Company Overview */}
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5 text-blue-500" />
                Company Overview
              </CardTitle>
              <CardDescription>Our mission and story</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/2">
                  <div className="aspect-video rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center mb-4">
                    <h2 className="text-3xl font-bold text-white">SmartHaven</h2>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-2">Our Mission</h3>
                  <p className="text-gray-400 mb-4">
                    {companyInfo.mission}
                  </p>
                  
                  <h3 className="text-lg font-medium mb-2">Company Facts</h3>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-blue-600">Founded</Badge>
                      {companyInfo.founded}
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-blue-600">Employees</Badge>
                      {companyInfo.employees}
                    </li>
                    <li className="flex items-center">
                      <Badge className="mr-2 bg-blue-600">HQ</Badge>
                      {companyInfo.headquarters}
                    </li>
                  </ul>
                </div>
                
                <div className="md:w-1/2">
                  <h3 className="text-lg font-medium mb-4">Our Core Values</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {companyInfo.values.map((value, index) => (
                      <div 
                        key={index}
                        className="p-4 rounded-lg bg-[#171720] border border-gray-800"
                      >
                        <div className="p-2 rounded-full bg-blue-900/20 w-fit mb-3">
                          {value.icon}
                        </div>
                        <h4 className="text-lg font-medium mb-1">{value.title}</h4>
                        <p className="text-sm text-gray-400">{value.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-800">
                <h3 className="text-lg font-medium mb-4">Our Global Presence</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {companyInfo.offices.map((office, index) => (
                    <div 
                      key={index}
                      className="p-3 rounded-lg bg-[#171720] border border-gray-800 flex items-center"
                    >
                      <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                      <span>{office}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Our Technology */}
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5 text-blue-500" />
                Our Technology
              </CardTitle>
              <CardDescription>The innovation behind SmartHaven</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-400">
                At SmartHaven, we have built a powerful IoT platform that seamlessly connects all your smart devices.
                Our technology stack includes:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-[#171720] border border-gray-800">
                  <h4 className="text-lg font-medium mb-2">Smart Hub Technology</h4>
                  <p className="text-sm text-gray-400">
                    Our proprietary hub technology enables reliable, low-latency communication with all your devices, 
                    even when internet connectivity is disrupted.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-[#171720] border border-gray-800">
                  <h4 className="text-lg font-medium mb-2">Security Architecture</h4>
                  <p className="text-sm text-gray-400">
                    We employ end-to-end encryption, regular security audits, and privacy-first design principles
                    to keep your home and data secure.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-[#171720] border border-gray-800">
                  <h4 className="text-lg font-medium mb-2">AI & Machine Learning</h4>
                  <p className="text-sm text-gray-400">
                    Our machine learning algorithms adapt to your usage patterns and preferences,
                    providing increasingly personalized automation and energy efficiency.
                  </p>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-3">Compatible Devices</h3>
                <p className="text-gray-400 mb-4">
                  SmartHaven works with thousands of smart home devices from hundreds of manufacturers, 
                  including these popular brands:
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gray-800">Phillips Hue</Badge>
                  <Badge className="bg-gray-800">Nest</Badge>
                  <Badge className="bg-gray-800">Ring</Badge>
                  <Badge className="bg-gray-800">Ecobee</Badge>
                  <Badge className="bg-gray-800">Sonos</Badge>
                  <Badge className="bg-gray-800">IKEA TRÅDFRI</Badge>
                  <Badge className="bg-gray-800">TP-Link</Badge>
                  <Badge className="bg-gray-800">August</Badge>
                  <Badge className="bg-gray-800">Arlo</Badge>
                  <Badge className="bg-gray-800">Samsung SmartThings</Badge>
                  <Badge className="bg-gray-800">Wemo</Badge>
                  <Badge className="bg-gray-800">Lutron</Badge>
                  <Badge className="bg-gray-800">Honeywell</Badge>
                  <Badge className="bg-gray-800">+ 100s more</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Connect with us */}
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>Connect With Us</CardTitle>
              <CardDescription>Follow us on social media</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {companyInfo.socialMedia.map((platform, index) => (
                  <Button 
                    key={index}
                    variant="outline"
                    className="border-gray-700 hover:bg-gray-800"
                    onClick={() => window.open(platform.url, '_blank')}
                  >
                    <i className={`${platform.icon} mr-2 text-lg`}></i>
                    {platform.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" />
                Leadership Team
              </CardTitle>
              <CardDescription>Meet the people behind SmartHaven</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center text-center"
                  >
                    <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border-2 border-blue-600">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-lg font-medium">{member.name}</h3>
                    <p className="text-blue-500 mb-2">{member.role}</p>
                    <p className="text-sm text-gray-400">{member.bio}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <h3 className="text-lg font-medium mb-3">Join Our Team</h3>
                <p className="text-gray-400 mb-4">
                  We are always looking for talented individuals who are passionate about technology and innovation.
                </p>
                <Button className="px-8">
                  View Careers
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-red-500" />
                Our Community
              </CardTitle>
              <CardDescription>Social responsibility and community engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-400">
                  At SmartHaven, we believe in giving back to communities and contributing to a more sustainable future. 
                  Here are some of our community initiatives:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-[#171720] border border-gray-800">
                    <h4 className="text-lg font-medium mb-2">SmartHaven Green</h4>
                    <p className="text-sm text-gray-400">
                      Our environmental initiative to reduce carbon footprint through energy-efficient smart home technology.
                      We have helped reduce energy consumption by over 1 million kWh in 2023.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-[#171720] border border-gray-800">
                    <h4 className="text-lg font-medium mb-2">Tech For All</h4>
                    <p className="text-sm text-gray-400">
                      Our program that donates smart home technology to low-income households and educational institutions,
                      helping bridge the digital divide.
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-[#171720] border border-gray-800">
                    <h4 className="text-lg font-medium mb-2">SmartHaven Academy</h4>
                    <p className="text-sm text-gray-400">
                      Free educational resources and workshops that teach students about IoT, programming, and smart technology.
                      We have reached over 5,000 students so far.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Contact Us Tab */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Contact Form */}
            <Card className="bg-[#1e1e2e] border-gray-700 lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="mr-2 h-5 w-5 text-blue-500" />
                  Send Us a Message
                </CardTitle>
                <CardDescription>We would love to hear from you</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                        className="bg-[#121218] border-gray-700"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="your.email@example.com"
                        className="bg-[#121218] border-gray-700"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      placeholder="What is your message about?"
                      className="bg-[#121218] border-gray-700"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Tell us how we can help..."
                      className="bg-[#121218] border-gray-700 min-h-[150px]"
                      required
                    />
                  </div>
                  
                  {formError && (
                    <div className="p-3 bg-red-900/20 border border-red-800 rounded-md text-red-400">
                      {formError}
                    </div>
                  )}
                  
                  {formSuccess && (
                    <div className="p-3 bg-green-900/20 border border-green-800 rounded-md text-green-400">
                      {formSuccess}
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    By submitting this form, you agree to our Privacy Policy and Terms of Service.
                  </p>
                </form>
              </CardContent>
            </Card>
            
            {/* Contact Information */}
            <Card className="bg-[#1e1e2e] border-gray-700 lg:col-span-2">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How to reach us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 mr-3 mt-1 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Email Us</h4>
                      <a 
                        href={`mailto:${companyInfo.contactInfo.email}`}
                        className="text-blue-500 hover:underline"
                      >
                        {companyInfo.contactInfo.email}
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 mr-3 mt-1 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Call Us</h4>
                      <a 
                        href={`tel:${companyInfo.contactInfo.phone.replace(/\D/g, '')}`}
                        className="text-blue-500 hover:underline"
                      >
                        {companyInfo.contactInfo.phone}
                      </a>
                      <p className="text-sm text-gray-400">
                        {companyInfo.contactInfo.supportHours}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 mt-1 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Visit Us</h4>
                      <p className="text-gray-400">
                        {companyInfo.contactInfo.address}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-800">
                  <h4 className="font-medium mb-3">Quick Links</h4>
                  <div className="space-y-2">
                    <Link href="/customer-care">
                      <a className="flex items-center text-blue-500 hover:underline">
                        <FileText className="h-4 w-4 mr-2" />
                        Customer Support
                      </a>
                    </Link>
                    
                    <Link href="/my-plan">
                      <a className="flex items-center text-blue-500 hover:underline">
                        <FileText className="h-4 w-4 mr-2" />
                        Subscription Plans
                      </a>
                    </Link>
                    
                    <a 
                      href="#"
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Privacy Policy
                    </a>
                    
                    <a 
                      href="#"
                      className="flex items-center text-blue-500 hover:underline"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Terms of Service
                    </a>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-800">
                  <h4 className="font-medium mb-3">Follow Us</h4>
                  <div className="flex flex-wrap gap-2">
                    {companyInfo.socialMedia.map((platform, index) => (
                      <Button 
                        key={index}
                        variant="outline"
                        size="sm"
                        className="border-gray-700"
                        onClick={() => window.open(platform.url, '_blank')}
                      >
                        <i className={`${platform.icon} mr-1`}></i>
                        {platform.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* FAQ Section */}
          <Card className="bg-[#1e1e2e] border-gray-700">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#171720] border border-gray-800">
                  <h4 className="font-medium mb-2">How can I get technical support?</h4>
                  <p className="text-sm text-gray-400">
                    Visit our Customer Care page for support options, including live chat, phone support, 
                    and our comprehensive knowledge base.
                  </p>
                  <Link href="/customer-care">
                    <a className="text-sm text-blue-500 hover:underline mt-2 inline-block">
                      Go to Customer Care
                    </a>
                  </Link>
                </div>
                
                <div className="p-4 rounded-lg bg-[#171720] border border-gray-800">
                  <h4 className="font-medium mb-2">Where can I purchase SmartHaven products?</h4>
                  <p className="text-sm text-gray-400">
                    SmartHaven products are available on our website, Amazon, Best Buy, 
                    and other major electronics retailers.
                  </p>
                  <a 
                    href="#"
                    className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                  >
                    Find Retailers
                  </a>
                </div>
                
                <div className="p-4 rounded-lg bg-[#171720] border border-gray-800">
                  <h4 className="font-medium mb-2">Do you offer refunds?</h4>
                  <p className="text-sm text-gray-400">
                    Yes, we offer a 30-day satisfaction guarantee on all our products. 
                    If you are not happy with your purchase, we will provide a full refund.
                  </p>
                  <a 
                    href="#"
                    className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                  >
                    Refund Policy
                  </a>
                </div>
                
                <div className="p-4 rounded-lg bg-[#171720] border border-gray-800">
                  <h4 className="font-medium mb-2">How can I become a partner?</h4>
                  <p className="text-sm text-gray-400">
                    We are always looking for partnerships with retailers, installers, and technology providers. 
                    Contact our partnerships team to learn more.
                  </p>
                  <a 
                    href="#"
                    className="text-sm text-blue-500 hover:underline mt-2 inline-block"
                  >
                    Partnership Program
                  </a>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/customer-care">
                <a className="text-blue-500 hover:underline">
                  View all FAQs
                </a>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AboutPage;