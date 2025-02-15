
import { ArrowRight, Building2, Users, Calendar } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <h1 className="text-7xl font-bold tracking-tight animate-fade-in">
            Welcome to{' '}
            <span className="inline-block" style={{ background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Hostel Hub
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Simplify hostel management with our intuitive platform. Book, manage, and explore 
            accommodations with ease and confidence.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <button className="group px-8 py-4 bg-primary text-primary-foreground rounded-xl text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-primary/20 rounded-xl text-lg font-semibold hover:bg-primary/10 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Building2 className="text-primary" />,
              title: "Smart Booking",
              description: "Effortlessly manage room allocations and bookings with our intelligent system."
            },
            {
              icon: <Users className="text-primary" />,
              title: "Community Hub",
              description: "Connect with fellow travelers and build lasting relationships in our vibrant community."
            },
            {
              icon: <Calendar className="text-primary" />,
              title: "Event Planning",
              description: "Organize and participate in hostel events with our integrated calendar system."
            }
          ].map((feature, index) => (
            <div key={index} className="p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border hover:border-primary/50 transition-all hover:scale-105">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;