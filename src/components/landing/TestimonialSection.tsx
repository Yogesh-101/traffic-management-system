
import React from 'react';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    quote: "SmartFlow has transformed our city's traffic management approach. We've seen a 30% reduction in congestion and significant improvements in emergency response times.",
    author: "Sarah Johnson",
    title: "Traffic Commissioner, Portland",
    avatar: "SJ"
  },
  {
    quote: "The predictive analytics capabilities have been a game-changer for our planning department. We can now anticipate traffic patterns and proactively address potential issues.",
    author: "Michael Chen",
    title: "Urban Planning Director, San Francisco",
    avatar: "MC"
  },
  {
    quote: "Implementation was seamless and the ROI has exceeded our expectations. SmartFlow paid for itself within the first year through reduced congestion costs and improved productivity.",
    author: "Emma Rodriguez",
    title: "Smart City Program Manager, Austin",
    avatar: "ER"
  },
  {
    quote: "The data insights from SmartFlow have allowed us to make informed decisions about infrastructure investments. It's become an essential tool for our long-term planning.",
    author: "David Williams",
    title: "Transportation Director, Seattle",
    avatar: "DW"
  }
];

const TestimonialSection = () => {
  return (
    <section id="testimonials" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">What Our Clients Say</h2>
          <p className="text-muted-foreground text-lg">
            Hear from traffic management professionals who have implemented SmartFlow in their cities.
          </p>
        </div>
        
        <div className="relative px-10 max-w-5xl mx-auto">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2">
                  <Card className="border border-border/40 bg-background/95 h-full">
                    <CardContent className="p-6 flex flex-col justify-between h-full">
                      <blockquote className="text-muted-foreground italic mb-6">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarFallback className="bg-traffic-primary/20 text-traffic-primary">
                            {testimonial.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
