import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Shield,
  FileText,
  Users,
  BarChart3,
  ArrowRight,
  Lock,
  Cloud,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Document Management",
      description:
        "Securely store and organize all your contracts, NDAs, SLAs and legal documents",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Share documents with team members and manage access permissions",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Track document usage, access patterns and get valuable insights",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and security features to protect sensitive data",
    },
    {
      icon: Cloud,
      title: "Cloud Storage",
      description:
        "Reliable cloud storage with automatic backups and version control",
    },
    {
      icon: Shield,
      title: "Compliance Ready",
      description:
        "Built-in compliance features for legal and regulatory requirements",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-light/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-primary rounded-full shadow-strong">
              <Shield className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
            ContractHub
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Professional contract management system for modern businesses.
            Secure, efficient, and compliant document management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              size="lg"
              variant="professional"
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto"
            >
              Access Dashboard
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/login")}
              className="w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>

          <div className="pt-8 text-sm text-muted-foreground">
            <p>
              Demo credentials: <strong>username:</strong> admin,{" "}
              <strong>password:</strong> password123
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Features for Contract Management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage contracts and legal documents
            efficiently and securely.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-primary-light rounded-full w-fit">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-16">
        <Card className="bg-gradient-to-r from-primary to-primary-hover text-primary-foreground shadow-strong">
          <CardContent className="text-center py-16">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-8 opacity-90">
              Join hundreds of companies already using ContractHub for their
              document management needs.
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/login")}
            >
              Start Managing Contracts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
